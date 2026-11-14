import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getAllGalleryImages } from "@/lib/gallery-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs of life at the Mallayyagiri Ashram — satsang, festivals, annadanam and the quiet moments in between.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Sri Basavalinga Avadhoota Ashram",
    description:
      "Moments of grace from the ashram: satsang, festivals, seva and the people who make it home.",
    url: "/gallery",
    images: ["/images/gallery-festival.jpg"],
  },
};

export default async function GalleryPage() {
  const images = await getAllGalleryImages();

  return (
    <>
      <PageHero
        eyebrow="Moments of Grace"
        title="The Ashram in Pictures"
        description="Festival lights, shared meals, folded hands and the ordinary afternoons that hold a spiritual community together."
        breadcrumb="Gallery"
        image="/images/gallery-festival.jpg"
        imageAlt="A festival shrine decorated with flowers and lights at the ashram"
      />

      <section className="section-pad bg-cream">
        <div className="container-site">
          <Reveal>
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2.5">
                  <Camera className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  From the Archives
                </p>
                <h2 className="text-[2rem] sm:text-[2.4rem]">A Living Album</h2>
                <p className="mt-3 max-w-xl text-[0.88rem] leading-[1.85] text-ink-soft">
                  Browse by moment. Select any photograph to open the full-screen
                  viewer, then use the arrow keys, on-screen controls or a swipe
                  to move through the album.
                </p>
              </div>
              <p className="max-w-xs text-[0.7rem] leading-relaxed text-ink-soft/55">
                Photographs are shared from the ashram archives with reverence
                for the people pictured.
              </p>
            </div>
          </Reveal>

          <GalleryExplorer images={images} />

          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-gold/30 bg-cream-100/70 px-6 py-7 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-xl">Have a photograph to share?</h2>
              <p className="mt-1.5 text-[0.8rem] text-ink-soft">
                If you have images from a satsang or festival, the ashram would
                love to hear from you.
              </p>
            </div>
            <Button href="/contact" variant="outline" size="sm">
              Contact the ashram
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
