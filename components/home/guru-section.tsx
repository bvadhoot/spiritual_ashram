import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { guruBio, guruQuote } from "@/lib/content";
import { site } from "@/lib/site";

export function GuruSection() {
  return (
    <section
      id="about-guru"
      className="paper-texture relative overflow-hidden bg-cream"
      aria-labelledby="about-guru-heading"
    >
      <div
        className="pointer-events-none absolute top-20 -left-24 font-serif text-[22rem] leading-none text-maroon/[0.025] select-none"
        aria-hidden="true"
      >
        ॐ
      </div>

      <div className="container-site section-pad relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_1fr] lg:gap-16 xl:gap-20">
          <Reveal className="relative">
            <div
              className="absolute -top-4 -left-4 h-28 w-28 rounded-tl-[2rem] border-t border-l border-gold/50 sm:-top-5 sm:-left-5 sm:h-36 sm:w-36"
              aria-hidden="true"
            />
            <div
              className="absolute -right-4 -bottom-4 h-28 w-28 rounded-br-[2rem] border-r border-b border-gold/50 sm:-right-5 sm:-bottom-5 sm:h-36 sm:w-36"
              aria-hidden="true"
            />

            <figure className="relative overflow-hidden rounded-[1.35rem] border border-maroon/10 bg-maroon shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/guru-speaking.jpg"
                  alt="Sri Dr. Basavalinga Avadhoota speaking into a microphone before a gathering of devotees"
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover object-[72%_center]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-maroon-deep/55 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-[0.58rem] font-semibold tracking-[0.22em] text-gold uppercase">
                    Guru Vani
                  </p>
                  <p className="mt-1 font-serif text-lg text-cream">
                    In the midst of his devotees
                  </p>
                </div>
                <span className="hidden rounded-full border border-gold/40 bg-maroon-deep/50 px-3 py-1.5 text-[0.58rem] tracking-[0.14em] text-cream/75 uppercase backdrop-blur-sm sm:block">
                  Mallayyagiri
                </span>
              </figcaption>
            </figure>

            <div className="mt-4 flex items-center gap-3 sm:mt-5">
              <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
              <p className="text-[0.62rem] font-medium tracking-[0.18em] text-ink-soft/60 uppercase">
                Peethadhipati · Mallayyagiri, Basavakalyan & Degalmadi
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <SectionHeading
              eyebrow="The Living Tradition"
              title="About Our Guru"
              headingId="about-guru-heading"
              align="left"
            />

            <p className="mt-5 font-serif text-[1.35rem] text-maroon-soft sm:text-[1.5rem]">
              {site.name}
            </p>

            <div className="mt-5 space-y-4 text-[0.9rem] leading-[1.9] text-ink-soft">
              <p>{guruBio[0]}</p>
              <p>{guruBio[1]}</p>
            </div>

            <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-maroon/10 py-5">
              <div>
                <dt className="sr-only">Villages reached</dt>
                <dd className="font-serif text-xl text-maroon">2,500+</dd>
                <p className="mt-1 text-[0.58rem] tracking-[0.1em] text-ink-soft/65 uppercase">
                  Villages reached
                </p>
              </div>
              <div className="border-l border-maroon/10 pl-4">
                <dt className="sr-only">Devotees on Pournami</dt>
                <dd className="font-serif text-xl text-maroon">10,000+</dd>
                <p className="mt-1 text-[0.58rem] tracking-[0.1em] text-ink-soft/65 uppercase">
                  On Pournami
                </p>
              </div>
              <div className="border-l border-maroon/10 pl-4">
                <dt className="sr-only">Languages spoken</dt>
                <dd className="font-serif text-xl text-maroon">5</dd>
                <p className="mt-1 text-[0.58rem] tracking-[0.1em] text-ink-soft/65 uppercase">
                  Languages
                </p>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button href="/about" variant="primary" size="md">
                Read His Life Story
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Link
                href="/teachings"
                className="text-[0.68rem] font-semibold tracking-[0.16em] text-maroon-soft uppercase underline decoration-gold/50 underline-offset-4 transition hover:text-maroon hover:decoration-gold"
              >
                Explore his teachings
              </Link>
            </div>

            <blockquote className="relative mt-9 rounded-2xl border border-gold/45 bg-cream-100/90 p-6 shadow-[0_24px_50px_-30px_rgba(74,28,28,0.35)] backdrop-blur-sm xl:-ml-24 xl:mr-4">
              <Quote
                className="absolute -top-4 left-5 h-9 w-9 rounded-full border border-gold/40 bg-maroon p-2 text-gold-light"
                aria-hidden="true"
              />
              <p className="pt-3 font-serif text-[1.08rem] leading-[1.7] text-maroon italic sm:text-[1.15rem]">
                “{guruQuote.text}”
              </p>
              <footer className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-gold/70" aria-hidden="true" />
                <cite className="text-[0.62rem] font-semibold tracking-[0.2em] text-ink-soft/70 not-italic uppercase">
                  {guruQuote.attribution}
                </cite>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
