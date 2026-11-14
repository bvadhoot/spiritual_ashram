import type { Metadata } from "next";
import { ArrowRight, BellRing, CalendarDays, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { HinduCalendar } from "@/components/events/hindu-calendar";
import { MemberSignupForm } from "@/components/events/member-signup-form";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import {
  getAllEvents,
  getUpcomingEventsFrom,
  todayInIndia,
} from "@/lib/events";
import {
  getDayCalendar,
  getMonthCalendar,
  toCalendarEvent,
  upcomingFestivalsWith,
} from "@/lib/panchang";
import { getStoredFestivals } from "@/lib/panchang/festival-store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming Events & Satsangs",
  description:
    "The ashram calendar: satsangs, festivals, yoga sadhana camps and annadanam at Mallayyagiri. Past events are removed automatically.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Upcoming Events & Satsangs | Mallayyagiri Ashram",
    description:
      "Join the ashram for satsang, festivals and seva. See what is coming up at Mallayyagiri.",
    url: "/events",
    images: ["/images/gallery-night.jpg"],
  },
};

export default async function EventsPage() {
  const today = todayInIndia();
  const allEvents = await getAllEvents();
  const upcoming = getUpcomingEventsFrom(allEvents, undefined, today);
  const featured = upcoming.slice(0, 2);
  const remaining = upcoming.slice(2);
  const festivalOverrides = await getStoredFestivals();
  const calendarEvents = allEvents.map(toCalendarEvent);
  const calendarMonth = getMonthCalendar(
    today.slice(0, 7),
    calendarEvents,
    today,
    festivalOverrides,
  );
  const todayCalendar = await getDayCalendar(
    today,
    calendarEvents,
    today,
    festivalOverrides,
  );
  const nextFestivals = upcomingFestivalsWith(festivalOverrides, today, 5);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming events at Sri Basavalinga Avadhoota Ashram",
    itemListElement: upcoming.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        startDate: event.date,
        endDate: event.endDate ?? event.date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        description: event.description,
        location: {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Jharasangam",
            addressRegion: "Telangana",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: site.shortName,
          url: site.url,
        },
      },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="The Ashram Calendar"
        title="Come, Sit, and Be Still"
        description="Satsangs, festivals and sadhana camps at Mallayyagiri. Every gathering is free and open to all — and the ashram's kitchen is always ready for one more guest."
        breadcrumb="Events"
        image="/images/gallery-night.jpg"
        imageAlt="Devotees gathered at night under lights for a satsang"
      />

      <section className="section-pad bg-cream" aria-labelledby="upcoming-heading">
        <div className="container-site">
          <Reveal>
            <div className="flex flex-col gap-5 border-b border-maroon/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2.5">
                  <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  What&apos;s Coming
                </p>
                <h2 id="upcoming-heading" className="text-[2rem] sm:text-[2.5rem]">
                  Upcoming Events
                </h2>
                <p className="mt-3 max-w-xl text-[0.85rem] leading-relaxed text-ink-soft">
                  The calendar updates itself as dates pass. Only future
                  gatherings are shown here.
                </p>
              </div>
              <div className="rounded-full border border-gold/30 bg-cream-100/70 px-4 py-2 text-[0.65rem] font-semibold tracking-[0.1em] text-maroon">
                {upcoming.length} upcoming {upcoming.length === 1 ? "gathering" : "gatherings"}
              </div>
            </div>
          </Reveal>

          {upcoming.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-gold/30 bg-cream-100/60 px-6 py-16 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
              <h3 className="mt-5 text-2xl">A quiet season</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                There are no scheduled gatherings at the moment. Satsang still
                takes place at the ashram — please call the office to confirm the
                current programme.
              </p>
              <Button href="/contact" className="mt-6">
                Contact the ashram
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                {featured.map((event, index) => (
                  <Reveal key={event.id} delay={index * 0.06}>
                    <EventCard event={event} variant="featured" />
                  </Reveal>
                ))}
              </div>

              {remaining.length > 0 ? (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {remaining.map((event, index) => (
                    <Reveal key={event.id} delay={index * 0.04}>
                      <EventCard event={event} />
                    </Reveal>
                  ))}
                </div>
              ) : null}

              <div className="mt-10 grid gap-4 rounded-2xl border border-gold/30 bg-cream-100/70 p-6 sm:grid-cols-3">
                {[
                  "Free and open to everyone",
                  "Annadanam served daily",
                  "Call ahead for accommodation",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2.5 text-[0.75rem] text-ink-soft">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon text-gold">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-cream-100 pb-16" aria-labelledby="hindu-calendar-section-heading">
        <div className="container-site">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow flex items-center gap-2.5">
                <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                Panchang · Indian Standard Time
              </p>
              <h2 id="hindu-calendar-section-heading" className="mt-3 text-[2rem] sm:text-[2.5rem]">
                The Hindu Year, Day by Day
              </h2>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-soft">
                Tithi, nakshatra and rashi sit beside the festivals, their
                mythology and the ashram&apos;s own gatherings. Tap any date for
                the full day detail.
              </p>
            </div>
          </Reveal>
          <HinduCalendar
            initialMonth={calendarMonth}
            today={todayCalendar}
            upcomingFestivals={nextFestivals}
            events={calendarEvents}
          />
        </div>
      </section>

      <section id="updates" className="bg-cream pb-16" aria-labelledby="updates-heading">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-maroon-deep p-6 text-cream sm:p-9">
            <div className="mandala-field absolute inset-0 opacity-25" aria-hidden="true" />
            <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                  <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
                  Stay Connected
                </p>
                <h2 id="updates-heading" className="mt-2 max-w-lg text-[1.9rem] text-cream sm:text-[2.2rem]">
                  Receive every satsang announcement.
                </h2>
                <p className="mt-3 max-w-lg text-[0.82rem] leading-relaxed text-cream/65">
                  Join the ashram&apos;s update list and receive new events,
                  festivals and sadhana camps by SMS and WhatsApp. Messages go
                  only to devotees who choose to receive them.
                </p>
                <p className="mt-4 flex items-start gap-2 text-[0.68rem] leading-relaxed text-gold/80">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Your number stays private. Every message includes an opt-out.
                </p>
              </div>
              <MemberSignupForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 pb-16" aria-labelledby="visit-events-heading">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-maroon-deep px-6 py-10 text-cream sm:px-10">
            <div className="mandala-field absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                  Planning your journey?
                </p>
                <h2 id="visit-events-heading" className="mt-2 max-w-xl text-[1.8rem] text-cream sm:text-[2rem]">
                  Every festival is also an invitation to serve.
                </h2>
                <p className="mt-3 flex max-w-xl gap-2 text-[0.8rem] leading-relaxed text-cream/60">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" aria-hidden="true" />
                  {site.address.line1}, {site.address.line2}, {site.address.line3}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="gold" size="sm">
                  Plan a visit
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
                <Button href="/donate" variant="ghost-light" size="sm">
                  Offer seva
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
    </>
  );
}
