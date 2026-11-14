import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { DonateButton } from "@/components/donate/donate-button";
import { SiteLogo } from "@/components/ui/site-logo";
import { SocialLinks } from "@/components/ui/social-links";
import { site } from "@/lib/site";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Guru", href: "/about" },
  { label: "The Ashram", href: "/ashram" },
  { label: "Teachings", href: "/teachings" },
  { label: "Books", href: "/books" },
  { label: "Aarti & Bhajans", href: "/aarti" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-maroon-deep text-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(212,175,55,0.12),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(212,175,55,0.07),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-40 h-[28rem] w-[28rem] rounded-full border border-gold/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-16 bottom-6 font-serif text-[14rem] leading-none text-gold/[0.035] select-none"
        aria-hidden="true"
      >
        ॐ
      </div>

      <div className="container-site relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.1fr_1fr] lg:gap-10 lg:py-20">
        <div>
          <SiteLogo tone="light" />
          <p className="mt-4 font-telugu-body text-sm text-gold/80">
            {site.teluguName}, {site.teluguPlace}
          </p>
          <p className="mt-5 max-w-sm text-[0.82rem] leading-[1.85] text-cream/60">
            A living centre of devotion, sadhana and service in Jharasangam,
            Telangana — open to every seeker, every day.
          </p>
          <SocialLinks className="mt-6" />
        </div>

        <nav aria-label="Footer">
          <h2 className="text-[0.68rem] font-semibold tracking-[0.24em] text-gold uppercase">
            Explore
          </h2>
          <ul className="mt-5 space-y-2.5">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-[0.82rem] text-cream/65 transition-colors hover:text-gold"
                >
                  <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.68rem] font-semibold tracking-[0.24em] text-gold uppercase">
            Contact
          </h2>
          <ul className="mt-5 space-y-4 text-[0.82rem] leading-relaxed text-cream/65">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/75" aria-hidden="true" />
              <a
                href={site.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.line3}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold/75" aria-hidden="true" />
              <span>
                {site.phones.map((phone, index) => (
                  <span key={phone.href}>
                    {index > 0 ? <br /> : null}
                    <a href={`tel:${phone.href}`} className="transition-colors hover:text-gold">
                      {phone.label}
                    </a>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold/75" aria-hidden="true" />
              <a
                href={`mailto:${site.email}`}
                className="break-all transition-colors hover:text-gold"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[0.68rem] font-semibold tracking-[0.24em] text-gold uppercase">
            Visit & Give
          </h2>
          <div className="mt-5 flex gap-3 text-[0.82rem] leading-relaxed text-cream/65">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold/75" aria-hidden="true" />
            <p>
              Darshan and satsang are open to all. Please call ahead for group
              visits, accommodation and festival timings.
            </p>
          </div>
          <DonateButton variant="gold" size="sm" className="mt-6 w-full" />
          <p className="mt-4 text-[0.68rem] leading-relaxed text-cream/40">
            Also at {site.secondAshram.name}, {site.secondAshram.address}.
          </p>
        </div>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="container-site flex flex-col gap-3 py-5 text-[0.68rem] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.shortName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/events#updates"
              className="transition-colors hover:text-gold"
            >
              Get updates
            </Link>
            <span>Photographs from the ashram archives.</span>
            <Link href="/privacy" className="transition-colors hover:text-gold">
              Privacy
            </Link>
            <Link href="/admin" className="transition-colors hover:text-gold">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
