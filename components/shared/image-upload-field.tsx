"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UploadActionState } from "@/features/settings/actions/upload-actions";

type Props = {
  label: string;
  description?: string;
  currentImageUrl?: string | null;
  fallbackLabel: string;
  action: (
    prev: UploadActionState,
    formData: FormData,
  ) => Promise<UploadActionState>;
  shape?: "square" | "circle";
  imageAlt: string;
};

const initialState: UploadActionState = {};

export function ImageUploadField({
  label,
  description,
  currentImageUrl,
  fallbackLabel,
  action,
  shape = "square",
  imageAlt,
}: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(currentImageUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    setSavedUrl(currentImageUrl ?? null);
  }, [currentImageUrl]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success(state.success);
      if (state.imageUrl) setSavedUrl(state.imageUrl);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    }
  }, [state.error, state.success, state.imageUrl, router]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.set("file", file);
    formAction(formData);
  }

  const displayUrl = previewUrl ?? savedUrl ?? null;
  const isCircle = shape === "circle";

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{label}</Label>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div
          className={cn(
            "relative flex size-16 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted/40",
            isCircle ? "rounded-full" : "rounded-xl",
          )}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={imageAlt}
              fill
              unoptimized
              className={isCircle ? "object-cover" : "object-contain p-1"}
            />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">
              {fallbackLabel}
            </span>
          )}
          {pending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
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
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                Choose image
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP · max 2 MB</p>
        </div>
      </div>
    </div>
  );
}
