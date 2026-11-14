import { OmMark } from "@/components/ui/om-mark";
import { MeditatingFigure } from "@/components/ui/meditating-figure";
import { quotes } from "@/lib/content";
import { site } from "@/lib/site";

export function QuoteBanner() {
  const quote = quotes[0];

  return (
    <section
      aria-label="Words of the Guru"
      className="relative isolate overflow-hidden bg-maroon-deep"
    >
      <div
        className="mandala-field absolute inset-0 opacity-50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(212,175,55,0.12),transparent_45%),linear-gradient(100deg,#321111_10%,#4a1c1c_55%,#321111_100%)]"
        aria-hidden="true"
      />

      <div className="container-site relative grid min-h-[24rem] items-center gap-8 py-16 md:grid-cols-[auto_1fr] md:py-20 lg:grid-cols-[auto_1fr_auto] lg:gap-12 lg:py-24">
        <div className="hidden md:flex md:items-start md:pt-2">
          <OmMark size="lg" variant="outline" />
        </div>

        <blockquote className="relative mx-auto max-w-3xl text-center">
          <span
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 font-serif text-[7rem] leading-none text-gold/25 select-none"
            aria-hidden="true"
          >
            “
          </span>
          <p className="relative font-serif text-[1.55rem] leading-[1.5] text-cream italic sm:text-[1.9rem] lg:text-[2.25rem]">
            “{quote.text}”
          </p>
          <p className="mt-3 font-telugu-body text-[0.9rem] leading-relaxed text-gold/70">
            {quote.telugu}
          </p>
          <footer className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
            <cite className="text-[0.62rem] font-semibold tracking-[0.22em] text-gold uppercase not-italic">
              {site.name}
            </cite>
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
          </footer>
        </blockquote>

        <div className="pointer-events-none absolute right-0 bottom-0 hidden w-[24rem] translate-x-10 translate-y-6 opacity-60 lg:block xl:w-[27rem]">
          <MeditatingFigure className="animate-float" />
        </div>
        <div
          className="pointer-events-none absolute right-10 bottom-4 block w-40 translate-y-4 opacity-45 md:hidden"
          aria-hidden="true"
        >
          <MeditatingFigure />
        </div>
      </div>

      <div className="gold-rule absolute inset-x-0 top-0 opacity-50" aria-hidden="true" />
      <div className="gold-rule absolute inset-x-0 bottom-0 opacity-50" aria-hidden="true" />
    </section>
  );
}
