import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy & Care",
  description:
    "How Sri Basavalinga Avadhoota Ashram handles information shared through the contact form, donation form, book requests and embedded maps.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="A Small Note on Trust"
        title="Privacy & Care"
        description="Your trust matters to the ashram. This page explains, in plain language, what happens to the information you share here."
        breadcrumb="Privacy"
      />

      <section className="section-pad bg-cream">
        <div className="container-site">
          <div className="prose-ashram mx-auto max-w-3xl">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-ink-soft/55 uppercase">
              Last updated · November 2026
            </p>

            <h2>What this website collects</h2>
            <p>
              This website does not run advertising trackers or third-party
              analytics. It collects information only when you choose to share
              it — through the contact form, the donation form or a book request.
            </p>

            <h2>Contact form</h2>
            <p>
              The contact form asks for your name, email address, subject and
              message. These details are used solely to respond to your enquiry.
              Enquiries are delivered to the ashram office by email or webhook
              where configured, and otherwise stored on the hosting server in a
              private data file that is not publicly accessible.
            </p>

            <h2>Donations</h2>
            <p>
              This website does not process card payments. The donation form
              records the amount, the seva you choose, your name, a phone number
              and an optional email address, and gives you a reference. Payment
              is completed separately by UPI or bank transfer. The phone number
              is required so the acknowledgement and receipt can be sent by SMS
              and WhatsApp. The ashram office uses these details to acknowledge
              the gift and, where requested, issue a receipt.
            </p>
            <p>
              The website does not collect a PAN. If you would like an 80G
              receipt, contact the ashram office directly and quote your
              donation reference. Donation references and records may be kept
              for accounting and reconciliation.
            </p>

            <h2>Event updates</h2>
            <p>
              Devotees may opt in on the events page or while donating to
              receive new event and satsang announcements by SMS and WhatsApp.
              The update list stores your name, phone number, optional email
              address and consent time privately; it is never shown publicly and
              is not used for advertising. You can leave the list at any time by
              replying STOP to a message or contacting the ashram office.
              Messages are delivered through Twilio or a configured notification
              automation, which receives only the details needed to send them.
            </p>

            <h2>Book requests</h2>
            <p>
              When you request a book, we collect your name, email, phone,
              postal address and the title and quantity requested. These details
              are used to confirm availability, price and dispatch, and to send
              the book. They are delivered to the ashram office by email or
              webhook where configured, and otherwise stored privately on the
              hosting server.
            </p>

            <h2>Embedded content</h2>
            <p>
              Some pages embed a Google Map to help you find the ashram, and the
              Aarti page embeds videos from YouTube. Google and YouTube may set
              cookies or collect technical information when that content loads.
              Links to Facebook, Instagram and YouTube take you to those
              platforms, which have their own privacy policies. If you prefer to
              avoid the embedded map or video player, use the direct map link or
              open the recordings on YouTube, or contact the office for
              directions.
            </p>

            <h2>How long information is kept</h2>
            <p>
              General enquiries are kept only as long as needed to respond and
              maintain a record of the conversation. Donation records may be kept
              longer where required for accounting, tax or audit purposes.
            </p>

            <h2>Your choices</h2>
            <p>
              You may ask the ashram office to access, correct or delete the
              information you have shared, subject to legal record-keeping
              requirements. Write to{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
              <a href={`tel:${site.phones[0].href}`}>{site.phones[0].label}</a>.
            </p>

            <h2>Security</h2>
            <p>
              The website uses industry-standard safeguards, including
              server-side validation and encrypted connections. No system is
              perfectly secure, so please avoid sending sensitive personal,
              medical or financial information through the general contact form.
            </p>

            <h2>Contact</h2>
            <p>
              {site.shortName}
              <br />
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.line3}
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>

            <p>
              <Link href="/contact">Return to the contact page →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
