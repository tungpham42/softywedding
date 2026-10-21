"use client";

import { useState, type ChangeEvent } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Icon } from "@/components/ui/icon";
import Image from "next/image";

type SignatureResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  error?: string;
};

type UploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
};

type CloudinaryUploadProps = {
  onImageUploaded?: (url: string) => void | Promise<void>;
  onImageRemoved?: () => void | Promise<void>;
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttonLabel?: string;
  currentImageUrl?: string;
  currentImageAlt?: string;
};

export function CloudinaryUpload({
  onImageUploaded,
  onImageRemoved,
  eyebrow = "Your inspiration board",
  heading = "Add a photo to the story",
  description = "Upload an image securely to Cloudinary. Sign in is required; the image URL is returned for use in your wedding editor.",
  buttonLabel = "Upload a photo",
  currentImageUrl = "",
  currentImageAlt = "Wedding photo preview",
}: CloudinaryUploadProps) {
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const previewUrl = imageRemoved ? "" : imageUrl || currentImageUrl;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setCopied(false);

    if (
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        file.type,
      )
    ) {
      setError("Choose a JPG, PNG, WebP, or AVIF image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB.");
      return;
    }

    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) {
      setError("Sign in with Google first to upload photos.");
      return;
    }

    setBusy(true);
    try {
      const token = await user.getIdToken();
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const signature = (await signatureResponse.json()) as SignatureResponse;
      if (!signatureResponse.ok) {
        throw new Error(
          signature.error || "Could not prepare a secure upload.",
        );
      }

      const form = new FormData();
      form.set("file", file);
      form.set("api_key", signature.apiKey);
      form.set("timestamp", String(signature.timestamp));
      form.set("folder", signature.folder);
      form.set("signature", signature.signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      const upload = (await uploadResponse.json()) as UploadResponse;
      if (!uploadResponse.ok || !upload.secure_url) {
        throw new Error(
          upload.error?.message || "The image could not be uploaded.",
        );
      }

      // Wait for Firestore to save the new URL before treating it as the active image.
      await onImageUploaded?.(upload.secure_url);
      setImageRemoved(false);
      setImageUrl(upload.secure_url);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The image could not be uploaded. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveImage() {
    if (!onImageRemoved || !previewUrl) return;
    if (!window.confirm("Remove this cover photo from your wedding website?"))
      return;

    setBusy(true);
    setError("");
    setCopied(false);
    try {
      // The parent clears the saved Firestore URL before the preview is removed.
      await onImageRemoved();
      setImageRemoved(true);
      setImageUrl("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not remove the cover photo. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl() {
    if (!previewUrl) return;
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
    } catch {
      setError(
        "Copying is unavailable in this browser. Open the image URL directly instead.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine">
            <Icon name="camera" size={18} />
          </span>
          <div>
            <p className="eyebrow text-muted">{eyebrow}</p>
            <h2 className="font-display mt-1 text-[24px]">{heading}</h2>
            <p className="mt-1 max-w-md text-xs leading-5 text-muted">
              {description}
            </p>
          </div>
        </div>
        <label
          className={`inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold transition-colors ${busy ? "bg-[#d9ded4] text-muted" : "bg-pine text-white hover:bg-pine-dark"}`}
        >
          <Icon name={busy ? "clock" : "camera"} size={15} />
          {busy ? "Uploading photo…" : buttonLabel}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy}
            onChange={handleFileChange}
            className="sr-only"
            aria-label={buttonLabel}
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-[#fbebe7] px-3 py-2 text-xs leading-5 text-[#8c4937]"
        >
          {error}
        </p>
      )}

      {previewUrl && (
        <div className="mt-5 grid gap-4 rounded-xl bg-sage-soft p-3 sm:grid-cols-[160px_1fr] sm:items-center">
          <Image
            src={previewUrl}
            alt={currentImageAlt}
            className="h-[120px] w-full rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {imageUrl
                ? "Cover photo updated"
                : currentImageUrl
                  ? "Current cover photo"
                  : "Your photo is uploaded."}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted">
              {imageUrl
                ? "Your new image has been saved to this wedding."
                : "Upload another image to replace this one."}
            </p>
            <p className="mt-1 break-all text-[11px] leading-5 text-muted">
              {previewUrl}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={copyUrl}
                disabled={busy}
                className="text-xs font-semibold text-pine underline underline-offset-4 disabled:opacity-50"
              >
                {copied ? "Copied URL" : "Copy image URL"}
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-pine underline underline-offset-4"
              >
                Open image <Icon name="arrow-up-right" size={12} />
              </a>
              {onImageRemoved && (
                <button
                  type="button"
                  onClick={() => void handleRemoveImage()}
                  disabled={busy}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-terra underline underline-offset-4 disabled:opacity-50"
                >
                  <Icon name="close" size={12} />
                  {busy ? "Please wait…" : "Remove cover photo"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
