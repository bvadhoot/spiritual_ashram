import type { Metadata } from "next";
import { ExternalLink, Flame, Mail, Music2 } from "lucide-react";
import { AartiPlaylist } from "@/components/aarti/aarti-playlist";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { youtubeChannel } from "@/lib/aarti";
import { getAllAartiTracks } from "@/lib/aarti-store";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aarti & Bhajans",
  description:
    "Listen to aarti, bhajans and devotional songs from Sri Basavalinga Avadhoota Ashram, Mallayyagiri. Play the ashram's devotional recordings and visit the official YouTube channel.",
  alternates: { canonical: "/aarti" },
  openGraph: {
    title: "Aarti & Bhajans | Sri Basavalinga Avadhoota Ashram",
    description:
      "A playlist of devotional songs from the ashram's official YouTube channel.",
    url: "/aarti",
    images: ["/images/gallery-prayer.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function AartiPage() {
  const tracks = await getAllAartiTracks();

  return (
    <>
      <PageHero
        eyebrow="Songs of Devotion"
        title="Aarti & Bhajans"
        description="The ashram's devotional recordings, gathered in one place. Light a lamp, soften the heart, and sing along with the songs of the tradition."
        breadcrumb="Aarti"
        image="/images/gallery-prayer.jpg"
        imageAlt="Devotees in prayer at the ashram"
      />

      <section className="section-pad bg-cream">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Listen & Sing Along"
              title="The Devotional Playlist"
              description="Play a bhajan here, or open any recording on YouTube. The playlist is drawn from the ashram's official channel and grows as new songs are released."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-12">
              <AartiPlaylist tracks={tracks} />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-center text-[0.68rem] leading-relaxed text-ink-soft/55">
              Playback is provided by YouTube. Opening a video may set cookies on
              your device under YouTube&apos;s own privacy policy.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 sm:py-20">
        <div className="container-site">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <Reveal>
              <div>
                <p className="eyebrow mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
                  The Offering of Light
                  <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
                </p>
                <h2 className="text-[2rem] leading-[1.15] sm:text-[2.5rem]">
                  A Lamp, a Song, a Heart Turned Home
                </h2>
                <div className="mt-6 space-y-4 text-[0.9rem] leading-[1.9] text-ink-soft">
                  <p>
                    Aarti is the offering of light — a small flame lifted before
                    the Divine while the heart is lifted with it. In the ashram,
                    the evening lamp is accompanied by songs that carry the
                    devotee from the noise of the day into remembrance.
                  </p>
                  <p>
                    The bhajans and devotional songs here belong to that living
                    practice. They are shared from the ashram's official channel,
                    in Kannada, Telugu and Hindi, so that anyone, in any place, can
                    join the singing.
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href={youtubeChannel}
                    external
                    variant="primary"
                    size="md"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Open the YouTube channel
                  </Button>
                  <Button href="/contact" variant="outline" size="md">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Ask the office
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-maroon-deep p-7 text-cream sm:p-9">
                <div
                  className="pointer-events-none absolute -right-10 -bottom-16 font-serif text-[15rem] leading-none text-gold/[0.05] select-none"
                  aria-hidden="true"
                >
                  ॐ
                </div>
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-white/5 text-gold">
                    <Flame className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-serif text-[1.55rem] leading-snug text-cream">
                    Sing with the ashram
                  </h3>
                  <p className="mt-3 text-[0.82rem] leading-[1.85] text-cream/65">
                    If you have a recording of an aarti or bhajan sung at the
                    ashram, the office would be glad to hear it. New recordings
                    are added to the channel and to this playlist as they are
                    published.
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[0.72rem] text-cream/55">
                    <Music2 className="h-3.5 w-3.5 text-gold/75" aria-hidden="true" />
                    Aarti, bhajans and devotional songs
                  </div>
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent(
                      "Aarti / bhajan recording for the ashram",
                    )}`}
                    className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-gold uppercase transition-colors hover:text-gold-light"
                  >
                    Write to the office
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <div className="mx-auto mt-14 max-w-3xl text-center">
              <OmMark size="md" variant="solid" className="mx-auto" />
              <blockquote className="mt-5 font-serif text-[1.35rem] leading-[1.65] text-maroon italic sm:text-[1.55rem]">
                “Let the lamp burn steadily, let the song rise without effort,
                and let the heart remember what it has always known.”
              </blockquote>
              <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.2em] text-ink-soft/60 uppercase">
                Guru Vani
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
