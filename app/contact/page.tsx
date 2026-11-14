import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, HeartHandshake } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/lib/site";
import { visitFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description:
    "Contact Sri Basavalinga Avadhoota Ashram, Mallayyagiri. Find the address, phone numbers, email, map and answers for planning a visit.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Visit | Sri Basavalinga Avadhoota Ashram",
    description:
      "Reach the ashram office, find directions and plan your visit to Mallayyagiri.",
    url: "/contact",
    images: ["/images/gallery-blessing.jpg"],
  },
};

const contactCards = [
  {
    title: "Visit the ashram",
    icon: MapPin,
    lines: [site.address.line1, site.address.line2, site.address.line3],
    action: { label: "Open in Google Maps", href: site.mapLink, external: true },
  },
  {
    title: "Call the office",
    icon: Phone,
    lines: site.phones.map((phone) => phone.label),
    action: { label: "Call now", href: `tel:${site.phones[0].href}`, external: false },
  },
  {
    title: "Write to us",
    icon: Mail,
    lines: [site.email],
    action: { label: "Send an email", href: `mailto:${site.email}`, external: false },
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & Visit"
        title="Let Us Walk Together"
        description="Whether you are planning a first visit, asking about a programme, or looking for a way to serve, the ashram office is happy to hear from you."
        breadcrumb="Contact"
        image="/images/gallery-blessing.jpg"
        imageAlt="Sri Dr. Basavalinga Avadhoota raising his hand in blessing"
      />

      <section className="section-pad bg-cream">
        <div className="container-site">
          <div className="grid gap-4 md:grid-cols-3">
            {contactCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.06}>
                <article className="flex h-full flex-col rounded-2xl border border-maroon/10 bg-cream-100/50 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-cream text-maroon">
                    <card.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-[1.15rem]">{card.title}</h2>
                  <div className="mt-2 flex-1 space-y-1 text-[0.8rem] leading-relaxed text-ink-soft">
                    {card.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  {card.action.external ? (
                    <a
                      href={card.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-maroon uppercase underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
                    >
                      {card.action.label}
                    </a>
                  ) : (
                    <a
                      href={card.action.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-maroon uppercase underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
                    >
                      {card.action.label}
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal>
              <div className="rounded-2xl border border-maroon/10 bg-white p-6 shadow-card sm:p-8">
                <SectionHeading
                  eyebrow="Send a Message"
                  title="How can we help?"
                  align="left"
                />
                <p className="mt-4 text-[0.82rem] leading-relaxed text-ink-soft">
                  Use this form for general enquiries, visits and seva. For
                  donations, please use the{" "}
                  <Link href="/donate" className="font-medium text-maroon underline decoration-gold/60 underline-offset-4">
                    donation page
                  </Link>
                  . For urgent matters, please call the office.
                </p>
                <div className="mt-7">
                  <ContactForm />
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.05}>
                <div className="overflow-hidden rounded-2xl border border-maroon/10 bg-cream-100 shadow-card">
                  <div className="h-64 sm:h-72">
                    <iframe
                      title="Map to Sri Basavalinga Avadhoota Ashram, Mallayyagiri"
                      src={site.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <p className="flex items-start gap-2.5 text-[0.78rem] leading-relaxed text-ink-soft">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon/60" aria-hidden="true" />
                      <span>
                        {site.address.line1}
                        <br />
                        {site.address.line2}
                        <br />
                        {site.address.line3}
                      </span>
                    </p>
                    <Button href={site.mapLink} external size="sm" variant="outline" className="self-start">
                      Get directions
                    </Button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-gold/30 bg-cream-100/70 p-6">
                  <p className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.18em] text-maroon-soft uppercase">
                    <Clock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    Before you travel
                  </p>
                  <p className="mt-3 text-[0.79rem] leading-[1.8] text-ink-soft">
                    The ashram is open daily, but programme timings change with
                    the season and festival calendar. For accommodation, group
                    visits or a specific satsang, please call the office in
                    advance. The nearest town is Jharasangam, and Zaheerabad is
                    the nearest city.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.72rem]">
                    <a
                      href={`tel:${site.phones[0].href}`}
                      className="font-medium text-maroon hover:text-maroon-deep"
                    >
                      {site.phones[0].label}
                    </a>
                    <a
                      href={`tel:${site.phones[1].href}`}
                      className="font-medium text-maroon hover:text-maroon-deep"
                    >
                      {site.phones[1].label}
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="break-all font-medium text-maroon hover:text-maroon-deep"
                    >
                      {site.email}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-maroon/10 bg-cream-100/60 p-6">
                  <p className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.18em] text-maroon-soft uppercase">
                    <HeartHandshake className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    Common questions
                  </p>
                  <div className="mt-3 divide-y divide-maroon/10">
                    {visitFaqs.map((faq) => (
                      <details key={faq.question} className="group py-3">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.8rem] font-medium text-maroon">
                          {faq.question}
                          <span className="text-gold transition-transform group-open:rotate-45" aria-hidden="true">
                            +
                          </span>
                        </summary>
                        <p className="mt-2 text-[0.75rem] leading-[1.8] text-ink-soft">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
