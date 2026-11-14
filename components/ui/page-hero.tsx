import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OmMark } from "@/components/ui/om-mark";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  breadcrumb: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  breadcrumb,
  align = "left",
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-maroon-deep">
      <div className="mandala-field absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute -top-32 -right-24 h-[26rem] w-[26rem] rounded-full border border-gold/10"
        aria-hidden="true"
      />
      <div
        className="absolute -right-8 bottom-[-8rem] h-80 w-80 rounded-full border border-gold/10"
        aria-hidden="true"
      />

      {image ? (
        <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-center opacity-60"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-maroon-deep via-maroon-deep/55 to-maroon-deep/20"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-transparent to-maroon-deep/30"
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div
        className={cn(
          "container-site relative flex min-h-[23rem] flex-col justify-end py-14 sm:min-h-[26rem] sm:py-16",
          image ? "lg:max-w-none lg:pr-[46%]" : "",
          align === "center" && "items-center text-center",
        )}
      >
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.18em] text-cream/45 uppercase">
              <li>
                <Link href="/" className="transition-colors hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="text-gold/85">
                {breadcrumb}
              </li>
            </ol>
          </nav>

          <div
            className={cn(
              "flex items-start gap-5",
              align === "center" && "flex-col items-center",
            )}
          >
            <OmMark
              size="md"
              variant="outline"
              className={cn("mt-1 hidden sm:inline-flex", align === "center" && "sm:mt-0")}
            />
            <div>
              {eyebrow ? (
                <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.3em] text-gold uppercase">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="text-[2.2rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
                {title}
              </h1>
            </div>
          </div>

          {description ? (
            <p
              className={cn(
                "mt-6 max-w-2xl text-[0.95rem] leading-[1.85] text-cream/70",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>

      <div className="gold-rule absolute inset-x-0 bottom-0 opacity-60" aria-hidden="true" />
    </section>
  );
}
