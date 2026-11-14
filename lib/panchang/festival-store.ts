import { randomUUID } from "node:crypto";
import { readPublicJson, writePublicJson } from "@/lib/storage";
import { FESTIVALS } from "./festivals";
import type { StoredFestival } from "./overrides";

const STORED_FESTIVALS_FILE = "panchang-festivals.json";

export async function getStoredFestivals(): Promise<StoredFestival[]> {
  return readPublicJson<StoredFestival[]>(STORED_FESTIVALS_FILE, []);
}

/** Upserts one override by id. */
export async function saveStoredFestival(item: StoredFestival): Promise<void> {
  const stored = await getStoredFestivals();
  const next = [item, ...stored.filter((row) => row.id !== item.id)];
  await writePublicJson(STORED_FESTIVALS_FILE, next);
}

export async function deleteStoredFestival(id: string): Promise<boolean> {
  const stored = await getStoredFestivals();
  const next = stored.filter((row) => row.id !== id);
  if (next.length === stored.length) return false;
  await writePublicJson(STORED_FESTIVALS_FILE, next);
  return true;
}

export function isBuiltInFestival(id: string): boolean {
  return FESTIVALS.some((item) => item.id === id);
}

export function builtInFestival(id: string) {
  return FESTIVALS.find((item) => item.id === id);
}

export function newFestivalId(): string {
  return `admin-${randomUUID()}`;
}
