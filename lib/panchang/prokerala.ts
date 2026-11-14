import { DateTime } from "luxon";
import {
  ASHRAM_LATITUDE,
  ASHRAM_LONGITUDE,
  IST,
  calculatePanchang,
} from "./calculate";
import type { PanchangDay } from "./types";

const TOKEN_URL = "https://api.prokerala.com/token";
const PANCHANG_URL = "https://api.prokerala.com/v2/astrology/panchang";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

let tokenCache: { value: string; expiresAt: number } | null = null;
const panchangCache = new Map<
  string,
  { value: PanchangDay; expiresAt: number }
>();

type RecordLike = Record<string, unknown>;

function asRecord(value: unknown): RecordLike {
  return typeof value === "object" && value !== null
    ? (value as RecordLike)
    : {};
}

function first(value: unknown): RecordLike {
  if (Array.isArray(value)) return asRecord(value[0]);
  return asRecord(value);
}

function stringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  const record = asRecord(value);
  return stringValue(record.name) ?? stringValue(record.display_name);
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function timeLabel(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const parsed = DateTime.fromISO(value, { zone: IST });
  if (parsed.isValid) return parsed.toFormat("h:mm a");
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return fallback;
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.value;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Prokerala token request returned ${response.status}`);
  }

  const json = (await response.json()) as RecordLike;
  const token = stringValue(json.access_token);
  if (!token) throw new Error("Prokerala token response did not contain a token");
  const expiresIn = numberValue(json.expires_in) ?? 3600;
  tokenCache = {
    value: token,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
  };
  return token;
}

export function hasProkeralaCredentials(): boolean {
  return Boolean(
    process.env.PROKERALA_CLIENT_ID && process.env.PROKERALA_CLIENT_SECRET,
  );
}

export async function getProkeralaPanchang(
  date: string,
): Promise<PanchangDay | null> {
  if (!hasProkeralaCredentials()) return null;

  const cached = panchangCache.get(date);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const token = await getAccessToken();
    if (!token) return null;

    const datetime = `${date}T12:00:00+05:30`;
    const url = new URL(PANCHANG_URL);
    url.searchParams.set("datetime", datetime);
    url.searchParams.set(
      "coordinates",
      `${ASHRAM_LATITUDE},${ASHRAM_LONGITUDE}`,
    );
    url.searchParams.set("ayanamsa", "1");
    url.searchParams.set("timezone", IST);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      throw new Error(`Prokerala panchang returned ${response.status}`);
    }

    const json = (await response.json()) as RecordLike;
    const data = asRecord(json.data);
    if (!data || Object.keys(data).length === 0) return null;

    const calculated = calculatePanchang(date);
    const tithiRaw = first(data.tithi);
    const nakshatraRaw = first(data.nakshatra);
    const sunSign =
      stringValue(data.sun_sign) ??
      stringValue(data.sunSign) ??
      stringValue(data.sun_rashi);
    const moonSign =
      stringValue(data.moon_sign) ??
      stringValue(data.moonSign) ??
      stringValue(data.moon_rashi);

    const parsed: PanchangDay = {
      ...calculated,
      rashi: sunSign ? { ...calculated.rashi, name: sunSign } : calculated.rashi,
      moonRashi: moonSign
        ? { ...calculated.moonRashi, name: moonSign }
        : calculated.moonRashi,
      nakshatra: {
        ...calculated.nakshatra,
        name: stringValue(nakshatraRaw.name) ?? calculated.nakshatra.name,
      },
      tithi: {
        ...calculated.tithi,
        paksha: (stringValue(tithiRaw.paksha)?.toLowerCase() === "krishna"
          ? "Krishna"
          : calculated.tithi.paksha) as "Shukla" | "Krishna",
      },
      sunrise: timeLabel(data.sunrise, calculated.sunrise),
      sunset: timeLabel(data.sunset, calculated.sunset),
      source: "prokerala",
    };

    panchangCache.set(date, {
      value: parsed,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return parsed;
  } catch (error) {
    console.error("Prokerala panchang unavailable; using calculated fallback", error);
    return null;
  }
}
