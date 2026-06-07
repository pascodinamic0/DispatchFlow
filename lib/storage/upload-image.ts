import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/storage/constants";
import type { Database } from "@/types/database";

type StorageClient = SupabaseClient<Database>;

const MIME_BY_SUFFIX: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function resolveImageMimeType(file: File): string | null {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return file.type;

  const suffix = file.name.split(".").pop()?.toLowerCase();
  if (!suffix) return null;
  return MIME_BY_SUFFIX[suffix] ?? null;
}

export function validateImageFile(file: File): string | null {
  if (!file.size) return "Choose an image file";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 2 MB or smaller";
  if (!resolveImageMimeType(file)) {
    return "Use a JPEG, PNG, or WebP image";
  }
  return null;
}

export async function uploadImageToBucket(
  supabase: StorageClient,
  input: {
    bucket: string;
    path: string;
    file: File;
  },
): Promise<string> {
  const validationError = validateImageFile(input.file);
  if (validationError) throw new Error(validationError);

  const mimeType = resolveImageMimeType(input.file);
  if (!mimeType) throw new Error("Unsupported image type");

  const ext = ALLOWED_IMAGE_EXTENSIONS[mimeType];
  if (!ext) throw new Error("Unsupported image type");

  const path = input.path.endsWith(`.${ext}`)
    ? input.path
    : `${input.path}.${ext}`;

  const { error } = await supabase.storage
    .from(input.bucket)
    .upload(path, input.file, {
      upsert: true,
      contentType: mimeType,
      cacheControl: "3600",
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(input.bucket).getPublicUrl(path);

  return `${publicUrl}?v=${Date.now()}`;
}
