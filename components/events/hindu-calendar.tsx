"use client";

import { useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Languages,
  Loader2,
  MapPin,
  Moon,
  Sparkles,
  Sun,
  Sunset,
  X,
} from "lucide-react";
import { useDialog } from "@/lib/use-dialog";
import { cn } from "@/lib/utils";
import type {
  CalendarDay,
  CalendarEvent,
  Festival,
  Language,
  MonthCalendar,
  PanchangDay,
} from "@/lib/panchang/types";

const IST = "Asia/Kolkata";

const MONTHS_TE = [
  "జనవరి",
  "ఫిబ్రవరి",
  "మార్చి",
  "ఏప్రిల్",
  "మే",
  "జూన్",
  "జూలై",
  "ఆగస్టు",
  "సెప్టెంబర్",
  "అక్టోబర్",
  "నవంబర్",
  "డిసెంబర్",
] as const;

const WEEKDAYS = [
  { en: "Sun", te: "ఆది" },
  { en: "Mon", te: "సోమ" },
  { en: "Tue", te: "మంగళ" },
  { en: "Wed", te: "బుధ" },
  { en: "Thu", te: "గురు" },
  { en: "Fri", te: "శుక్ర" },
  { en: "Sat", te: "శని" },
] as const;

const copy = {
  en: {
    eyebrow: "Panchang · IST",
    title: "Hindu Calendar",
    subtitle:
      "Tithi, nakshatra, rashi, festivals and the ashram's own gatherings in one place.",
    today: "Today's Panchang",
    tithi: "Tithi",
    nakshatra: "Nakshatra",
    rashi: "Rashi",
    moonRashi: "Chandra Rashi",
    rahu: "Rahu Kalam",
    abhijit: "Abhijit Muhurtam",
    sunrise: "Sunrise",
    sunset: "Sunset",
    live: "Live panchang",
    calculated: "Calculated panchang",
    calendar: "Monthly Calendar",
    previous: "Previous month",
    next: "Next month",
    todayButton: "Today",
    language: "Language",
    english: "English",
    telugu: "తెలుగు",
    loading: "Reading the almanac…",
    loadError: "The calendar could not be loaded. Please try again.",
    retry: "Try again",
    agenda: "Agenda",
    festivals: "Festivals",
    ashramEvents: "Ashram events",
    noFestivals: "No festival on this day.",
    noEvents: "No ashram programme on this day.",
    dayDetail: "Day detail",
    mythology: "Mythology & meaning",
    allTimes: "All times are IST (India Standard Time).",
    source: "Panchang source",
    topUpcoming: "Top 5 Upcoming Festivals",
    topUpcomingSubtitle: "The next celebrations on the ashram calendar.",
    todayLabel: "Today",
    tomorrow: "Tomorrow",
    inDays: (days: number) => `in ${days} days`,
    event: "Ashram event",
    observance: "Observance",
    close: "Close day detail",
    padma: "Pada",
    sunriseShort: "Sunrise",
    sunsetShort: "Sunset",
    more: (count: number) => `+${count} more`,
    unknownMonth: "Calendar",
    date: "Date",
  },
  te: {
    eyebrow: "పంచాంగం · భారత కాలమానం",
    title: "హిందూ పంచాంగం",
    subtitle:
      "తిథి, నక్షత్రం, రాశి, పండుగలు మరియు ఆశ్రమ కార్యక్రమాలు ఒకే చోట.",
    today: "నేటి పంచాంగం",
    tithi: "తిథి",
    nakshatra: "నక్షత్రం",
    rashi: "రాశి",
    moonRashi: "చంద్ర రాశి",
    rahu: "రాహు కాలం",
    abhijit: "అభిజిత్ ముహూర్తం",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    live: "ప్రత్యక్ష పంచాంగం",
    calculated: "గణించిన పంచాంగం",
    calendar: "నెలవారీ క్యాలెండర్",
    previous: "గత నెల",
    next: "తదుపరి నెల",
    todayButton: "నేడు",
    language: "భాష",
    english: "English",
    telugu: "తెలుగు",
    loading: "పంచాంగం చదువుతోంది…",
    loadError: "క్యాలెండర్ లోడ్ చేయలేకపోయింది. మళ్లీ ప్రయత్నించండి.",
    retry: "మళ్లీ ప్రయత్నించండి",
    agenda: "అజెండా",
    festivals: "పండుగలు",
    ashramEvents: "ఆశ్రమ కార్యక్రమాలు",
    noFestivals: "ఈ రోజు పండుగ లేదు.",
    noEvents: "ఈ రోజు ఆశ్రమ కార్యక్రమం లేదు.",
    dayDetail: "దిన వివరాలు",
    mythology: "పురాణ కథనం & అర్థం",
    allTimes: "అన్ని సమయాలు భారత కాలమానం (IST) ప్రకారం.",
    source: "పంచాంగ మూలం",
    topUpcoming: "రాబోయే 5 ప్రధాన పండుగలు",
    topUpcomingSubtitle: "ఆశ్రమ క్యాలెండర్‌లో తదుపరి వేడుకలు.",
    todayLabel: "నేడు",
    tomorrow: "రేపు",
    inDays: (days: number) => `${days} రోజుల్లో`,
    event: "ఆశ్రమ కార్యక్రమం",
    observance: "ఆచరణ",
    close: "దిన వివరాలు మూసివేయండి",
    padma: "పాదం",
    sunriseShort: "సూర్యోదయం",
    sunsetShort: "సూర్యాస్తమయం",
    more: (count: number) => `+${count} మరిన్ని`,
    unknownMonth: "క్యాలెండర్",
    date: "తేదీ",
  },
} as const;

function dateTime(date: string) {
  return DateTime.fromISO(date, { zone: IST }).startOf("day");
}

function fullDate(date: string, language: Language) {
  return dateTime(date)
    .setLocale(language === "te" ? "te-IN" : "en-IN")
    .toFormat("cccc, d LLLL yyyy");
}

function shortWeekday(date: string, language: Language) {
  return dateTime(date)
    .setLocale(language === "te" ? "te-IN" : "en-IN")
    .toFormat("cccc");
}

function eventOn(event: CalendarEvent, date: string) {
  return date >= event.date && date <= (event.endDate ?? event.date);
}

function eventDatesFor(events: CalendarEvent[], date: string) {
  return events.filter((event) => eventOn(event, date));
}

function festivalCountdown(date: string, today: string, language: Language) {
  const days = Math.max(
    0,
    Math.ceil(
      dateTime(date).diff(dateTime(today), "days").days,
    ),
  );
  if (days === 0) return copy[language].todayLabel;
  if (days === 1) return copy[language].tomorrow;
  return copy[language].inDays(days);
}

function sourceLabel(source: PanchangDay["source"], language: Language) {
  return source === "prokerala"
    ? copy[language].live
    : copy[language].calculated;
}

export interface HinduCalendarProps {
  initialMonth: MonthCalendar;
  today: PanchangDay;
  upcomingFestivals: Festival[];
  events: CalendarEvent[];
}

export function HinduCalendar({
  initialMonth,
  today,
  upcomingFestivals,
  events,
}: HinduCalendarProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [month, setMonth] = useState({
    year: initialMonth.year,
    month: initialMonth.month,
  });
  const [days, setDays] = useState(initialMonth.days);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CalendarDay | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const monthRequest = useRef(0);
  const detailRequest = useRef(0);
  const t = copy[language];

  const liveToday = DateTime.now().setZone(IST).toISODate() ?? today.date;

  const dayMap = useMemo(
    () => new Map(days.map((day) => [day.date, day])),
    [days],
  );

  const monthStart = DateTime.fromObject(
    { year: month.year, month: month.month, day: 1 },
    { zone: IST },
  ).startOf("day");
  const leadingDays = monthStart.weekday % 7;
  const gridStart = monthStart.minus({ days: leadingDays });
  const gridCells = Array.from({ length: 42 }, (_, index) =>
    gridStart.plus({ days: index }),
  );
  const monthLabel =
    language === "te"
      ? `${MONTHS_TE[monthStart.month - 1]} ${monthStart.year}`
      : monthStart.setLocale("en-IN").toFormat("LLLL yyyy");

  const closeDialog = () => {
    detailRequest.current += 1;
    setSelected(null);
  };
  useDialog(Boolean(selected), dialogRef, closeDialog);

  function applyEvents(nextDays: CalendarDay[]) {
    return nextDays.map((day) => ({
      ...day,
      events: eventDatesFor(events, day.date),
    }));
  }

  async function loadMonth(next: DateTime) {
    const key = next.toFormat("yyyy-MM");
    const request = ++monthRequest.current;
    setMonth({ year: next.year, month: next.month });
    detailRequest.current += 1;
    setSelected(null);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/panchang?month=${key}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        ok?: boolean;
        calendar?: MonthCalendar;
        error?: string;
      };
      if (request !== monthRequest.current) return;
      if (!response.ok || !result.ok || !result.calendar) {
        throw new Error(result.error ?? t.loadError);
      }
      setDays(applyEvents(result.calendar.days));
    } catch {
      if (request === monthRequest.current) setError(t.loadError);
    } finally {
      if (request === monthRequest.current) setLoading(false);
    }
  }

  function changeMonth(offset: number) {
    void loadMonth(monthStart.plus({ months: offset }));
  }

  function goToday() {
    const now = DateTime.fromISO(liveToday, { zone: IST }).startOf("day");
    if (now.year === month.year && now.month === month.month) {
      const todayDay = dayMap.get(liveToday);
      if (todayDay) void openDay(todayDay);
      return;
    }
    void loadMonth(now);
  }

  async function openDay(day: CalendarDay) {
    const request = ++detailRequest.current;
    setSelected({
      ...day,
      events: eventDatesFor(events, day.date),
    });
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/panchang?date=${day.date}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        ok?: boolean;
        day?: CalendarDay;
      };
      if (request !== detailRequest.current) return;
      if (response.ok && result.ok && result.day) {
        setSelected({
          ...result.day,
          events: eventDatesFor(events, day.date),
        });
      }
    } catch {
      // The calculated month data is already visible; keep it.
    } finally {
      if (request === detailRequest.current) setDetailLoading(false);
    }
  }

  return (
    <div
      lang={language === "te" ? "te" : "en"}
      className={cn("mt-10 space-y-6", language === "te" && "font-telugu")}
    >
      <section className="relative overflow-hidden rounded-3xl border border-gold/25 bg-maroon-deep p-6 text-cream shadow-soft sm:p-8">
        <div className="mandala-field absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.22em] text-gold uppercase">
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                {t.today}
              </p>
              <h3 className="mt-2 max-w-2xl text-[1.7rem] text-cream sm:text-[2.1rem]">
                {fullDate(today.date, language)}
              </h3>
              <p className="mt-2 text-[0.78rem] text-cream/55">
                {today.tithi.paksha} Paksha · {today.tithi.name}
                {language === "te" ? ` · ${today.tithi.nameTe}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[0.6rem] font-semibold tracking-[0.12em] text-gold uppercase">
                {sourceLabel(today.source, language)}
              </span>
              <div className="flex items-center gap-1 rounded-full border border-cream/15 bg-cream/5 p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={language === "en"}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.62rem] transition",
                    language === "en"
                      ? "bg-gold text-maroon-deep"
                      : "text-cream/60 hover:text-cream",
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("te")}
                  aria-pressed={language === "te"}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.62rem] transition",
                    language === "te"
                      ? "bg-gold text-maroon-deep"
                      : "text-cream/60 hover:text-cream",
                  )}
                >
                  తెలుగు
                </button>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-cream/10 pt-5 sm:grid-cols-3 lg:grid-cols-5">
            <PanchangStat label={t.tithi} value={language === "te" ? today.tithi.nameTe : today.tithi.name} note={today.tithi.paksha} />
            <PanchangStat label={t.nakshatra} value={language === "te" ? today.nakshatra.nameTe : today.nakshatra.name} note={`${t.padma} ${today.nakshatra.pada}`} />
            <PanchangStat label={t.rashi} value={language === "te" ? today.rashi.nameTe : today.rashi.name} note={`${t.moonRashi}: ${language === "te" ? today.moonRashi.nameTe : today.moonRashi.name}`} />
            <PanchangStat label={t.rahu} value={today.rahuKalam} icon={<Clock3 className="h-3.5 w-3.5" />} />
            <PanchangStat label={t.abhijit} value={today.abhijit} icon={<Sparkles className="h-3.5 w-3.5" />} />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.66rem] text-cream/45">
            <span className="inline-flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
              {t.sunrise}: {today.sunrise}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sunset className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
              {t.sunset}: {today.sunset}
            </span>
            <span>{t.allTimes}</span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-maroon/10 bg-white shadow-card" aria-labelledby="hindu-calendar-heading">
        <div className="flex flex-col gap-4 border-b border-maroon/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              {t.calendar}
            </p>
            <h3 id="hindu-calendar-heading" className="mt-1.5 text-2xl sm:text-[1.8rem]">
              {monthLabel}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label={t.previous}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="rounded-full border border-maroon/15 px-3.5 py-2 text-[0.65rem] font-semibold tracking-[0.1em] text-maroon uppercase transition hover:border-gold hover:bg-gold-pale/40"
            >
              {t.todayButton}
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label={t.next}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 border-b border-gold/20 bg-gold-pale/25 px-4 py-2 text-[0.68rem] text-maroon">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            {t.loading}
          </div>
        ) : null}
        {error ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-[0.68rem] text-red-800" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => changeMonth(0)}
              className="font-semibold underline underline-offset-2"
            >
              {t.retry}
            </button>
          </div>
        ) : null}

        <div className="hidden lg:block">
          <div className="grid grid-cols-7 border-b border-maroon/10 bg-cream-100/60">
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday.en}
                className="px-3 py-2.5 text-center text-[0.58rem] font-semibold tracking-[0.18em] text-maroon-soft/65 uppercase"
              >
                {language === "te" ? weekday.te : weekday.en}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {gridCells.map((cell) => {
              const key = cell.toISODate()!;
              const isInMonth = cell.month === month.month;
              const day = isInMonth ? dayMap.get(key) : undefined;
              const hasFestival = Boolean(day?.festivals.length);
              const hasEvent = Boolean(day?.events.length);
              const isToday = key === liveToday;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={!day}
                  onClick={() => day && void openDay(day)}
                  className={cn(
                    "relative min-h-[7.3rem] border-r border-b border-maroon/8 p-2.5 text-left align-top transition last:border-r-0 disabled:cursor-default",
                    !isInMonth && "bg-cream-100/35",
                    hasFestival && "bg-gold-pale/20 hover:bg-gold-pale/40",
                    !hasFestival && day && "hover:bg-cream-100/70",
                    isToday && "ring-1 ring-inset ring-gold/60",
                  )}
                  aria-label={day ? `${key}: ${day.tithi.name}` : undefined}
                >
                  <span
                    className={cn(
                      "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[0.72rem] font-semibold tabular-nums",
                      isToday
                        ? "bg-maroon text-cream"
                        : day
                          ? "text-maroon"
                          : "text-maroon/25",
                    )}
                  >
                    {cell.day}
                  </span>
                  {day ? (
                    <>
                      <span className="mt-1 block truncate text-[0.62rem] text-ink-soft/70">
                        {language === "te" ? day.tithi.nameTe : day.tithi.name}
                      </span>
                      <span className="mt-1 space-y-0.5">
                        {day.festivals.slice(0, 2).map((festival) => (
                          <span
                            key={festival.id}
                            className="flex items-start gap-1 text-[0.64rem] leading-snug font-medium text-maroon"
                          >
                            <Flame className="mt-[2px] h-2.5 w-2.5 shrink-0 text-gold" aria-hidden="true" />
                            <span className="line-clamp-2">
                              {language === "te" ? festival.nameTe : festival.name}
                            </span>
                          </span>
                        ))}
                        {day.festivals.length > 2 ? (
                          <span className="block pl-3.5 text-[0.56rem] text-ink-soft/55">
                            {t.more(day.festivals.length - 2)}
                          </span>
                        ) : null}
                      </span>
                      {hasEvent ? (
                        <span className="mt-1.5 flex items-center gap-1 text-[0.58rem] font-semibold text-maroon-soft">
                          <CalendarDays className="h-2.5 w-2.5 text-gold" aria-hidden="true" />
                          {day.events.length} {language === "te" ? "కార్యక్రమం" : day.events.length === 1 ? "event" : "events"}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="border-b border-maroon/10 bg-cream-100/60 px-4 py-2.5 text-[0.58rem] font-semibold tracking-[0.18em] text-maroon-soft/65 uppercase">
            {t.agenda}
          </div>
          <ol className="divide-y divide-maroon/10">
            {days.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  onClick={() => void openDay(day)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-cream-100/60",
                    day.isToday && "bg-gold-pale/25",
                  )}
                >
                  <span className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-maroon/10 bg-white px-1 py-1.5">
                    <span className="font-serif text-xl leading-none text-maroon">{dateTime(day.date).day}</span>
                    <span className="mt-1 text-[0.5rem] font-semibold tracking-[0.12em] text-ink-soft/60 uppercase">
                      {dateTime(day.date).setLocale(language === "te" ? "te-IN" : "en-IN").toFormat("LLL")}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[0.75rem] font-semibold text-maroon">
                        {language === "te" ? day.tithi.nameTe : day.tithi.name}
                      </span>
                      <span className="text-[0.58rem] text-ink-soft/60">
                        {language === "te" ? day.nakshatra.nameTe : day.nakshatra.name}
                      </span>
                      {day.isToday ? (
                        <span className="rounded-full bg-maroon px-1.5 py-0.5 text-[0.48rem] font-semibold text-cream uppercase">
                          {t.todayLabel}
                        </span>
                      ) : null}
                    </span>
                    {day.festivals.length > 0 ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {day.festivals.slice(0, 2).map((festival) => (
                          <span key={festival.id} className="rounded-full bg-gold-pale/60 px-2 py-0.5 text-[0.56rem] text-maroon">
                            {language === "te" ? festival.nameTe : festival.name}
                          </span>
                        ))}
                      </span>
                    ) : null}
                    {day.events.length > 0 ? (
                      <span className="mt-1 flex items-center gap-1 text-[0.56rem] text-maroon-soft">
                        <CalendarDays className="h-2.5 w-2.5 text-gold" aria-hidden="true" />
                        {day.events.map((event) => event.title).join(" · ")}
                      </span>
                    ) : null}
                  </span>
                  <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-3xl border border-gold/25 bg-cream-100/70 p-5 sm:p-6" aria-labelledby="upcoming-festivals-heading">
        <div className="flex flex-col gap-2 border-b border-maroon/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              {t.topUpcoming}
            </p>
            <p className="mt-1 text-[0.75rem] text-ink-soft">{t.topUpcomingSubtitle}</p>
          </div>
          <span className="text-[0.6rem] font-semibold tracking-[0.12em] text-maroon-soft/60 uppercase">
            {t.allTimes}
          </span>
        </div>
        <ol className="divide-y divide-maroon/10">
          {upcomingFestivals.map((festival) => (
            <li key={festival.id} className="flex items-center gap-3 py-3.5">
              <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-maroon text-cream">
                <span className="font-serif text-lg leading-none">{dateTime(festival.date).day}</span>
                <span className="mt-0.5 text-[0.45rem] font-semibold tracking-[0.1em] text-gold uppercase">
                  {dateTime(festival.date).setLocale(language === "te" ? "te-IN" : "en-IN").toFormat("LLL")}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-[0.9rem] text-maroon sm:text-[1rem]">
                  {language === "te" ? festival.nameTe : festival.name}
                </span>
                <span className="mt-0.5 block truncate text-[0.62rem] text-ink-soft/65">
                  {language === "te" ? festival.name : festival.nameTe}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[0.68rem] font-semibold text-maroon">
                  {festivalCountdown(festival.date, liveToday, language)}
                </span>
                <span className="mt-0.5 block text-[0.58rem] text-ink-soft/55">
                  {shortWeekday(festival.date, language)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-maroon-deep/80 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeDialog();
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="hindu-day-title"
              tabIndex={-1}
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gold/30 bg-cream shadow-soft outline-none sm:max-h-[calc(100dvh-3rem)]"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-maroon/10 bg-cream/95 px-5 py-4 backdrop-blur-sm sm:px-6">
                <div>
                  <p className="eyebrow">{t.dayDetail}</p>
                  <h3 id="hindu-day-title" className="mt-1 text-xl sm:text-2xl">
                    {fullDate(selected.date, language)}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.7rem] text-ink-soft">
                    <span>{selected.tithi.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selected.nakshatra.name}</span>
                    <span className="rounded-full border border-gold/40 bg-gold-pale/40 px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.08em] text-maroon uppercase">
                      {sourceLabel(selected.source, language)}
                    </span>
                    {detailLoading ? <Loader2 className="h-3 w-3 animate-spin text-gold" aria-label={t.loading} /> : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label={t.close}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <DetailTile label={t.tithi} value={language === "te" ? selected.tithi.nameTe : selected.tithi.name} note={`${selected.tithi.paksha} Paksha`} />
                  <DetailTile label={t.nakshatra} value={language === "te" ? selected.nakshatra.nameTe : selected.nakshatra.name} note={`${t.padma} ${selected.nakshatra.pada}`} />
                  <DetailTile label={t.rashi} value={language === "te" ? selected.rashi.nameTe : selected.rashi.name} note={`${t.moonRashi}: ${language === "te" ? selected.moonRashi.nameTe : selected.moonRashi.name}`} />
                  <DetailTile label={t.rahu} value={selected.rahuKalam} note={t.abhijit} />
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  <DetailTile label={t.abhijit} value={selected.abhijit} icon={<Sparkles className="h-3.5 w-3.5" />} />
                  <DetailTile label={t.sunrise} value={selected.sunrise} icon={<Sun className="h-3.5 w-3.5" />} />
                  <DetailTile label={t.sunset} value={selected.sunset} icon={<Sunset className="h-3.5 w-3.5" />} />
                </div>

                <section aria-labelledby="festival-detail-heading">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-gold" aria-hidden="true" />
                    <h4 id="festival-detail-heading" className="text-lg">{t.festivals}</h4>
                  </div>
                  {selected.festivals.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {selected.festivals.map((festival) => (
                        <article key={festival.id} className="rounded-xl border border-gold/25 bg-white/70 p-3.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h5 className="text-[1.02rem] text-maroon">
                              {language === "te" ? festival.nameTe : festival.name}
                            </h5>
                            <span className="rounded-full bg-gold-pale/60 px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.08em] text-maroon uppercase">
                              {festival.category}
                            </span>
                          </div>
                          <p className={cn("mt-1 text-[0.62rem] text-ink-soft/65", language === "en" && "font-telugu-body")}>
                            {language === "te" ? festival.name : festival.nameTe}
                          </p>
                          <p className="mt-2 text-[0.76rem] leading-relaxed text-ink-soft">
                            {language === "te" ? festival.descriptionTe : festival.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[0.76rem] text-ink-soft">{t.noFestivals}</p>
                  )}
                </section>

                <section aria-labelledby="event-detail-heading">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
                    <h4 id="event-detail-heading" className="text-lg">{t.ashramEvents}</h4>
                  </div>
                  {selected.events.length > 0 ? (
                    <div className="mt-3 space-y-2.5">
                      {selected.events.map((event) => (
                        <article key={event.id} className="rounded-xl border border-maroon/10 bg-white p-3.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h5 className="text-[0.98rem] text-maroon">{event.title}</h5>
                            <span className="text-[0.55rem] font-semibold tracking-[0.08em] text-gold uppercase">{event.category}</span>
                          </div>
                          <p className="mt-1 flex items-center gap-1 text-[0.63rem] text-ink-soft/70">
                            <MapPin className="h-3 w-3 text-gold" aria-hidden="true" />
                            {event.location}
                          </p>
                          <p className="mt-2 text-[0.76rem] leading-relaxed text-ink-soft">{event.description}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[0.76rem] text-ink-soft">{t.noEvents}</p>
                  )}
                </section>

                <p className="border-t border-maroon/10 pt-3 text-[0.6rem] text-ink-soft/55">
                  {t.source}: {sourceLabel(selected.source, language)} · {t.allTimes}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PanchangStat({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-cream/10 bg-cream/5 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[0.55rem] font-semibold tracking-[0.16em] text-gold/80 uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 truncate font-serif text-[1.05rem] text-cream">{value}</p>
      {note ? <p className="mt-0.5 truncate text-[0.58rem] text-cream/45">{note}</p> : null}
    </div>
  );
}

function DetailTile({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-maroon/10 bg-white p-3">
      <p className="flex items-center gap-1.5 text-[0.55rem] font-semibold tracking-[0.14em] text-maroon-soft/65 uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 truncate font-serif text-[0.98rem] text-maroon">{value}</p>
      {note ? <p className="mt-0.5 truncate text-[0.58rem] text-ink-soft/60">{note}</p> : null}
    </div>
  );
}
