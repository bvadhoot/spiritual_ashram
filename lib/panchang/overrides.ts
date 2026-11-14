import { FESTIVALS } from "./festivals";
import type { Festival } from "./types";

/**
 * A festival edited in the admin studio. The reference dataset in
 * `festivals.ts` stays in code; stored records either override one of its
 * entries (same id), add an ashram observance, or hide a built-in festival.
 */
export interface StoredFestival {
  id: string;
  date: string;
  endDate?: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  category: string;
  major: boolean;
  hidden?: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export function toFestival(item: StoredFestival): Festival {
  return {
    id: item.id,
    date: item.date,
    endDate: item.endDate,
    name: item.name,
    // Telugu is optional in the admin form; fall back to English so the
    // Telugu view never renders an empty line.
    nameTe: item.nameTe || item.name,
    description: item.description,
    descriptionTe: item.descriptionTe || item.description,
    category: item.category || "Festival",
    major: item.major !== false,
  };
}

function byDate(a: Festival, b: Festival): number {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

/** Applies admin overrides over the reference dataset. Pure and safe for both
 * server and client bundles: it never touches storage. */
export function applyFestivalOverrides(
  base: Festival[],
  overrides: StoredFestival[],
): Festival[] {
  if (overrides.length === 0) return base;

  const byId = new Map(base.map((item) => [item.id, item]));
  for (const item of overrides) {
    if (item.hidden) {
      byId.delete(item.id);
      continue;
    }
    byId.set(item.id, toFestival(item));
  }

  return [...byId.values()].sort(byDate);
}

export type FestivalSource = "built-in" | "custom";

export interface AdminFestival extends Festival {
  hidden: boolean;
  source: FestivalSource;
}

/** The admin list for one month, including hidden festivals so they can be
 * restored. */
export function festivalAdminView(
  monthKey: string,
  overrides: StoredFestival[],
): AdminFestival[] {
  const inMonth = (date?: string) => Boolean(date && date.slice(0, 7) === monthKey);
  const storedById = new Map(overrides.map((item) => [item.id, item]));
  const result: AdminFestival[] = [];

  for (const base of FESTIVALS) {
    if (!inMonth(base.date) && !inMonth(base.endDate)) continue;
    const override = storedById.get(base.id);
    result.push(
      override
        ? { ...toFestival(override), hidden: Boolean(override.hidden), source: "built-in" }
        : { ...base, hidden: false, source: "built-in" },
    );
  }

  for (const item of overrides) {
    if (FESTIVALS.some((base) => base.id === item.id)) continue;
    if (!inMonth(item.date) && !inMonth(item.endDate)) continue;
    result.push({
      ...toFestival(item),
      hidden: Boolean(item.hidden),
      source: "custom",
    });
  }

  return result.sort(byDate);
}
