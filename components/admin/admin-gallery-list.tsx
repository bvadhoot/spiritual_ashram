"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery";

export function AdminGalleryList({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (images.length === 0) {
    return (
      <p className="py-8 text-center text-[0.8rem] text-ink-soft">
        No admin uploads yet. Add a photograph to start the new album.
      </p>
    );
  }

  async function remove(image: GalleryImage) {
    const confirmed = window.confirm(
      `Remove “${image.caption}” from the public gallery? This cannot be undone.`,
    );
    if (!confirmed) return;

    setPending(image.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/gallery?id=${encodeURIComponent(image.id)}`,
        { method: "DELETE" },
      );
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The photograph could not be removed.");
      }

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The photograph could not be removed.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-4">
      {error ? (
        <p
          role="alert"
          className="mb-3 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[0.72rem] text-red-800"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-cream-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep/85 to-transparent px-2 py-1.5 text-[0.58rem] leading-tight text-cream">
              {image.caption}
            </span>
            <button
              type="button"
              onClick={() => remove(image)}
              disabled={pending === image.id}
              aria-label={`Remove ${image.caption} from the gallery`}
              className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-cream/30 bg-maroon-deep/70 text-cream opacity-0 backdrop-blur-sm transition hover:bg-red-700 focus-visible:opacity-100 group-hover:opacity-100 disabled:opacity-100"
            >
              {pending === image.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.65rem] text-ink-soft/60">
        {images.length} uploaded photograph{images.length === 1 ? "" : "s"}. Hover
        a tile to reveal the remove button.
      </p>
    </div>
  );
}
