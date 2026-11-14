import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  Heart,
  Leaf,
  Music2,
  Quote,
  Sun,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { discourseThemes, literaryWorks, pillars, quotes } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teachings & Discourses",
  description:
    "The teachings of Sri Dr. Basavalinga Avadhoota on devotion, discipline and service — Guru Vani, discourse themes, literary works and the languages he speaks.",
  alternates: { canonical: "/teachings" },
  openGraph: {
    title: "Teachings & Discourses | Sri Basavalinga Avadhoota",
    description:
      "Devotion, discipline and service: the spiritual teaching of Sri Dr. Basavalinga Avadhoota.",
    url: "/teachings",
    images: ["/images/guru-speaking.jpg"],
  },
};

const iconMap = {
  heart: Heart,
  sun: Sun,
  hands: HandHeart,
  lotus: OmMark,
  leaf: Leaf,
  users: Users,
  music: Music2,
  book: BookOpen,
} as const;

function Icon({ name, className }: { name: string; className?: string }) {
  const Component = iconMap[name as keyof typeof iconMap] ?? OmMark;
  if (Component === OmMark) {
    return <OmMark size="sm" variant="bare" className="h-5 w-5 text-base" />;
  }
  const Resolved = Component as typeof Heart;
  return <Resolved className={className} aria-hidden="true" />;
}

export default function TeachingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Teachings & Discourses"
        title="The Wisdom of the Guru"
        description="Not a philosophy for the library, but a way of living: devotion that softens the heart, discipline that steadies the mind, and service that widens the self."
        breadcrumb="Teachings"
        image="/images/guru-speaking.jpg"
        imageAlt="Sri Dr. Basavalinga Avadhoota speaking into a microphone"
      />

      <section className="section-pad paper-texture bg-cream" aria-labelledby="pillars-heading">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="The Three Pillars"
              title="Devotion · Discipline · Service"
              headingId="pillars-heading"
              description="Gurudev returns again and again to three simple foundations. Everything else in his teaching grows from them."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-maroon/10 bg-cream-100/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:bg-cream hover:shadow-card">
                  <div
                    className="absolute inset-x-0 top-0 h-1 gold-gradient opacity-60"
                    aria-hidden="true"
                  />
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-cream text-maroon shadow-sm">
                    <Icon name={pillar.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-6 text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                    {pillar.subtitle}
                  </p>
                  <h2 className="mt-1.5 text-3xl">{pillar.title}</h2>
                  <p className="mt-4 text-[0.82rem] leading-[1.9] text-ink-soft">
                    {pillar.description}
                  </p>
                  <span
                    className="absolute right-5 bottom-4 font-serif text-[4.5rem] leading-none text-maroon/[0.04] transition-colors group-hover:text-gold/15"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad relative overflow-hidden bg-maroon-deep" aria-labelledby="guru-vani-heading">
        <div className="mandala-field absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="container-site relative">
          <Reveal>
            <SectionHeading
              eyebrow="Guru Vani"
              title="Words to Live By"
              headingId="guru-vani-heading"
              tone="light"
              description="Short, direct and often disarmingly simple — these are the lines devotees carry home from satsang."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {quotes.map((quote, index) => (
              <Reveal key={quote.text} delay={index * 0.05}>
                <blockquote className="relative h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm sm:p-7">
                  <Quote className="h-5 w-5 text-gold/80" aria-hidden="true" />
                  <p className="mt-4 font-serif text-[1.08rem] leading-[1.75] text-cream italic sm:text-[1.16rem]">
                    “{quote.text}”
                  </p>
                  <footer className="mt-5 flex items-center gap-3">
                    <span className="h-px w-7 bg-gold/60" aria-hidden="true" />
                    <cite className="text-[0.6rem] font-semibold tracking-[0.18em] text-gold/80 uppercase not-italic">
                      {quote.attribution}
                    </cite>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="themes-heading">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Discourse Themes"
              title="Wisdom for Everyday Life"
              headingId="themes-heading"
              description="From the nature of the Guru to the raising of children, Gurudev's discourses meet people in the middle of their lives."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {discourseThemes.map((theme, index) => (
              <Reveal key={theme.title} delay={index * 0.04}>
                <article className="group h-full rounded-2xl border border-maroon/10 bg-cream p-6 transition-colors duration-300 hover:border-gold/50">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-maroon">
                      <Icon name={theme.icon} className="h-4 w-4" />
                    </span>
                    <span className="font-serif text-[0.9rem] text-gold/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl">{theme.title}</h3>
                  <p className="mt-2.5 text-[0.8rem] leading-[1.8] text-ink-soft">
                    {theme.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream-100" aria-labelledby="writing-heading">
        <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="A Voice in Verse"
              title="Literary Contributions"
              headingId="writing-heading"
              align="left"
              description="Gurudev's songs and vachanas carry the taste of inner experience in language that farmers, students and grandmothers can sing."
            />

            <div className="mt-7 rounded-2xl border border-gold/30 bg-cream p-6">
              <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-maroon-soft uppercase">
                Languages of discourse
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Kannada", "Telugu", "Hindi", "Marathi", "English"].map((language) => (
                  <span
                    key={language}
                    className="rounded-full border border-maroon/15 bg-cream-100 px-3.5 py-1.5 text-[0.7rem] font-medium text-maroon"
                  >
                    {language}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-soft">
                Wherever Gurudev travels, he speaks in the language of the
                listeners — a practice that has carried his message across
                Karnataka, Telangana, Andhra Pradesh, Maharashtra and beyond.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {literaryWorks.map((work, index) => (
              <Reveal key={work.title} delay={index * 0.06}>
                <article className="group flex gap-5 rounded-2xl border border-maroon/10 bg-cream p-6 transition-colors hover:border-gold/40">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold-pale/40 text-maroon">
                    <Icon name={work.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[1.2rem]">{work.title}</h3>
                    <p className="mt-2 text-[0.8rem] leading-[1.8] text-ink-soft">
                      {work.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-maroon/10 bg-cream-100/70 px-6 py-5">
                <p className="text-[0.8rem] leading-relaxed text-ink-soft">
                  Recordings of discourses and devotional songs are shared
                  through the ashram&apos;s official channels. For a specific
                  discourse or publication, please{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="font-medium text-maroon underline decoration-gold/60 underline-offset-4 hover:decoration-gold"
                  >
                    contact the office
                  </a>
                  .
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button href="/books" variant="primary" size="md">
                  Browse the Books
                </Button>
                <Button href="/aarti" variant="outline" size="md">
                  Aarti & Bhajans
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream pb-16">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-maroon px-6 py-10 text-center text-cream sm:px-10">
            <div className="mandala-field absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative">
              <OmMark size="md" variant="outline" className="mx-auto" />
              <h2 className="mx-auto mt-5 max-w-2xl text-[1.8rem] text-cream sm:text-[2.1rem]">
                Listen to the discourses in person.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[0.82rem] leading-relaxed text-cream/65">
                Satsang is held at Mallayyagiri through the year, with large
                gatherings on Pournami and festival days.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/events" variant="gold" size="md">
                  Upcoming Satsangs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="/contact" variant="ghost-light" size="md">
                  Ask About a Visit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
