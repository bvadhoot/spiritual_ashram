import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";

const links = [
  { label: "Home", href: "/" },
  { label: "About Guru", href: "/about" },
  { label: "The Ashram", href: "/ashram" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-cream py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="container-site relative text-center">
        <OmMark size="lg" variant="solid" className="mx-auto" />
        <p className="mt-8 text-[0.68rem] font-semibold tracking-[0.28em] text-gold uppercase">
          A quiet detour
        </p>
        <h1 className="mt-3 text-[3rem] leading-none sm:text-[4rem]">404</h1>
        <h2 className="mt-4 text-[1.6rem] sm:text-2xl">This path does not lead to the ashram.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          The page you were looking for may have moved. These paths will take you
          back to the shrine.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-maroon/15 bg-cream px-4 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-maroon transition hover:border-gold hover:bg-gold-pale/40"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button href="/" className="mt-8">
          Return Home
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
