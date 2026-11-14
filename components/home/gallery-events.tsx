import Link from "next/link";
import { ArrowRight, CalendarDays, Camera, MapPin } from "lucide-react";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { EventCard } from "@/components/events/event-card";
import { getFeaturedGalleryImages } from "@/lib/gallery-store";
import { getUpcomingEvents } from "@/lib/events";

export async function GalleryEvents() {
  const [images, upcoming] = await Promise.all([
    getFeaturedGalleryImages(4),
    getUpcomingEvents(2),
  ]);

  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-cream"
    >
      <div className="container-site section-pad">
        <div className="grid gap-14 lg:grid-cols-[1.16fr_0.84fr] lg:gap-16 xl:gap-20">
          <div>
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="eyebrow mb-3 flex items-center gap-3">
                  <Camera className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  Moments of Grace
                </p>
                <h2 id="gallery-heading" className="text-[2rem] sm:text-[2.35rem]">
                  Gallery
                </h2>
              </div>
              <Link
                href="/gallery"
                className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-[0.66rem] font-semibold tracking-[0.15em] text-maroon-soft uppercase transition-colors hover:text-maroon"
              >
                View All
                <ArrowRight
                  className="h-3.5 w-3.5 text-gold transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <GalleryPreview images={images} />

            <p className="mt-4 text-[0.7rem] text-ink-soft/60">
              Click any photograph to view it larger. Use the arrow keys to browse.
            </p>
          </div>

          <div className="lg:border-l lg:border-maroon/10 lg:pl-12 xl:pl-16">
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="eyebrow mb-3 flex items-center gap-3">
                  <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  The Ashram Calendar
                </p>
                <h2 className="text-[2rem] sm:text-[2.35rem]">Upcoming Events</h2>
              </div>
              <Link
                href="/events"
                className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-[0.66rem] font-semibold tracking-[0.15em] text-maroon-soft uppercase transition-colors hover:text-maroon"
              >
                View All
                <ArrowRight
                  className="h-3.5 w-3.5 text-gold transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="space-y-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-gold/30 bg-cream-100/70 p-5">
              <p className="flex items-start gap-2.5 text-[0.75rem] leading-relaxed text-ink-soft">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon/60" aria-hidden="true" />
                <span>
                  All satsangs and festivals are free and open to everyone.
                  Annadanam is served daily at the ashram.
                </span>
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.66rem] font-semibold tracking-[0.12em] text-maroon uppercase underline decoration-gold/60 underline-offset-4 hover:decoration-gold"
              >
                Plan your visit
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
