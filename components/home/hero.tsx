import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-maroon-deep"
    >
      <Image
        src="/images/hero-ashram-landscape.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_42%]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(50,17,17,0.97)_0%,rgba(50,17,17,0.86)_36%,rgba(50,17,17,0.52)_68%,rgba(50,17,17,0.7)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(212,175,55,0.16),transparent_42%),linear-gradient(to_top,rgba(50,17,17,0.9),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="mandala-field absolute inset-y-0 right-0 w-2/3 opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute top-24 right-[8%] hidden h-[30rem] w-[30rem] rounded-full border border-gold/10 xl:block"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 right-[13%] hidden h-[22rem] w-[22rem] rounded-full border border-gold/[0.07] xl:block"
        aria-hidden="true"
      />

      <div className="container-site relative grid items-end lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
        <div className="relative order-2 mx-auto flex max-w-[19rem] items-end justify-center self-end pt-4 sm:max-w-[23rem] lg:order-1 lg:max-w-none lg:pt-12">
          <div
            className="absolute inset-x-4 top-8 bottom-0 rounded-t-[999px] border border-gold/25 bg-gold/[0.035] sm:inset-x-8"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-8 top-16 bottom-0 rounded-t-[999px] border border-gold/10 sm:inset-x-14"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl"
            aria-hidden="true"
          />

          <Image
            src="/images/guru-hero.webp"
            alt="Sri Dr. Basavalinga Avadhoota seated in saffron robes with his hand raised in blessing"
            width={1000}
            height={1462}
            priority
            sizes="(min-width: 1024px) 38vw, 76vw"
            className="relative z-10 h-[clamp(18.5rem,42vw,33rem)] w-auto max-w-full object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
          />

          <div className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-gold/30 bg-maroon-deep/75 px-4 py-2 whitespace-nowrap backdrop-blur-md sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            <span className="text-[0.58rem] font-semibold tracking-[0.18em] text-cream/75 uppercase">
              A living tradition since 2006
            </span>
          </div>
        </div>

        <div className="relative z-10 order-1 flex flex-col items-center pt-12 pb-6 text-center lg:order-2 lg:items-start lg:py-24 lg:pt-20 lg:pb-28 lg:text-left">
          <div className="mb-6 flex items-center gap-3">
            <OmMark size="sm" variant="outline" />
            <p className="text-[0.62rem] font-semibold tracking-[0.28em] text-gold/85 uppercase">
              With the grace of Gurudev
            </p>
          </div>

          <h1
            id="hero-heading"
            className="font-telugu text-[clamp(1.8rem,3.6vw,3.35rem)] leading-[1.34] text-gold-light [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
          >
            <span className="block">శ్రీ బసవలింగ అవధూత ఆశ్రమం,</span>
            <span className="block">మల్లయ్యగిరి</span>
          </h1>

          <p className="mt-4 font-serif text-[1.05rem] text-cream/85 sm:text-[1.18rem]">
            {site.name}
          </p>

          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12 bg-gold/60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gold/60" />
          </div>

          <p className="mt-6 max-w-xl font-serif text-[1.3rem] leading-[1.5] text-cream sm:text-[1.55rem] lg:text-[1.7rem]">
            A Divine Abode for Peace, Devotion <br className="hidden sm:block" />
            and Spiritual Transformation
          </p>

          <p className="mt-4 max-w-md text-[0.82rem] leading-[1.85] text-cream/60">
            A living centre of satsang, sadhana and selfless service in the
            quiet hills of Mallayyagiri.
          </p>

          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row lg:justify-start">
            <Button href="/ashram" variant="light" size="md">
              Explore the Ashram
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                aria-hidden="true"
              />
            </Button>
            <Button href="/contact" variant="ghost-light" size="md">
              Plan a Visit
            </Button>
          </div>

          <a
            href={site.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.1em] text-cream/55 transition-colors hover:text-gold"
          >
            <MapPin className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
            Mallayyagiri · Jharasangam · Telangana
          </a>
        </div>
      </div>

      <div className="gold-rule absolute inset-x-0 bottom-0 opacity-70" aria-hidden="true" />
    </section>
  );
}
