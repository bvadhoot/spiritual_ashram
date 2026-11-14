import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Flame,
  GraduationCap,
  HeartHandshake,
  Leaf,
  MapPin,
  Mountain,
  Music2,
  Quote,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { guruBio, literaryWorks, recognition, timeline } from "@/lib/content";
import { site, stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Sri Dr. Basavalinga Avadhoota",
  description:
    "The life story of Poojya Sri Dr. Basavalinga Avadhoota — Peethadhikari of the Mallayyagiri, Basavakalyan and Degalmadi Ashrams, scholar, homeopathy practitioner and sadhaka.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sri Dr. Basavalinga Avadhoota",
    description:
      "From a village in Telangana to years of sadhana in the Himalayas — the life and service of Sri Dr. Basavalinga Avadhoota.",
    url: "/about",
    images: ["/images/guru-portrait.jpg"],
  },
};

const formation = [
  {
    title: "A devout beginning",
    description:
      "Born into a Lingayat family that had received spiritual initiation, he grew up in an atmosphere of devotion, discipline and traditional values — known then as Sri Basavaraj Mulge.",
    icon: Leaf,
  },
  {
    title: "Education & scholarship",
    description:
      "Schooling in Ratnapur and at N.F.H.S. Bidar, a B.A. at Kaviratna Kalidasa College, a laboratory technician course at Nittur, and an M.A. in Kannada and Philosophy with a gold medal.",
    icon: GraduationCap,
  },
  {
    title: "Years of sadhana",
    description:
      "His search for divine wisdom led him to years of penance in the Himalayas and to the sacred centres of Kashi, Srisailam, Rishikesh and Badrinath.",
    icon: Mountain,
  },
  {
    title: "Jnana Deeksha",
    description:
      "A defining moment: initiation into spiritual knowledge by his revered Guru, Paramahamsa Pagal Baba.",
    icon: Flame,
  },
  {
    title: "Jaganmatha Akkamahadevi",
    description:
      "He reveres Jaganmatha Akkamahadevi as his presiding deity — a source of inspiration through her devotion, vachanas and surrender to Lord Shiva.",
    icon: Sparkles,
  },
  {
    title: "A healer's hands",
    description:
      "A practitioner of homeopathy, he has extended care and guidance to countless devotees who have placed their faith in him.",
    icon: HeartHandshake,
  },
];

const ashrams = [
  {
    name: "Mallayyagiri Ashram",
    location:
      "Between Kuppanagar and Chillapalli villages, Jharasangam Mandal, Sangareddy District, Telangana",
    note: "The seat of the Peetha, where the Pournami gatherings and annual yoga and meditation camps are held.",
  },
  {
    name: "Basavakalyan Ashram",
    location:
      "Khanapur.k village, Basavakalyan Taluk, Bidar District, Karnataka",
    note: "A centre of satsang and spiritual education in the land of the Sharana tradition.",
  },
  {
    name: "Degalmadi Ashram",
    location:
      "Degalmadi village, Chincholi Taluk, Kalaburagi District, Karnataka",
    note: "Carrying the same daily worship, annadanam and spiritual care to devotees in Karnataka.",
  },
];

const avadhootaSyllables = [
  {
    syllable: "A",
    title: "Absolute freedom",
    description:
      "Liberation from worldly desires and attachments, and abiding in uninterrupted peace and divine bliss.",
  },
  {
    syllable: "VA",
    title: "Inner equanimity",
    description:
      "Freedom from craving and mastery of the restless mind — undisturbed by the past or anxiety for the future.",
  },
  {
    syllable: "DHU",
    title: "Purity of consciousness",
    description:
      "The mind free of ignorance, ego and attachment, naturally established in awareness of the Supreme Self.",
  },
  {
    syllable: "TA",
    title: "Realisation of truth",
    description:
      "The dissolution of the sense of separation, and absorption in the oneness of existence.",
  },
];

const guruDay = [
  {
    time: "3:30 am",
    title: "Worship and meditation",
    description:
      "The day begins with morning rituals, worship and spiritual contemplation until dawn.",
  },
  {
    time: "Morning",
    title: "Study and writing",
    description:
      "Reading, studying spiritual literature, composing devotional songs and writing philosophical reflections.",
  },
  {
    time: "Day",
    title: "Devotees and community",
    description:
      "Time with devotees who seek guidance, and with matters concerning the welfare of the community.",
  },
  {
    time: "Evening",
    title: "Spiritual discourse",
    description:
      "Discourses on righteous living and self-realisation, guiding those who come to listen.",
  },
  {
    time: "11:30 pm",
    title: "Meditation and rest",
    description: "The day closes with meditation before rest.",
  },
];

const languages = ["Kannada", "Telugu", "Hindi", "Marathi", "English"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Peethadhikari · Mallayyagiri, Basavakalyan & Degalmadi"
        title="A Life Devoted to the Divine"
        description="A revered spiritual guide, inspiring orator, compassionate humanitarian and guardian of India's cultural and spiritual heritage."
        breadcrumb="About Guru"
        image="/images/guru-portrait.jpg"
        imageAlt="Sri Dr. Basavalinga Avadhoota in a white turban and saffron shawl"
      />

      <section className="section-pad paper-texture bg-cream">
        <div className="container-site grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-lg lg:sticky lg:top-28 lg:max-w-none">
            <div
              className="absolute -top-4 -left-4 h-32 w-32 rounded-tl-[2rem] border-t border-l border-gold/50"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.4rem] border border-maroon/10 shadow-soft">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/guru-portrait.jpg"
                  alt="Portrait of Sri Dr. Basavalinga Avadhoota wearing a white turban and saffron robes"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-maroon-deep/50 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute right-4 bottom-4 left-4 rounded-xl border border-gold/30 bg-maroon-deep/65 p-4 backdrop-blur-md">
                  <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-gold uppercase">
                    Jaganmatha Akkamahadevi
                  </p>
                  <p className="mt-1 font-serif text-[1.05rem] text-cream">
                    His presiding deity
                  </p>
                </div>
              </div>
            </div>
            <div
              className="absolute -right-4 -bottom-4 h-32 w-32 rounded-br-[2rem] border-r border-b border-gold/50"
              aria-hidden="true"
            />
          </Reveal>

          <Reveal delay={0.05}>
            <SectionHeading
              eyebrow="The Life Story"
              title="The Guru"
              align="left"
            />
            <p className="mt-6 font-serif text-[1.5rem] leading-snug text-maroon-soft sm:text-[1.75rem]">
              {site.name}
            </p>

            <div className="mt-6 space-y-4 text-[0.93rem] leading-[1.95] text-ink-soft">
              {guruBio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                Alongside his spiritual work he practises homeopathy, offering
                care and guidance to devotees. His mission reaches beyond the
                discourse hall: he guides parents in raising children with
                strong moral values, encourages young people to overcome
                harmful habits, and inspires society towards unity,
                brotherhood, compassion and patriotism.
              </p>
            </div>

            <blockquote className="mt-8 rounded-2xl border border-gold/35 bg-cream-100/80 p-6">
              <Quote className="h-5 w-5 text-gold" aria-hidden="true" />
              <p className="mt-3 font-serif text-[1.15rem] leading-[1.7] text-maroon italic">
                “Spirituality is not merely the pursuit of personal liberation,
                but the responsibility to bring knowledge, peace, compassion
                and hope into the lives of others.”
              </p>
              <footer className="mt-4 text-[0.62rem] font-semibold tracking-[0.18em] text-ink-soft/60 uppercase">
                Guru Vani
              </footer>
            </blockquote>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/teachings">
                Explore the Teachings
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="/contact" variant="outline">
                Get in Touch
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="section-pad bg-cream-100"
        aria-labelledby="formation-heading"
      >
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Roots & Formation"
              title="Study, Sadhana and Grace"
              headingId="formation-heading"
              description="A village childhood, a scholar's discipline, years of penance and the grace of a Guru — the making of a Peethadhikari."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {formation.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="group h-full rounded-2xl border border-maroon/10 bg-cream p-6 transition-colors duration-300 hover:border-gold/50">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold-pale/40 text-maroon">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl">{item.title}</h3>
                  <p className="mt-2.5 text-[0.8rem] leading-[1.8] text-ink-soft">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section-pad bg-cream"
        aria-labelledby="timeline-heading"
      >
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Milestones"
              title="A Life of Sadhana"
              headingId="timeline-heading"
              description="From Ratnapur to Mallayyagiri — the outward milestones of a life given to the inner path."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.05}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-maroon/10 bg-cream p-6 transition-colors duration-300 hover:border-gold/50">
                  <span
                    className="absolute top-4 right-5 font-serif text-[4rem] leading-none text-maroon/[0.05] transition-colors group-hover:text-gold/20"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.64rem] font-semibold tracking-[0.24em] text-gold uppercase">
                    {item.year}
                  </p>
                  <h3 className="mt-3 text-xl">{item.title}</h3>
                  <p className="mt-2.5 text-[0.8rem] leading-[1.8] text-ink-soft">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section-pad bg-cream-100"
        aria-labelledby="ashrams-heading"
      >
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="The Peetha"
              title="One Peetha, Three Sacred Centres"
              headingId="ashrams-heading"
              description="As Peethadhikari, Sri Dr. Basavalinga Avadhoota guides three ashrams across Telangana and Karnataka. Each is a centre for spiritual education, meditation, social service and the preservation of cultural values."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {ashrams.map((ashram, index) => (
              <Reveal key={ashram.name} delay={index * 0.06}>
                <article className="h-full rounded-2xl border border-maroon/10 bg-cream p-6 transition-colors duration-300 hover:border-gold/50">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold-pale/40 text-maroon">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl">{ashram.name}</h3>
                  <p className="mt-2 text-[0.7rem] leading-relaxed tracking-[0.04em] text-gold uppercase">
                    {ashram.location}
                  </p>
                  <p className="mt-3 text-[0.8rem] leading-[1.8] text-ink-soft">
                    {ashram.note}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-[0.82rem] leading-[1.9] text-ink-soft">
              Spiritual discourses, devotional gatherings, meditation sessions,
              yoga camps and humanitarian programmes are held regularly at all
              three ashrams, which welcome devotees seeking guidance, peace of
              mind and a deeper understanding of life&apos;s purpose.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Service & Recognition"
                title="A Seat of Service"
                align="left"
                description="His work has been recognised by religious institutions and cultural associations across the Deccan — but the ashram measures success in the people it serves."
              />

              <ul className="mt-7 space-y-4">
                {recognition.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.85rem] leading-relaxed text-ink-soft"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold-pale/40 text-maroon">
                      <Award className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-maroon/10 pt-6 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-serif text-2xl text-maroon">
                      {stat.value}
                    </dd>
                    <p className="mt-1 text-[0.58rem] leading-relaxed tracking-[0.06em] text-ink-soft/65 uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.06} className="relative">
              <figure className="relative overflow-hidden rounded-2xl border border-maroon/10 shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/award.jpg"
                    alt="Sri Dr. Basavalinga Avadhoota at the World Peace Conference with other spiritual leaders"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-maroon-deep/65 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <figcaption className="absolute right-5 bottom-5 left-5 text-[0.68rem] leading-relaxed text-cream/85">
                  Honoured with an honorary doctorate at the World Peace
                  Conference, Ooty, 11 January 2020.
                </figcaption>
              </figure>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-maroon/10 bg-cream-100/70 p-4">
                  <HeartHandshake
                    className="h-4 w-4 text-gold"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-[0.8rem] font-medium text-maroon">
                    Dasoha
                  </p>
                  <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ink-soft">
                    Food is served daily to devotees, visitors and those in
                    need, with special meals at festivals.
                  </p>
                </div>
                <div className="rounded-xl border border-maroon/10 bg-cream-100/70 p-4">
                  <Sun className="h-4 w-4 text-gold" aria-hidden="true" />
                  <p className="mt-3 text-[0.8rem] font-medium text-maroon">
                    Sadhana camps
                  </p>
                  <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ink-soft">
                    Five to six yoga and meditation camps are held at the
                    ashram each year.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-maroon-deep py-16 text-cream sm:py-20">
        <div
          className="mandala-field absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div className="container-site relative">
          <div className="flex flex-col items-center gap-5 text-center">
            <OmMark size="md" variant="outline" />
            <SectionHeading
              eyebrow="The Avadhoota State"
              title="A · VA · DHU · TA"
              tone="light"
              description="In the Indian tradition the title Avadhoota names one of the highest states of realisation. Its four syllables carry four qualities."
            />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {avadhootaSyllables.map((item, index) => (
              <Reveal key={item.syllable} delay={index * 0.06}>
                <article className="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-gold/30">
                  <p className="font-serif text-3xl text-gold">
                    {item.syllable}
                  </p>
                  <h3 className="mt-3 text-[1.05rem] text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.78rem] leading-[1.8] text-cream/60">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button href="/teachings" variant="gold">
              Read the Seven Stages
            </Button>
          </div>
        </div>
      </section>

      <section
        className="section-pad bg-cream-100"
        aria-labelledby="writing-heading"
      >
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="A Voice in Verse"
              title="Words That Carry the Inner Life"
              headingId="writing-heading"
              description="Alongside his discourses, Gurudev writes songs, vachanas and philosophical works that bring the tradition into the language of daily life."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {literaryWorks.map((work, index) => (
              <Reveal key={work.title} delay={index * 0.05}>
                <article className="h-full rounded-2xl border border-maroon/10 bg-cream p-6 transition-colors duration-300 hover:border-gold/50">
                  {work.icon === "book" ? (
                    <BookOpen className="h-5 w-5 text-gold" aria-hidden="true" />
                  ) : (
                    <Music2 className="h-5 w-5 text-gold" aria-hidden="true" />
                  )}
                  <h3 className="mt-4 text-[1.2rem]">{work.title}</h3>
                  <p className="mt-2.5 text-[0.8rem] leading-[1.8] text-ink-soft">
                    {work.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mx-auto mt-10 max-w-2xl text-center">
              <p className="text-[0.82rem] leading-[1.9] text-ink-soft">
                His vachanas carry the signature “Ghana Yogi Mallinatha”.
                Recordings of his discourses and devotional songs are shared
                through the ashram&apos;s official channels.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/books" variant="primary" size="md">
                  Browse the Books
                </Button>
                <Button href="/aarti" variant="outline" size="md">
                  Aarti & Bhajans
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="section-pad bg-cream"
        aria-labelledby="discipline-heading"
      >
        <div className="container-site grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Discipline & Simplicity"
              title="A Day of Sadhana"
              headingId="discipline-heading"
              align="left"
              description="His day begins at 3:30 in the morning and closes near midnight — a rhythm of worship, study, writing and service."
            />

            <div className="mt-7 rounded-2xl border border-gold/30 bg-cream-100/70 p-6">
              <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-maroon-soft uppercase">
                Simple living
              </p>
              <p className="mt-3 text-[0.8rem] leading-[1.9] text-ink-soft">
                A morning meal of legumes with fresh fruit juice, and in the
                evening millet porridge and fruit. Moderation and simplicity
                are part of the teaching.
              </p>
              <p className="mt-5 text-[0.6rem] font-semibold tracking-[0.2em] text-maroon-soft uppercase">
                Languages of discourse
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full border border-maroon/15 bg-cream px-3.5 py-1.5 text-[0.7rem] font-medium text-maroon"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <ol className="relative space-y-6 border-l border-gold/30 pl-6">
              {guruDay.map((item) => (
                <li key={item.time} className="relative">
                  <span
                    className="absolute top-1.5 -left-[1.72rem] h-3 w-3 rounded-full border border-gold bg-cream"
                    aria-hidden="true"
                  />
                  <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-gold uppercase">
                    {item.time}
                  </p>
                  <h3 className="mt-1.5 text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-[0.8rem] leading-[1.8] text-ink-soft">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="container-site flex flex-col items-center justify-between gap-6 rounded-2xl border border-gold/30 bg-cream-100/60 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow mb-2">Visit Mallayyagiri</p>
            <h2 className="text-2xl">Come and sit with the tradition.</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {site.address.line1}, {site.address.line3}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/contact">Plan a Visit</Button>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full px-2 text-[0.7rem] font-semibold tracking-[0.14em] text-maroon uppercase underline decoration-gold/60 underline-offset-4 hover:decoration-gold"
            >
              Upcoming events
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
