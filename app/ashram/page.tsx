import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { dailyRhythm, visitorGuidelines } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Ashram at Mallayyagiri",
  description:
    "Discover the Mallayyagiri Ashram — a place of daily worship, annadanam and satsang in Jharasangam, Telangana. Plan your visit, learn the daily rhythm and find directions.",
  alternates: { canonical: "/ashram" },
  openGraph: {
    title: "The Ashram at Mallayyagiri",
    description:
      "A sanctuary of prayer, service and silence in Jharasangam, Telangana. Explore the ashram and plan your visit.",
    url: "/ashram",
    images: ["/images/highlight-ashram.jpg"],
  },
};

export default function AshramPage() {
  return (
    <>
      <PageHero
        eyebrow="The Ashram"
        title="A Sanctuary in the Deccan"
        description="Mallayyagiri is not only a place of worship. It is a home for seekers, a kitchen that never closes, and a living reminder that the sacred can be found in ordinary service."
        breadcrumb="Ashram"
        image="/images/hero-ashram-landscape.jpg"
        imageAlt="Green hills at golden hour near the ashram"
      />

      <section className="section-pad paper-texture bg-cream">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Founded in 2006"
              title="Where Sadhana Became a Home"
              align="left"
            />
            <div className="mt-6 space-y-4 text-[0.92rem] leading-[1.95] text-ink-soft">
              <p>
                In 2006, after years of pilgrimage and penance, Sri Dr.
                Basavalinga Avadhoota settled at Mallayyagiri, a quiet stretch of
                land between Kuppanagar and Chillapalli. What began as a simple
                place of worship has become an ashram with a shrine, a satsang
                hall, a kitchen and room for the thousands who arrive on
                Pournami.
              </p>
              <p>
                The ashram belongs to no one person. It is cared for by devotees
                who cook, clean, garden, sing and sit together. On any given day
                you might find a farmer, a student, a doctor and a grandmother
                sharing the same prasada — which is exactly the point.
              </p>
              <p>
                A second ashram at Degalmadi in Kalburgi district carries the
                same rhythm of worship and service into Karnataka.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-maroon/10 bg-cream-100/70 px-4 py-3 text-[0.72rem] font-medium text-maroon">
                <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
                Daily annadanam
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-maroon/10 bg-cream-100/70 px-4 py-3 text-[0.72rem] font-medium text-maroon">
                <OmMark size="sm" variant="bare" className="h-5 w-5 text-base" />
                Regular satsang
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-maroon/10 bg-cream-100/70 px-4 py-3 text-[0.72rem] font-medium text-maroon">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                Open to all
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact">
                Plan Your Visit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="/gallery" variant="outline">
                See the Ashram
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="relative">
            <div className="relative overflow-hidden rounded-[1.4rem] border border-gold/30 bg-maroon-deep p-5 shadow-soft sm:p-7">
              <div className="mandala-field absolute inset-0 opacity-40" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-xl">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/akkamahadevi.webp"
                    alt="Illustration of Jaganmatha Akkamahadevi seated in meditation"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="relative mt-3 flex items-center justify-between gap-4 border-t border-gold/20 pt-4">
                <div>
                  <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-gold uppercase">
                    The heart of the ashram
                  </p>
                  <p className="mt-1 font-serif text-lg text-cream">
                    Jaganmatha Akkamahadevi
                  </p>
                </div>
                <OmMark size="sm" variant="outline" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-cream-100" aria-labelledby="rhythm-heading">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="The Daily Rhythm"
              title="A Day at the Ashram"
              headingId="rhythm-heading"
              description="The ashram moves with the sun and the seasons. These are the rhythms that shape an ordinary day — festival days are fuller, quieter days are just as sacred."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {dailyRhythm.map((item, index) => (
              <Reveal key={item.time} delay={index * 0.05}>
                <article className="relative h-full rounded-2xl border border-maroon/10 bg-cream p-5">
                  <div className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.16em] text-gold uppercase">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.time}
                  </div>
                  <h3 className="mt-3 text-[1.05rem] leading-snug">{item.title}</h3>
                  <p className="mt-2 text-[0.76rem] leading-[1.8] text-ink-soft">
                    {item.description}
                  </p>
                  <span
                    className="absolute right-4 bottom-4 font-serif text-[1.6rem] leading-none text-maroon/[0.07]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[0.7rem] leading-relaxed text-ink-soft/60">
            Timings shift with the season, the festival calendar and Gurudev&apos;s
            travel. Please call the ashram office before travelling if you are
            coming for a specific programme.
          </p>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="ashrams-heading">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Two Homes"
              title="The Ashrams"
              headingId="ashrams-heading"
              description="One tradition, two places of refuge — in Telangana and Karnataka."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="relative h-full overflow-hidden rounded-2xl border border-gold/30 bg-maroon-deep text-cream">
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src="/images/gallery-festival.jpg"
                    alt="Festival night at Mallayyagiri Ashram"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/20 to-transparent" aria-hidden="true" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                    Telangana
                  </p>
                  <h3 className="mt-2 text-2xl text-cream">Mallayyagiri Ashram</h3>
                  <p className="mt-3 flex gap-2.5 text-[0.82rem] leading-relaxed text-cream/65">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" aria-hidden="true" />
                    <span>
                      {site.address.line1}, {site.address.line2},{" "}
                      {site.address.line3}
                    </span>
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <a
                      href={site.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.66rem] font-semibold tracking-[0.14em] text-gold uppercase underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
                    >
                      Get directions
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                    <a
                      href={`tel:${site.phones[0].href}`}
                      className="inline-flex items-center gap-1.5 text-[0.66rem] font-semibold tracking-[0.14em] text-cream/65 uppercase hover:text-gold"
                    >
                      <Phone className="h-3 w-3" aria-hidden="true" />
                      {site.phones[0].label}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.06}>
              <article className="h-full rounded-2xl border border-maroon/10 bg-cream-100 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                      Karnataka
                    </p>
                    <h3 className="mt-2 text-2xl">Degalmadi Ashram</h3>
                    <p className="mt-3 flex gap-2.5 text-[0.82rem] leading-relaxed text-ink-soft">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon/60" aria-hidden="true" />
                      {site.secondAshram.address}
                    </p>
                  </div>
                  <OmMark size="md" variant="outline" className="border-maroon/20 bg-maroon text-gold" />
                </div>

                <p className="mt-5 text-[0.85rem] leading-[1.85] text-ink-soft">
                  The Degalmadi Ashram carries the same daily worship, annadanam
                  and satsang into the Chincholi region. Devotees travelling
                  through Kalburgi are welcome to visit.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/contact" size="sm">
                    Ask about visiting
                  </Button>
                  <Button href="/donate" size="sm" variant="outline">
                    Support the ashram
                  </Button>
                </div>

                <div className="mt-7 rounded-xl border border-gold/25 bg-cream px-5 py-4">
                  <p className="text-[0.6rem] font-semibold tracking-[0.16em] text-maroon-soft uppercase">
                    Getting here
                  </p>
                  <p className="mt-1.5 text-[0.76rem] leading-relaxed text-ink-soft">
                    Nearest town: Jharasangam. Nearest city: Zaheerabad. Please
                    call ahead for route guidance, local transport and
                    accommodation. The ashram office can help you plan the last
                    leg of your journey.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream-100" aria-labelledby="visitor-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Before You Come"
              title="Visitor Guidance"
              headingId="visitor-heading"
              align="left"
              description="The ashram is a place of worship and a family home. A little care helps everyone feel welcome."
            />
            <ul className="mt-7 space-y-3.5">
              {visitorGuidelines.map((guideline) => (
                <li key={guideline} className="flex gap-3 text-[0.83rem] leading-relaxed text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                  {guideline}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl border border-gold/30 bg-cream px-5 py-4 text-[0.75rem] leading-relaxed text-ink-soft">
              For accommodation, group visits and festival arrangements, please
              call{" "}
              <a href={`tel:${site.phones[0].href}`} className="font-semibold text-maroon underline decoration-gold/60 underline-offset-4">
                {site.phones[0].label}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-maroon underline decoration-gold/60 underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="overflow-hidden rounded-2xl border border-maroon/10 bg-cream shadow-card">
              <div className="h-[22rem] w-full sm:h-[26rem]">
                <iframe
                  title="Map showing Sri Basavalinga Avadhoota Ashram, Mallayyagiri"
                  src={site.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[0.6rem] font-semibold tracking-[0.18em] text-maroon-soft uppercase">
                    Mallayyagiri, Jharasangam
                  </p>
                  <p className="mt-1 text-[0.75rem] text-ink-soft">
                    Open daily for darshan and satsang.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button href={site.mapLink} external size="sm" variant="outline">
                    Open in Maps
                  </Button>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-4 py-2.5 text-[0.7rem] font-semibold text-cream transition hover:bg-maroon-deep"
                  >
                    Contact
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
