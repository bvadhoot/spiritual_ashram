"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery";
import { useDialog } from "@/lib/use-dialog";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const close = useCallback(() => onClose(), [onClose]);
  const active = index !== null;

  useDialog(active, dialogRef, close);

  const goTo = useCallback(
    (direction: number) => {
      if (index === null || images.length === 0) return;
      const next = (index + direction + images.length) % images.length;
      onIndexChange(next);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (index === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [index, goTo]);

  useEffect(() => {
    if (index === null || images.length < 2) return;
    const nextImage = images[(index + 1) % images.length];
    const previousImage = images[(index - 1 + images.length) % images.length];
    for (const image of [nextImage, previousImage]) {
      const preload = new window.Image();
      preload.src = image.src;
    }
  }, [index, images]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {active && current ? (
        <motion.div
          className="fixed inset-0 z-[95] bg-maroon-deep/97 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const end = event.changedTouches[0]?.clientX ?? touchStart.current;
            const delta = end - touchStart.current;
            if (Math.abs(delta) > 50) goTo(delta > 0 ? -1 : 1);
            touchStart.current = null;
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${index + 1} of ${images.length}: ${current.caption}`}
            tabIndex={-1}
            className="flex h-full w-full flex-col outline-none"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
              <div className="flex items-center gap-3 text-cream/70">
                <span className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold uppercase">
                  Gallery
                </span>
                <span className="h-3 w-px bg-cream/20" aria-hidden="true" />
                <span className="text-xs tabular-nums">
                  {index + 1} / {images.length}
                </span>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-gold/70 hover:bg-cream/10 hover:text-cream"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 sm:px-20">
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous image"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-maroon-deep/70 text-cream/80 backdrop-blur-sm transition hover:border-gold/70 hover:bg-gold hover:text-maroon-deep sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative h-full max-h-[calc(100dvh-11rem)] w-full max-w-6xl"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(min-width: 1024px) 80vw, 96vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next image"
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-maroon-deep/70 text-cream/80 backdrop-blur-sm transition hover:border-gold/70 hover:bg-gold hover:text-maroon-deep sm:right-6"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 pb-6 pt-2 text-center sm:pb-8">
              <p className="font-serif text-lg text-cream sm:text-xl">{current.caption}</p>
              <p className="mt-1.5 text-[0.65rem] tracking-[0.18em] text-cream/45 uppercase">
                {current.category} · Use arrow keys to browse · Esc to close
              </p>
              <div
                className={cn(
                  "mt-4 flex items-center justify-center gap-1.5",
                  images.length > 10 && "hidden",
                )}
                aria-hidden="true"
              >
                {images.map((image, imageIndex) => (
                  <span
                    key={image.id}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      imageIndex === index ? "w-6 bg-gold" : "w-1.5 bg-cream/25",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
