import { readPublicJson, writePublicJson } from "@/lib/storage";

export type EventCategory = "Satsang" | "Sadhana" | "Seva" | "Festival";

const STORED_EVENTS_FILE = "events.json";

export interface AshramEvent {
  id: string;
  slug: string;
  date: string;
  endDate?: string;
  title: string;
  location: string;
  description: string;
  category: EventCategory;
  image?: string;
  imageAlt?: string;
}

export const events: AshramEvent[] = [
  {
    id: "kartika-pournami-2026",
    slug: "kartika-pournami-deepotsava-2026",
    date: "2026-11-22",
    title: "Kartika Pournami Satsang & Deepotsava",
    location: "Mallayyagiri Ashram, Kuppa Nagar",
    description:
      "An evening of bhajan, deepotsava and Guru Vani as the ashram celebrates the full moon of Kartika. Annadanam is offered to every visiting devotee.",
    category: "Satsang",
    image: "/images/gallery-festival.jpg",
    imageAlt:
      "Devotees gathered around a brightly lit festival shrine at the ashram",
  },
  {
    id: "dattatreya-jayanti-2026",
    slug: "dattatreya-jayanti-guru-padapuja-2026",
    date: "2026-12-04",
    title: "Dattatreya Jayanti & Guru Padapuja",
    location: "Mallayyagiri Ashram",
    description:
      "Abhisheka, padapuja and a special satsang in honour of Lord Dattatreya and the Guru parampara. Devotees may bring flowers and simple offerings.",
    category: "Festival",
    image: "/images/gallery-prayer.jpg",
    imageAlt:
      "Sri Dr. Basavalinga Avadhoota praying before a flower-decorated shrine",
  },
  {
    id: "sankranti-annadanam-2027",
    slug: "makara-sankranti-annadanam-2027",
    date: "2027-01-14",
    title: "Makara Sankranti Annadanam",
    location: "Mallayyagiri Ashram",
    description:
      "A day of gratitude and shared harvest. The ashram serves a festive prasada and invites devotees to join the annadanam seva.",
    category: "Seva",
    image: "/images/highlight-annadanam.jpg",
    imageAlt: "Volunteers serving annadanam to devotees seated in long rows",
  },
  {
    id: "yoga-sadhana-camp-2027",
    slug: "yoga-sadhana-camp-february-2027",
    date: "2027-02-05",
    endDate: "2027-02-08",
    title: "Yoga Sadhana Camp",
    location: "Mallayyagiri Ashram",
    description:
      "Four days of guided asana, pranayama, silent meditation and evening satsang with Gurudev. Suitable for sincere seekers of every experience level.",
    category: "Sadhana",
    image: "/images/gallery-devotees.jpg",
    imageAlt:
      "Devotees seated together in the ashram hall during a spiritual programme",
  },
  {
    id: "akkamahadevi-jayanti-2027",
    slug: "akkamahadevi-jayanti-mahila-satsang-2027",
    date: "2027-03-08",
    title: "Akkamahadevi Jayanti & Mahila Satsang",
    location: "Mallayyagiri Ashram",
    description:
      "Honouring Jaganmatha Akkamahadevi with vachana singing, discourse and a special offering led by the women devotees of the ashram.",
    category: "Satsang",
    image: "/images/gallery-crowd.jpg",
    imageAlt: "A large gathering of devotees at an ashram satsang",
  },
  {
    id: "guru-purnima-2027",
    slug: "guru-purnima-mahotsava-2027",
    date: "2027-07-18",
    title: "Guru Purnima Mahotsava",
    location: "Mallayyagiri Ashram",
    description:
      "The annual celebration of the Guru principle — padapuja, cultural programmes, mahaprasada and an evening of devotional music.",
    category: "Festival",
    image: "/images/gallery-procession.jpg",
    imageAlt:
      "A traditional procession of devotees and the Guru through the ashram grounds",
  },
  {
    id: "yoga-sadhana-camp-2026",
    slug: "yoga-sadhana-camp-august-2026",
    date: "2026-08-05",
    endDate: "2026-08-08",
    title: "Yoga Sadhana Camp",
    location: "Mallayyagiri Ashram",
    description:
      "A four-day camp of yoga, meditation and satsang held in the quiet of the ashram.",
    category: "Sadhana",
  },
  {
    id: "jayanti-2026",
    slug: "golden-jubilee-jayanti-2026",
    date: "2026-07-21",
    title: "Golden Jubilee Jayanti Celebrations",
    location: "Mallayyagiri Ashram",
    description:
      "Devotees gathered to celebrate the 50th Jayanti of Gurudev with padapuja, annadanam and cultural offerings.",
    category: "Festival",
  },
  {
    id: "degalmadi-annadanam-2026",
    slug: "degalmadi-annadanam-2026",
    date: "2026-05-30",
    title: "Annadanam at Degalmadi Ashram",
    location: "Degalmadi Ashram, Kalburgi",
    description:
      "A day of seva and shared prasada at the Degalmadi Ashram in Karnataka.",
    category: "Seva",
  },
];

export async function getStoredEvents(): Promise<AshramEvent[]> {
  return readPublicJson<AshramEvent[]>(STORED_EVENTS_FILE, []);
}

/**
 * Events created in the admin are stored first; the original events remain in
 * code as the ashram's permanent calendar. Stored entries win by id or slug.
 */
export async function getAllEvents(): Promise<AshramEvent[]> {
  const stored = await getStoredEvents();
  const seen = new Set<string>();
  const merged: AshramEvent[] = [];

  for (const item of [...stored, ...events]) {
    if (seen.has(item.id) || seen.has(item.slug)) continue;
    seen.add(item.id);
    seen.add(item.slug);
    merged.push(item);
  }

  return merged;
}

export async function addStoredEvent(event: AshramEvent): Promise<void> {
  const stored = await getStoredEvents();
  const next = [
    event,
    ...stored.filter(
      (item) => item.id !== event.id && item.slug !== event.slug,
    ),
  ];
  await writePublicJson(STORED_EVENTS_FILE, next);
}

/** Replaces one admin-created event, keeping its id and slug. */
export async function updateStoredEvent(event: AshramEvent): Promise<boolean> {
  const stored = await getStoredEvents();
  let found = false;
  const next = stored.map((item) => {
    if (item.id !== event.id) return item;
    found = true;
    return event;
  });
  if (!found) return false;
  await writePublicJson(STORED_EVENTS_FILE, next);
  return true;
}

/** Removes one admin-created event. Code-defined events cannot be deleted. */
export async function deleteStoredEvent(id: string): Promise<boolean> {
  const stored = await getStoredEvents();
  const next = stored.filter((item) => item.id !== id);
  if (next.length === stored.length) return false;
  await writePublicJson(STORED_EVENTS_FILE, next);
  return true;
}

/**
 * Returns today's calendar date in India as YYYY-MM-DD, independent of the
 * server's timezone. Event dates are stored as calendar dates in IST.
 */
export function todayInIndia(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${read("year")}-${read("month")}-${read("day")}`;
}

export function eventEndDate(event: AshramEvent): string {
  return event.endDate ?? event.date;
}

/** An event remains visible for the whole of its final day. */
export function isUpcoming(event: AshramEvent, today = todayInIndia()): boolean {
  return eventEndDate(event) >= today;
}

export function sortEventsByDate(list: AshramEvent[]): AshramEvent[] {
  return [...list].sort((a, b) => {
    if (a.date === b.date) return a.title.localeCompare(b.title);
    return a.date < b.date ? -1 : 1;
  });
}

export function getUpcomingEventsFrom(
  list: AshramEvent[],
  count?: number,
  today = todayInIndia(),
): AshramEvent[] {
  const upcoming = sortEventsByDate(list.filter((event) => isUpcoming(event, today)));
  return typeof count === "number" ? upcoming.slice(0, count) : upcoming;
}

export function getPastEventsFrom(
  list: AshramEvent[],
  today = todayInIndia(),
): AshramEvent[] {
  return sortEventsByDate(list.filter((event) => !isUpcoming(event, today))).reverse();
}

export async function getUpcomingEvents(
  count?: number,
  today = todayInIndia(),
): Promise<AshramEvent[]> {
  return getUpcomingEventsFrom(await getAllEvents(), count, today);
}

export async function getPastEvents(
  today = todayInIndia(),
): Promise<AshramEvent[]> {
  return getPastEventsFrom(await getAllEvents(), today);
}

const fullDateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const shortDateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  timeZone: "Asia/Kolkata",
});

function asIndiaDate(date: string): Date {
  return new Date(`${date}T12:00:00+05:30`);
}

export function formatEventDate(date: string): string {
  return fullDateFormat.format(asIndiaDate(date));
}

export function formatEventDateRange(event: AshramEvent): string {
  if (!event.endDate) return formatEventDate(event.date);
  return `${shortDateFormat.format(asIndiaDate(event.date))} – ${formatEventDate(
    event.endDate,
  )}`;
}

export function getEventDateParts(date: string): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  const value = asIndiaDate(date);
  return {
    day: new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(value),
    month: new Intl.DateTimeFormat("en-IN", {
      month: "short",
      timeZone: "Asia/Kolkata",
    })
      .format(value)
      .toUpperCase(),
    year: new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(value),
    weekday: new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      timeZone: "Asia/Kolkata",
    }).format(value),
  };
}
