import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonateButton } from "@/components/donate/donate-button";
import { OmMark } from "@/components/ui/om-mark";

const impactPoints = ["Daily annadanam", "Care for the ashram", "Education & youth"];

export function SevaCta() {
  return (
    <section className="relative overflow-hidden bg-cream-100/60 py-16 sm:py-20">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/30 bg-maroon-deep">
          <div
            className="pointer-events-none absolute -top-24 -left-16 font-serif text-[20rem] leading-none text-gold/[0.045] select-none"
            aria-hidden="true"
          >
            ॐ
          </div>

          <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
            <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-16">
              <div className="flex items-center gap-3">
                <OmMark size="sm" variant="outline" />
                <p className="text-[0.62rem] font-semibold tracking-[0.26em] text-gold/85 uppercase">
                  Seva · Dakshina
                </p>
              </div>

              <h2 className="mt-5 max-w-xl text-[2rem] leading-[1.18] text-cream sm:text-[2.4rem]">
                Your offering becomes someone&apos;s next meal.
              </h2>

              <p className="mt-4 max-w-lg text-[0.85rem] leading-[1.85] text-cream/65">
                Every day, the ashram feeds whoever arrives, tends the shrine and
                keeps its doors open. Your gift — however small — becomes part of
                that quiet, continuous service.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                {impactPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1.5 text-[0.7rem] text-cream/65"
                  >
                    <Check className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <DonateButton
                  variant="gold"
                  size="md"
                  designation="Annadanam Seva"
                  label="Offer Annadanam"
                />
                <Button href="/donate" variant="ghost-light" size="md">
                  Other ways to give
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <p className="mt-4 text-[0.65rem] leading-relaxed text-cream/40">
                For UPI, bank transfer, monthly giving or 80G receipts, please
                contact the ashram office.
              </p>
            </div>

            <div className="relative min-h-[15rem] overflow-hidden lg:min-h-full">
              <Image
                src="/images/highlight-annadanam.jpg"
                alt="Volunteers serving annadanam to devotees at the ashram"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-maroon-deep via-maroon-deep/25 to-transparent lg:via-maroon-deep/10"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-maroon-deep/50 to-transparent"
                aria-hidden="true"
              />
              <p className="absolute right-5 bottom-5 left-5 max-w-xs rounded-lg border border-cream/15 bg-maroon-deep/55 px-4 py-3 text-[0.66rem] leading-relaxed text-cream/80 backdrop-blur-sm sm:right-7 sm:bottom-7 sm:left-auto">
                “Food offered with love is worship. The hand that serves is the
                hand of the Divine.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
