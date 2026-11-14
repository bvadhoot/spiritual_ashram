import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  tone?: "dark" | "light";
  className?: string;
  compact?: boolean;
}

export function SiteLogo({ tone = "dark", className, compact = false }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Poojya Sri Dr. Basavalinga Avadhoota Ashram — home"
    >
      <span className="relative block h-12 w-12 shrink-0 rounded-full p-[2px] ring-1 ring-gold/60 transition-transform duration-500 group-hover:scale-[1.03] sm:h-[3.35rem] sm:w-[3.35rem]">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-warm opacity-70 blur-[1px]" aria-hidden="true" />
        <span className="relative block h-full w-full overflow-hidden rounded-full border border-cream/40">
          <Image
            src="/images/guru-logo-v5.jpg"
            alt="Portrait of Poojya Sri Dr. Basavalinga Avadhoota"
            fill
            sizes="56px"
            className="object-cover object-center"
          />
        </span>
        <span
          className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[0.55rem] text-gold ring-1 ring-gold/70"
          aria-hidden="true"
        >
          ॐ
        </span>
      </span>

      <span className={cn("min-w-0", compact && "hidden max-lg:block xl:block")}>
        <span
          className={cn(
            "block truncate font-serif text-[0.95rem] leading-tight tracking-[0.005em] sm:text-[1.02rem]",
            tone === "light" ? "text-cream" : "text-maroon",
          )}
        >
          Poojya Sri Dr. Basavalinga Avadhoota
        </span>
        <span
          className={cn(
            "mt-1 block truncate text-[0.56rem] font-semibold tracking-[0.2em] uppercase",
            tone === "light" ? "text-gold/80" : "text-maroon-soft/80",
          )}
        >
          Ashram · Mallayyagiri
        </span>
      </span>
    </Link>
  );
}
