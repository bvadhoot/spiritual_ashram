import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeatureStrip } from "@/components/home/feature-strip";
import { GuruSection } from "@/components/home/guru-section";
import { Highlights } from "@/components/home/highlights";
import { QuoteBanner } from "@/components/home/quote-banner";
import { GalleryEvents } from "@/components/home/gallery-events";
import { SevaCta } from "@/components/home/seva-cta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute:
      "Sri Basavalinga Avadhoota Ashram, Mallayyagiri | A Divine Abode of Peace",
  },
  description:
    "Visit the Mallayyagiri Ashram of Sri Dr. Basavalinga Avadhoota — a living tradition of satsang, sadhana, annadanam and service in Jharasangam, Telangana. Explore the Guru's teachings, gallery and upcoming events.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Sri Basavalinga Avadhoota Ashram, Mallayyagiri | A Divine Abode of Peace",
    description:
      "A living centre of devotion, sadhana and service in Jharasangam, Telangana. Discover the Guru, the ashram and its upcoming satsangs.",
    url: "/",
    images: ["/images/og-cover.jpg"],
  },
  twitter: {
    title:
      "Sri Basavalinga Avadhoota Ashram, Mallayyagiri | A Divine Abode of Peace",
    description:
      "A living centre of devotion, sadhana and service in Jharasangam, Telangana.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureStrip />
      <GuruSection />
      <Highlights />
      <QuoteBanner />
      <GalleryEvents />
      <SevaCta />
    </>
  );
}
