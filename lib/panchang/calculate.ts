import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";
import {
  nakshatraLabel,
  rashiInfo,
  tithiLabel,
} from "./names";
import type { Paksha, PanchangDay } from "./types";

export const IST = "Asia/Kolkata";

/** Approximate coordinates of Mallayyagiri / Jharasangam, Telangana. */
export const ASHRAM_LATITUDE = 18.0;
export const ASHRAM_LONGITUDE = 77.7;

export function indiaDate(date = new Date()): string {
  return (
    DateTime.fromJSDate(date, { zone: IST }).toISODate() ??
    DateTime.now().setZone(IST).toISODate()!
  );
}

export function isDateKey(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    DateTime.fromISO(value, { zone: IST }).isValid
  );
}

export function isMonthKey(value: string): boolean {
  return (
    /^\d{4}-\d{2}$/.test(value) &&
    DateTime.fromISO(`${value}-01`, { zone: IST }).isValid
  );
}

export function dateTimeFor(date: string): DateTime {
  return DateTime.fromISO(date, { zone: IST }).startOf("day");
}

function formatTime(value: DateTime): string {
  return value.toFormat("h:mm a");
}

function fallbackSunrise(day: DateTime): DateTime {
  return day.set({ hour: 6, minute: 0, second: 0, millisecond: 0 });
}

function fallbackSunset(day: DateTime): DateTime {
  return day.set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
}

function separation(longitude: number, reference: number): number {
  return ((longitude - reference) % 360 + 360) % 360;
}

/**
 * Sidereal (Lahiri-style) ayanamsa approximation. The external provider is
 * preferred for production; this keeps the calendar useful without a key.
 */
function approxAyanamsa(year: number): number {
  const fraction = (year - 2000) / 4;
  return 23.85 + 0.013972 * (year - 2000) + 0.0000001 * fraction;
}

export function calculatePanchang(date: string): PanchangDay {
  const day = dateTimeFor(date);
  const noon = day.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

  const sun = Astronomy.SunPosition(noon.toJSDate());
  const moon = Astronomy.EclipticGeoMoon(noon.toJSDate());
  const ayanamsa = approxAyanamsa(day.year);

  const tithiAngle = separation(moon.lon, sun.elon);
  const tithiIndex = Math.floor(tithiAngle / 12);
  const paksha: Paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiNumber = (tithiIndex % 15) + 1;
  const tithi = tithiLabel(tithiNumber, paksha);

  const siderealMoon = separation(moon.lon, ayanamsa);
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
  const nakshatra = nakshatraLabel(nakshatraIndex);
  const pada = Math.floor((siderealMoon % (360 / 27)) / (360 / 108)) + 1;

  const siderealSun = separation(sun.elon, ayanamsa);
  const rashi = rashiInfo(Math.floor(siderealSun / 30));
  const moonRashi = rashiInfo(Math.floor(siderealMoon / 30));

  const observer = new Astronomy.Observer(
    ASHRAM_LATITUDE,
    ASHRAM_LONGITUDE,
    0,
  );
  const rise = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    1,
    day.toJSDate(),
    1,
  );
  const set = rise
    ? Astronomy.SearchRiseSet(
        Astronomy.Body.Sun,
        observer,
        -1,
        rise.date,
        1,
      )
    : null;

  const sunrise = rise
    ? DateTime.fromJSDate(rise.date, { zone: IST })
    : fallbackSunrise(day);
  const sunset = set
    ? DateTime.fromJSDate(set.date, { zone: IST })
    : fallbackSunset(day);
  const daylightMinutes = Math.max(
    1,
    sunset.diff(sunrise, "minutes").minutes,
  );

  // Sunday=8, Monday=2, Tuesday=7, Wednesday=5, Thursday=6, Friday=4, Saturday=3.
  const rahuSegment = [1, 7, 5, 6, 4, 3, 8][day.weekday - 1];
  const rahuStart = sunrise.plus({
    minutes: (daylightMinutes / 8) * (rahuSegment - 1),
  });
  const rahuEnd = rahuStart.plus({ minutes: daylightMinutes / 8 });

  const solarNoon = sunrise.plus({ minutes: daylightMinutes / 2 });
  const abhijitStart = solarNoon.minus({ minutes: 24 });
  const abhijitEnd = solarNoon.plus({ minutes: 24 });

  return {
    date: day.toISODate()!,
    tithi: {
      number: tithiNumber,
      name: tithi.name,
      nameTe: tithi.nameTe,
      paksha,
      pakshaTe: tithi.pakshaTe,
    },
    nakshatra: {
      ...nakshatra,
      pada: Math.max(1, Math.min(4, pada)),
    },
    rashi,
    moonRashi,
    rahuKalam: `${formatTime(rahuStart)} – ${formatTime(rahuEnd)}`,
    abhijit: `${formatTime(abhijitStart)} – ${formatTime(abhijitEnd)}`,
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
    source: "calculated",
  };
}
