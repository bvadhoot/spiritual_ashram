"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "@/components/gallery/lightbox";
import type { GalleryImage } from "@/lib/gallery";
import { cn } from "@/lib/utils";

export function GalleryPreview({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid h-[23rem] grid-cols-5 grid-rows-3 gap-2 sm:h-[27rem] sm:gap-3 lg:h-[31rem]">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open gallery image ${index + 1}: ${image.caption}`}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-maroon focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold",
              index === 0
                ? "col-span-3 row-span-3 rounded-2xl"
                : "col-span-2 row-span-1",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                index === 0
                  ? "(min-width: 1024px) 36vw, 60vw"
                  : "(min-width: 1024px) 24vw, 40vw"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <span
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-maroon-deep/75 via-maroon-deep/5 to-transparent transition-opacity duration-300",
                index === 0 ? "opacity-90" : "opacity-70 group-hover:opacity-90",
              )}
              aria-hidden="true"
            />

            <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 bg-maroon-deep/50 text-cream/85 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>

            {index === 0 ? (
              <span className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
                <span className="block text-[0.56rem] font-semibold tracking-[0.2em] text-gold uppercase">
                  {image.category}
                </span>
                <span className="mt-1 block font-serif text-[1.05rem] leading-snug text-cream sm:text-[1.25rem]">
                  {image.caption}
                </span>
              </span>
            ) : (
              <span className="absolute inset-x-0 bottom-0 translate-y-2 p-2.5 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block text-[0.6rem] leading-tight font-medium text-cream">
                  {image.caption}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </>
  );
}
