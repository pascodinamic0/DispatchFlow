"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveOrganizationLogoUrl } from "@/features/settings/actions/logo-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  ORGANIZATION_LOGOS_BUCKET,
} from "@/lib/storage/constants";
import { createClient } from "@/lib/supabase/client";

type Props = {
  organizationId: string;
  organizationName: string;
  currentLogoUrl?: string | null;
};

export function OrganizationLogoUpload({
  organizationId,
  organizationName,
  currentLogoUrl,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(
    currentLogoUrl ?? null,
  );

  useEffect(() => {
    if (currentLogoUrl) setSavedUrl(currentLogoUrl);
  }, [currentLogoUrl]);

  const displayUrl = previewUrl ?? savedUrl;
  const fallbackLabel = organizationName.slice(0, 2).toUpperCase();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast.error("Choose an image file first");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error("Use a JPEG, PNG, or WebP image");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 2 MB or smaller");
      return;
    }

    const ext = ALLOWED_IMAGE_EXTENSIONS[file.type];
    if (!ext) {
      toast.error("Unsupported image type");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const path = `${organizationId}/logo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(ORGANIZATION_LOGOS_BUCKET)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(ORGANIZATION_LOGOS_BUCKET).getPublicUrl(path);

      const logoUrl = `${publicUrl}?v=${Date.now()}`;
      const result = await saveOrganizationLogoUrl(logoUrl);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setSavedUrl(logoUrl);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success(result.success ?? "Company logo updated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload logo",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Company logo</Label>
        <p className="text-xs text-muted-foreground">
          Appears in the sidebar for everyone in your workspace (top-left logo
          area).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={`${organizationName} logo`}
              fill
              unoptimized
              className="object-contain p-1"
            />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">
              {fallbackLabel}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={pending}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="size-4" />
            Choose image
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={pending || !previewUrl}
            onClick={handleUpload}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, or WebP · max 2 MB
          </p>
        </div>
      </div>
    </div>
  );
}
