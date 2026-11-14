import type { EventCategory } from "@/lib/events";
import type { GalleryCategory } from "@/lib/gallery";
import type { FieldErrors, ValidationResult } from "@/lib/validation";

export const ADMIN_EVENT_CATEGORIES: EventCategory[] = [
  "Satsang",
  "Sadhana",
  "Seva",
  "Festival",
];

export const ADMIN_GALLERY_CATEGORIES: GalleryCategory[] = [
  "Satsang",
  "Festivals",
  "Seva",
  "Ashram Life",
];

export interface AdminEventInput {
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  category: EventCategory;
  image?: string;
  notify: boolean;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function isValidCalendarDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())
  );
}

export function validateAdminEvent(
  input: unknown,
): ValidationResult<AdminEventInput> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const data: AdminEventInput = {
    title: text(record.title).slice(0, 120),
    date: text(record.date),
    endDate: text(record.endDate) || undefined,
    location: text(record.location).slice(0, 120),
    description: text(record.description).slice(0, 1200),
    category: text(record.category) as EventCategory,
    image: text(record.image).slice(0, 500) || undefined,
    notify: record.notify !== false,
  };

  const errors: FieldErrors<AdminEventInput> = {};

  if (data.title.length < 3) {
    errors.title = "Please enter an event title.";
  }
  if (!isValidCalendarDate(data.date)) {
    errors.date = "Please choose a valid event date.";
  }
  if (data.endDate) {
    if (!isValidCalendarDate(data.endDate)) {
      errors.endDate = "Please choose a valid end date.";
    } else if (data.endDate < data.date) {
      errors.endDate = "The end date cannot be before the start date.";
    }
  }
  if (data.location.length < 2) {
    errors.location = "Please enter the event location.";
  }
  if (data.description.length < 10) {
    errors.description = "Please write at least a short description.";
  }
  if (!ADMIN_EVENT_CATEGORIES.includes(data.category)) {
    errors.category = "Please choose an event category.";
  }
  if (
    data.image &&
    !data.image.startsWith("/") &&
    !data.image.startsWith("https://")
  ) {
    errors.image = "Please choose an image from the gallery.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export const ADMIN_FESTIVAL_CATEGORIES = [
  "Festival",
  "Ekadashi",
  "Purnima",
  "Amavasya",
  "Navratri",
  "Observance",
  "Lunar day",
];

export interface AdminFestivalInput {
  id: string;
  date: string;
  endDate?: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  category: string;
  major: boolean;
  hidden: boolean;
}

/**
 * Validates a calendar festival written in the admin studio. Telugu fields are
 * optional; the public calendar falls back to English when they are blank.
 */
export function validateAdminFestival(
  input: unknown,
): ValidationResult<AdminFestivalInput> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const data: AdminFestivalInput = {
    id: text(record.id).slice(0, 120),
    date: text(record.date),
    endDate: text(record.endDate) || undefined,
    name: text(record.name).slice(0, 120),
    nameTe: text(record.nameTe).slice(0, 160),
    description: text(record.description).slice(0, 800),
    descriptionTe: text(record.descriptionTe).slice(0, 900),
    category: text(record.category) || "Festival",
    major: record.major !== false,
    hidden: record.hidden === true,
  };

  const errors: FieldErrors<AdminFestivalInput> = {};

  if (data.name.length < 3) {
    errors.name = "Please enter the festival name.";
  }
  if (!isValidCalendarDate(data.date)) {
    errors.date = "Please choose a valid festival date.";
  }
  if (data.endDate) {
    if (!isValidCalendarDate(data.endDate)) {
      errors.endDate = "Please choose a valid end date.";
    } else if (data.endDate < data.date) {
      errors.endDate = "The end date cannot be before the start date.";
    }
  }
  if (data.description.length < 10) {
    errors.description = "Please add a short note on the festival.";
  }
  if (!ADMIN_FESTIVAL_CATEGORIES.includes(data.category)) {
    errors.category = "Please choose a festival category.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export interface AdminAartiInput {
  title: string;
  videoId: string;
  language: string;
  kind: string;
}

export function extractYouTubeId(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const id = url.searchParams.get("v");
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
      const parts = url.pathname.split("/").filter(Boolean);
      if (
        (parts[0] === "embed" || parts[0] === "shorts") &&
        parts[1] &&
        /^[A-Za-z0-9_-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function validateAartiTrack(
  input: unknown,
): ValidationResult<AdminAartiInput> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const videoId = extractYouTubeId(text(record.videoUrl));
  const data: AdminAartiInput = {
    title: text(record.title).slice(0, 140),
    videoId: videoId ?? "",
    language: text(record.language).slice(0, 40),
    kind: text(record.kind).slice(0, 40),
  };

  const errors: FieldErrors<AdminAartiInput> = {};

  if (data.title.length < 2) {
    errors.title = "Please enter the song title.";
  }
  if (!videoId) {
    errors.videoId = "Paste a valid YouTube video link or 11-character video ID.";
  }
  if (data.language.length < 2) {
    errors.language = "Please enter the language, for example Telugu.";
  }
  if (data.kind.length < 2) {
    errors.kind = "Please enter the kind, for example Aarti or Bhajan.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export interface GalleryMetaInput {
  caption: string;
  alt: string;
  category: GalleryCategory;
  featured: boolean;
}

export function validateGalleryMeta(
  input: unknown,
): ValidationResult<GalleryMetaInput> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const data: GalleryMetaInput = {
    caption: text(record.caption).slice(0, 120),
    alt: text(record.alt).slice(0, 240),
    category: text(record.category) as GalleryCategory,
    featured: record.featured === true || record.featured === "true",
  };

  const errors: FieldErrors<GalleryMetaInput> = {};

  if (data.caption.length < 3) {
    errors.caption = "Please add a short caption.";
  }
  if (data.alt.length < 8) {
    errors.alt = "Please describe the photograph for screen readers.";
  }
  if (!ADMIN_GALLERY_CATEGORIES.includes(data.category)) {
    errors.category = "Please choose a gallery category.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export function slugifyEvent(title: string, date: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70)
    .replace(/^-|-$/g, "");

  return `${base || "ashram-event"}-${date}`;
}
