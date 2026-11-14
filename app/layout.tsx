import type { Metadata, Viewport } from "next";
import {
  Inter,
  Noto_Sans_Telugu,
  Playfair_Display,
  Ramabhadra,
} from "next/font/google";
import "./globals.css";
import { DonationProvider } from "@/components/donate/donation-context";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TopBar } from "@/components/layout/top-bar";
import { site } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-telugu",
  display: "swap",
});

const ramabhadra = Ramabhadra({
  subsets: ["telugu"],
  weight: "400",
  variable: "--font-ramabhadra",
  display: "swap",
});

const siteUrl = site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.shortName} | Mallayyagiri, Telangana`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Sri Basavalinga Avadhoota",
    "Basavalinga Avadhoota Ashram",
    "Mallayyagiri Ashram",
    "Mullajgiri",
    "Jharasangam",
    "Telangana ashram",
    "spiritual ashram India",
    "Guru Vani",
    "satsang Telangana",
    "annadanam",
  ],
  authors: [{ name: site.shortName, url: siteUrl }],
  creator: site.shortName,
  publisher: site.shortName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: site.shortName,
    title: `${site.shortName} | A Divine Abode in Mallayyagiri`,
    description: site.description,
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Basavalinga Avadhoota Ashram — a divine abode for peace, devotion and spiritual transformation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} | Mallayyagiri, Telangana`,
    description: site.description,
    images: ["/images/og-cover.jpg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "religion",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#321111" },
  ],
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["PlaceOfWorship", "Organization"],
      "@id": `${siteUrl}#ashram`,
      name: site.shortName,
      alternateName: [
        "Mallayyagiri Ashram",
        "Sri Basavalinga Avadhoota Ashram, Mullajgiri",
      ],
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      image: `${siteUrl}/images/guru-portrait.jpg`,
      description: site.description,
      email: site.email,
      telephone: site.phones.map((phone) => phone.href),
      founder: {
        "@type": "Person",
        name: site.name,
        jobTitle: "Peethadhikari",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: `${site.address.line1}, ${site.address.line2}`,
        addressLocality: "Jharasangam",
        addressRegion: "Telangana",
        postalCode: "585307",
        addressCountry: "IN",
      },
      sameAs: site.socials.map((social) => social.href),
      knowsLanguage: ["te", "kn", "hi", "mr", "en"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: site.shortName,
      description: site.description,
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}#ashram` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${inter.variable} ${notoTelugu.variable} ${ramabhadra.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <DonationProvider>
          <TopBar />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <Footer />
        </DonationProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
