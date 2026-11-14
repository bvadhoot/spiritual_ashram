"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "@/components/gallery/lightbox";
import {
  galleryCategories,
  type GalleryCategory,
  type GalleryImage,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type Filter = "All" | GalleryCategory;

export function GalleryExplorer({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? images : images.filter((image) => image.category === filter)),
    [filter, images],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-maroon/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter gallery by category"
        >
          {galleryCategories.map((category) => {
            const selected = filter === category;
            const count =
              category === "All"
                ? images.length
                : images.filter((image) => image.category === category).length;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setFilter(category);
                  setActiveIndex(null);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[0.68rem] font-semibold tracking-[0.08em] transition-all duration-200",
                  selected
                    ? "border-maroon bg-maroon text-cream shadow-[0_8px_20px_-14px_rgba(74,28,28,0.9)]"
                    : "border-maroon/15 bg-cream text-ink-soft hover:border-gold hover:text-maroon",
                )}
              >
                {category}
                <span
                  className={cn(
                    "text-[0.58rem]",
                    selected ? "text-gold/80" : "text-ink-soft/45",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[0.68rem] tracking-[0.1em] text-ink-soft/55 uppercase" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}
        </p>
      </div>

      <div className="mt-7 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open gallery image: ${image.caption}`}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-maroon text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
          >
            <div
              className={cn(
                "relative w-full",
                index % 5 === 0
                  ? "h-[19rem] sm:h-[24rem]"
                  : index % 3 === 0
                    ? "h-[18rem] sm:h-[21rem]"
                    : "h-[15rem] sm:h-[18rem]",
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </div>

            <span
              className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 via-maroon-deep/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />

            <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 bg-maroon-deep/50 text-cream/90 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>

            <span className="absolute inset-x-0 bottom-0 p-4">
              <span className="block text-[0.55rem] font-semibold tracking-[0.18em] text-gold uppercase">
                {image.category}
              </span>
              <span className="mt-1 block font-serif text-[1rem] leading-snug text-cream">
                {image.caption}
              </span>
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-ink-soft">
          No photographs in this category yet.
        </p>
      ) : null}

      <Lightbox
        images={filtered}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </div>
  );
}
