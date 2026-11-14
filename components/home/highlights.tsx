import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flower2, HandHeart, Landmark, MessagesSquare, Trees } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { highlights } from "@/lib/content";

const icons = {
  temple: Landmark,
  discourse: MessagesSquare,
  seva: HandHeart,
  nature: Trees,
  lotus: Flower2,
} as const;

export function Highlights() {
  return (
    <section
      className="relative overflow-hidden bg-cream-100/70"
      aria-labelledby="highlights-heading"
    >
      <div className="container-site section-pad">
        <Reveal>
          <SectionHeading
            eyebrow="Life at the Ashram"
            title="Ashram Highlights"
            headingId="highlights-heading"
            description="Simple rhythms, shared meals and a living relationship with the Divine — this is what a day at Mallayyagiri feels like."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {highlights.map((highlight, index) => {
            const Icon = icons[highlight.icon as keyof typeof icons] ?? Flower2;
            return (
              <Reveal key={highlight.title} delay={index * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-[1.25rem] border border-maroon/10 bg-cream shadow-[0_18px_45px_-34px_rgba(74,28,28,0.55)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-card">
                  <Link
                    href={highlight.href}
                    className="absolute inset-0 z-20 rounded-[1.25rem]"
                    aria-label={`Explore ${highlight.title}`}
                  >
                    <span className="sr-only">{highlight.title}</span>
                  </Link>

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={highlight.image}
                      alt={highlight.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-maroon-deep/60 via-maroon-deep/5 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 bg-maroon-deep/40 text-cream/80 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream bg-gold text-maroon-deep shadow-gold">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="px-5 pt-8 pb-6">
                    <h3 className="text-[1.18rem] leading-snug">{highlight.title}</h3>
                    <p className="mt-2.5 text-[0.78rem] leading-[1.75] text-ink-soft">
                      {highlight.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
