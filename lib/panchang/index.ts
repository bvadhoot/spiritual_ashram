import { DateTime } from "luxon";
import {
  IST,
  calculatePanchang,
  dateTimeFor,
  isDateKey,
  isMonthKey,
} from "./calculate";
import { FESTIVALS, festivalsOn, upcomingFestivals } from "./festivals";
import { applyFestivalOverrides, type StoredFestival } from "./overrides";
import { getProkeralaPanchang } from "./prokerala";
import type {
  CalendarDay,
  CalendarEvent,
  Festival,
  MonthCalendar,
  PanchangDay,
} from "./types";

export { IST, indiaDate, isDateKey, isMonthKey } from "./calculate";
export { FESTIVALS, upcomingFestivals } from "./festivals";
export {
  applyFestivalOverrides,
  festivalAdminView,
  toFestival,
} from "./overrides";
export type { AdminFestival, FestivalSource, StoredFestival } from "./overrides";
export type {
  CalendarDay,
  CalendarEvent,
  Festival,
  MonthCalendar,
  PanchangDay,
} from "./types";

function recurringFestivals(day: PanchangDay): Festival[] {
  if (day.tithi.number === 11) {
    return [
      {
        id: `ekadashi-${day.date}`,
        date: day.date,
        name: `${day.tithi.paksha} Ekadashi`,
        nameTe: `${day.tithi.pakshaTe} ఏకాదశి`,
        description:
          "Ekadashi is the eleventh lunar day, kept as a day of fasting, prayer and simplicity. It is said that Vishnu sleeps on this day, and devotees turn inward.",
        descriptionTe:
          "ఏకాదశి పదకొండవ చాంద్రమాన దినం. ఉపవాసం, ప్రార్థన, సాధారణ జీవనంతో విష్ణువును స్మరిస్తారు.",
        category: "Ekadashi",
        major: false,
      },
    ];
  }

  if (day.tithi.number === 15) {
    return [
      {
        id: `lunar-${day.date}`,
        date: day.date,
        name: day.tithi.name,
        nameTe: day.tithi.nameTe,
        description:
          day.tithi.name === "Purnima"
            ? "The full moon is a time of completion and illumination. Devotees fast, offer arghya and gather for satsang under the full moon."
            : "The new moon is a time of rest and renewal. Devotees remember ancestors, offer charity and turn inward for a quiet beginning.",
        descriptionTe:
          day.tithi.name === "Purnima"
            ? "పూర్ణిమ పూర్ణత్వానికి, జ్ఞానానికి చిహ్నం. ఉపవాసం, అర్ఘ్యం, పౌర్ణమి సత్సంగంతో జరుపుకుంటారు."
            : "అమావాస్య విశ్రాంతికి, పునరుద్ధరణకు చిహ్నం. పితృ స్మరణ, దానం, అంతర్ముఖతతో జరుపుకుంటారు.",
        category: "Lunar day",
        major: false,
      },
    ];
  }

  return [];
}

/**
 * Festivals that fall on a date, after admin overrides. A named observance
 * suppresses the generic Ekadashi/Purnima entry, and moving or hiding a
 * festival in the admin moves the generic entry with it.
 */
export function getFestivalsForDay(
  day: PanchangDay,
  overrides: StoredFestival[] = [],
): Festival[] {
  const merged = applyFestivalOverrides(FESTIVALS, overrides);
  const dated = merged.filter(
    (item) => day.date >= item.date && day.date <= (item.endDate ?? item.date),
  );
  const generated = dated.length === 0 ? recurringFestivals(day) : [];
  return [...dated, ...generated];
}

export function eventOccursOn(event: CalendarEvent, date: string): boolean {
  return date >= event.date && date <= (event.endDate ?? event.date);
}

export function toCalendarEvent(event: {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  location: string;
  description: string;
  category: string;
}): CalendarEvent {
  return {
    id: event.id,
    date: event.date,
    endDate: event.endDate,
    title: event.title,
    location: event.location,
    description: event.description,
    category: event.category,
  };
}

export async function getDayCalendar(
  date: string,
  events: CalendarEvent[],
  today: string,
  overrides: StoredFestival[] = [],
): Promise<CalendarDay> {
  const calculated = calculatePanchang(date);
  const provider = await getProkeralaPanchang(date);
  const panchang = provider ?? calculated;

  return {
    ...panchang,
    festivals: getFestivalsForDay(panchang, overrides),
    events: events.filter((event) => eventOccursOn(event, date)),
    isToday: date === today,
  };
}

export function getMonthCalendar(
  monthKey: string,
  events: CalendarEvent[],
  today: string,
  overrides: StoredFestival[] = [],
): MonthCalendar {
  if (!isMonthKey(monthKey)) {
    throw new Error(`Invalid month key: ${monthKey}`);
  }

  const monthStart = DateTime.fromISO(`${monthKey}-01`, {
    zone: IST,
  }).startOf("day");
  const days: CalendarDay[] = [];
  const festivalMap = new Map<string, Festival>();
  const daysInMonth = monthStart.daysInMonth ?? 30;

  for (let offset = 0; offset < daysInMonth; offset += 1) {
    const date = monthStart.plus({ days: offset }).toISODate()!;
    const panchang = calculatePanchang(date);
    const festivals = getFestivalsForDay(panchang, overrides);
    for (const item of festivals) festivalMap.set(item.id, item);
    days.push({
      ...panchang,
      festivals,
      events: events.filter((event) => eventOccursOn(event, date)),
      isToday: date === today,
    });
  }

  return {
    year: monthStart.year,
    month: monthStart.month,
    monthKey,
    today,
    days,
    festivals: [...festivalMap.values()],
  };
}

/** Top upcoming festivals with the admin overrides applied. */
export function upcomingFestivalsWith(
  overrides: StoredFestival[],
  today: string,
  count = 5,
): Festival[] {
  return upcomingFestivals(
    today,
    count,
    applyFestivalOverrides(FESTIVALS, overrides),
  );
}

export function todayKey(): string {
  return DateTime.now().setZone(IST).toISODate()!;
}

export function addMonths(monthKey: string, amount: number): string {
  return dateTimeFor(`${monthKey}-01`)
    .plus({ months: amount })
    .toFormat("yyyy-MM");
}

export function dateFromMonthKey(monthKey: string): DateTime {
  return DateTime.fromISO(`${monthKey}-01`, { zone: IST }).startOf("day");
}
