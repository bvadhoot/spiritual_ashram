import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, Mail, Phone, ShieldCheck } from "lucide-react";
import { DonationForm } from "@/components/donate/donation-form";
import { OmMark } from "@/components/ui/om-mark";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { donationFaqs, donationImpact } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate & Support the Ashram",
  description:
    "Support annadanam, goshala seva, ashram upkeep and education at Sri Basavalinga Avadhoota Ashram. Give by UPI or bank transfer and contact the office for 80G receipts.",
  alternates: { canonical: "/donate" },
  openGraph: {
    title: "Donate & Support the Ashram",
    description:
      "Your offering becomes annadanam, care for seekers and the quiet work that keeps the ashram open to all.",
    url: "/donate",
    images: ["/images/highlight-annadanam.jpg"],
  },
};

const impactIcons = [OmMark, ShieldCheck, Mail] as const;

const givingSteps = [
  {
    title: "Record your gift",
    description:
      "Choose an amount and seva, add the phone number for your SMS/WhatsApp receipt, then submit the form. You will receive a reference for your offering.",
  },
  {
    title: "Transfer by UPI or bank",
    description:
      "Use the ashram's UPI ID or bank details, shown after you submit or shared by the office.",
  },
  {
    title: "Share your reference",
    description:
      "Send the reference to the office so your gift is acknowledged and, where needed, receipted.",
  },
] as const;

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Dakshina & Seva"
        title="Give with a Full Heart"
        description="The ashram runs on small, steady acts of generosity: a handful of rice, a day of seva, a gift that keeps the kitchen open. Every offering is received with gratitude."
        breadcrumb="Donate"
        image="/images/highlight-annadanam.jpg"
        imageAlt="Volunteers serving annadanam to devotees at the ashram"
      />

      <section className="section-pad bg-cream">
        <div className="container-site">
          <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
            <Reveal>
              <div className="rounded-2xl border border-maroon/10 bg-white p-6 shadow-card sm:p-8">
                <div className="flex items-center gap-4 border-b border-maroon/10 pb-6">
                  <OmMark size="md" variant="outline" className="border-gold/50 bg-maroon" />
                  <div>
                    <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                      Give by UPI or bank
                    </p>
                    <h2 className="mt-1 text-2xl">Make an Offering</h2>
                  </div>
                </div>

                <div className="mt-6">
                  <DonationForm initialDesignation="Annadanam Seva" />
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.05}>
                <SectionHeading
                  eyebrow="Where It Goes"
                  title="A Gift That Reaches Someone"
                  align="left"
                  description="The ashram does not separate worship from service. Your donation is used with care, and every rupee has a purpose."
                />
              </Reveal>

              <div className="space-y-4">
                {donationImpact.map((item, index) => {
                  const Icon = impactIcons[index] ?? ShieldCheck;
                  return (
                    <Reveal key={item.title} delay={0.08 + index * 0.05}>
                      <article className="flex gap-4 rounded-2xl border border-maroon/10 bg-cream-100/60 p-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-cream text-maroon">
                          {index === 0 ? (
                            <OmMark size="sm" variant="bare" className="h-5 w-5 text-base" />
                          ) : (
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                        <div>
                          <h3 className="text-[1.02rem]">{item.title}</h3>
                          <p className="mt-1.5 text-[0.78rem] leading-[1.8] text-ink-soft">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal delay={0.2}>
                <div className="rounded-2xl border border-gold/30 bg-maroon-deep p-6 text-cream">
                  <div className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.18em] text-gold uppercase">
                    <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                    How your offering is completed
                  </div>
                  <ol className="mt-4 space-y-4">
                    {givingSteps.map((step, index) => (
                      <li key={step.title} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/30 text-[0.65rem] font-semibold text-gold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-[0.82rem] font-medium text-cream">
                            {step.title}
                          </p>
                          <p className="mt-1 text-[0.74rem] leading-[1.7] text-cream/60">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 border-t border-cream/10 pt-4 text-[0.72rem] leading-relaxed text-cream/55">
                    For monthly giving, a specific seva or an 80G receipt, the
                    office can help personally.
                  </p>
                  <div className="mt-3 space-y-2 text-[0.78rem]">
                    <a
                      href={`tel:${site.phones[0].href}`}
                      className="flex items-center gap-2 text-cream/80 transition-colors hover:text-gold"
                    >
                      <Phone className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
                      {site.phones[0].label}
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="flex items-center gap-2 break-all text-cream/80 transition-colors hover:text-gold"
                    >
                      <Mail className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
                      {site.email}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="rounded-2xl border border-maroon/10 bg-cream-100/60 p-6">
                  <h3 className="text-[1.05rem]">Questions about giving</h3>
                  <div className="mt-3 divide-y divide-maroon/10">
                    {donationFaqs.map((faq) => (
                      <details key={faq.question} className="group py-3">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.8rem] font-medium text-maroon">
                          {faq.question}
                          <span
                            className="text-gold transition-transform group-open:rotate-45"
                            aria-hidden="true"
                          >
                            +
                          </span>
                        </summary>
                        <p className="mt-2 text-[0.75rem] leading-[1.8] text-ink-soft">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-maroon uppercase underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
                  >
                    Contact the office
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-14">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <OmMark size="md" variant="solid" className="mx-auto" />
            <blockquote className="mt-6 font-serif text-[1.45rem] leading-[1.6] text-maroon italic sm:text-[1.7rem]">
              “Food offered with love is worship. The hand that serves is the
              hand of the Divine.”
            </blockquote>
            <p className="mt-4 text-[0.62rem] font-semibold tracking-[0.2em] text-ink-soft/60 uppercase">
              Guru Vani
            </p>
            <p className="mt-6 text-[0.75rem] leading-relaxed text-ink-soft/60">
              Giving is completed by UPI or bank transfer in Indian rupees. This
              website does not collect card details. The ashram is grateful for
              every offering, large or small.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
