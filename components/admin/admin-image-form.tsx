"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ADMIN_GALLERY_CATEGORIES,
  validateGalleryMeta,
  type GalleryMetaInput,
} from "@/lib/admin-validation";
import type { GalleryImage } from "@/lib/gallery";
import type { FieldErrors } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500";

const labelClass =
  "mb-1.5 block text-[0.66rem] font-semibold tracking-[0.1em] text-maroon uppercase";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.fillStyle = "#fdfbf7";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.86),
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "gallery-photo";
    return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function AdminImageForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<GalleryMetaInput>({
    caption: "",
    alt: "",
    category: "Satsang",
    featured: false,
  });
  const [errors, setErrors] = useState<FieldErrors<GalleryMetaInput>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function update<K extends keyof GalleryMetaInput>(
    field: K,
    value: GalleryMetaInput[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!file) {
      setStatus("error");
      setMessage("Please choose a photograph to upload.");
      return;
    }

    const validation = validateGalleryMeta(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("saving");

    try {
      const prepared = await compressImage(file);
      if (prepared.size > MAX_FILE_BYTES) {
        throw new Error(
          "This image is still larger than 4 MB after compression. Please choose a smaller photograph.",
        );
      }

      const form = new FormData();
      form.append("file", prepared);
      form.append("caption", validation.data.caption);
      form.append("alt", validation.data.alt);
      form.append("category", validation.data.category);
      form.append("featured", String(validation.data.featured));

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: form,
      });
      const result = (await response.json()) as {
        ok?: boolean;
        image?: GalleryImage;
        error?: string;
        errors?: FieldErrors<GalleryMetaInput>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "The photograph could not be uploaded.");
      }

      setStatus("success");
      setMessage(
        `${result.image?.caption ?? "Photograph"} is now in the public gallery.`,
      );
      setFile(null);
      setValues({
        caption: "",
        alt: "",
        category: "Satsang",
        featured: false,
      });
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error
          ? caught.message
          : "The photograph could not be uploaded.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start gap-3 border-b border-maroon/10 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-gold">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl">Upload a photograph</h2>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-soft">
            New images are compressed for the web and appear in the public
            gallery.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="admin-image-file" className={labelClass}>
            Photograph <span className="text-maroon/45">*</span>
          </label>
          <input
            id="admin-image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setStatus("idle");
              setMessage("");
            }}
            className="block w-full cursor-pointer rounded-xl border border-dashed border-maroon/20 bg-cream-100/60 px-3.5 py-3 text-[0.75rem] text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-maroon file:px-4 file:py-2 file:text-[0.68rem] file:font-semibold file:text-cream hover:border-gold"
          />
          <p className="mt-1.5 text-[0.65rem] text-ink-soft/55">
            JPEG, PNG or WebP. Large phone photos are resized automatically.
          </p>
          {file ? (
            <p className="mt-1 text-[0.65rem] text-maroon">
              Selected: {file.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="admin-image-caption" className={labelClass}>
            Caption <span className="text-maroon/45">*</span>
          </label>
          <input
            id="admin-image-caption"
            value={values.caption}
            onChange={(event) => update("caption", event.target.value)}
            aria-invalid={Boolean(errors.caption)}
            className={inputClass}
            placeholder="Evening prayer at the shrine"
          />
          {errors.caption ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.caption}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="admin-image-alt" className={labelClass}>
            Description for accessibility <span className="text-maroon/45">*</span>
          </label>
          <input
            id="admin-image-alt"
            value={values.alt}
            onChange={(event) => update("alt", event.target.value)}
            aria-invalid={Boolean(errors.alt)}
            className={inputClass}
            placeholder="Devotees gathered before a flower-decorated shrine"
          />
          {errors.alt ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.alt}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="admin-image-category" className={labelClass}>
            Gallery section
          </label>
          <select
            id="admin-image-category"
            value={values.category}
            onChange={(event) =>
              update(
                "category",
                event.target.value as GalleryMetaInput["category"],
              )
            }
            className={inputClass}
          >
            {ADMIN_GALLERY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-gold/25 bg-cream-100/70 px-3.5 py-3">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-maroon/30 accent-maroon"
          />
          <span className="text-[0.74rem] leading-relaxed text-ink-soft">
            Feature this photograph on the homepage gallery.
          </span>
        </label>

        {message ? (
          <div
            role="status"
            className={`flex gap-2.5 rounded-xl border px-3.5 py-3 text-[0.75rem] leading-relaxed ${
              status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{message}</span>
          </div>
        ) : null}

        <Button type="submit" disabled={status === "saving"} className="w-full">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" aria-hidden="true" />
              Add to gallery
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
