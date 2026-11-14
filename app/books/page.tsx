import type { Metadata } from "next";
import { BookOpen, Mail, PackageCheck, Send } from "lucide-react";
import { BooksCatalog } from "@/components/books/books-catalog";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Books & Publications",
  description:
    "Books, vachanas and devotional works by Poojya Sri Dr. Basavalinga Avadhoota. Request a copy of Anubhavaamrutha, Avadhoota Vaibhavam or another ashram publication.",
  alternates: { canonical: "/books" },
  openGraph: {
    title: "Books & Publications | Sri Basavalinga Avadhoota Ashram",
    description:
      "The written works of Poojya Sri Dr. Basavalinga Avadhoota — devotional songs, vachanas, biography and studies from the Dattatreya and Sharana traditions.",
    url: "/books",
    images: ["/images/guru-speaking.jpg"],
  },
};

const orderSteps = [
  {
    icon: Send,
    title: "Send a request",
    description:
      "Choose a title and tell us how many copies you need, with the address for dispatch.",
  },
  {
    icon: PackageCheck,
    title: "The office confirms",
    description:
      "We confirm availability, price and postage by phone or email before anything is sent.",
  },
  {
    icon: BookOpen,
    title: "Pay by UPI or bank",
    description:
      "Complete the transfer and share the reference. Your book is dispatched after confirmation.",
  },
];

export default function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="A Voice in Verse"
        title="Books & Publications"
        description="Alongside his discourses, Gurudev writes songs, vachanas and philosophical works that bring the tradition into the language of daily life. Request a copy for your own reading and practice."
        breadcrumb="Books"
        image="/images/guru-speaking.jpg"
        imageAlt="Poojya Sri Dr. Basavalinga Avadhoota speaking to devotees"
      />

      <section className="section-pad bg-cream">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="The Written Word"
              title="Words That Carry the Inner Life"
              description="Six works in Kannada and Telugu, written for seekers who want to carry the teaching home. Each order is handled personally by the ashram office."
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 0.06}>
                  <div className="h-full rounded-2xl border border-maroon/10 bg-cream-100/60 p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-cream text-maroon">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-[1rem]">{step.title}</h3>
                    <p className="mt-1.5 text-[0.76rem] leading-[1.75] text-ink-soft">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <BooksCatalog />
        </div>
      </section>

      <section className="bg-cream-100 py-14 sm:py-16">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <OmMark size="md" variant="solid" className="mx-auto" />
            <blockquote className="mt-5 font-serif text-[1.4rem] leading-[1.65] text-maroon italic sm:text-[1.6rem]">
              “A book can travel where the feet cannot. Carry a little of the
              teaching with you, and read it slowly.”
            </blockquote>
            <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.2em] text-ink-soft/60 uppercase">
              Guru Vani
            </p>
            <p className="mt-6 text-[0.8rem] leading-relaxed text-ink-soft/70">
              For bulk orders, library copies or a title you do not see here,
              write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-maroon underline decoration-gold/60 underline-offset-2"
              >
                {site.email}
              </a>
              .
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href={`mailto:${site.email}?subject=${encodeURIComponent("Book enquiry")}`} variant="primary" size="md">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email the ashram office
              </Button>
              <Button href="/contact" variant="outline" size="md">
                Contact & directions
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
