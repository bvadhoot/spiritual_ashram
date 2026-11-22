import { randomUUID } from "node:crypto";
import { normalizePhone } from "@/lib/phone";
import { readPrivateJson, writePrivateJson } from "@/lib/storage";

const RECIPIENTS_FILE = "alert-recipients.json";

/** How the office wants to receive alerts for a given number. */
export type AlertChannel = "sms" | "whatsapp" | "both";

export const ALERT_CHANNELS: AlertChannel[] = ["sms", "whatsapp", "both"];

export interface AlertRecipient {
  id: string;
  /** A label such as "Ashram office" or "Guruji's sevak". */
  name: string;
  /** Stored in compact E.164 form, e.g. +919876543210. */
  phone: string;
  channel: AlertChannel;
  active: boolean;
  createdAt: string;
}

export interface AlertRecipientInput {
  name: string;
  phone: string;
  channel: AlertChannel;
}

function cleanName(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

async function readAll(): Promise<AlertRecipient[]> {
  const stored = await readPrivateJson<AlertRecipient[]>(RECIPIENTS_FILE, []);
  return stored
    .filter((item) => item && typeof item.phone === "string")
    .map((item) => ({
      ...item,
      phone: normalizePhone(item.phone),
      channel: ALERT_CHANNELS.includes(item.channel) ? item.channel : "both",
      active: item.active !== false,
    }))
    .filter((item) => item.phone.length > 3);
}

/** Every number on the list, including paused ones — for the admin studio. */
export async function getAllAlertRecipients(): Promise<AlertRecipient[]> {
  return readAll();
}

/** Numbers that should receive alerts right now. */
export async function getActiveAlertRecipients(): Promise<AlertRecipient[]> {
  return (await readAll()).filter((recipient) => recipient.active);
}

export async function addAlertRecipient(
  input: AlertRecipientInput,
): Promise<AlertRecipient> {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new Error("A valid phone number is required.");

  const all = await readAll();
  const existing = all.find((item) => item.phone === phone);
  const now = new Date().toISOString();

  // Re-adding a number edits it rather than creating a duplicate.
  if (existing) {
    const updated: AlertRecipient = {
      ...existing,
      name: cleanName(input.name) || existing.name,
      channel: input.channel,
      active: true,
    };
    await writePrivateJson(
      RECIPIENTS_FILE,
      all.map((item) => (item.id === existing.id ? updated : item)),
    );
    return updated;
  }

  const recipient: AlertRecipient = {
    id: randomUUID(),
    name: cleanName(input.name),
    phone,
    channel: input.channel,
    active: true,
    createdAt: now,
  };

  await writePrivateJson(RECIPIENTS_FILE, [...all, recipient]);
  return recipient;
}

export async function setAlertRecipientActive(
  id: string,
  active: boolean,
): Promise<boolean> {
  const all = await readAll();
  if (!all.some((item) => item.id === id)) return false;

  await writePrivateJson(
    RECIPIENTS_FILE,
    all.map((item) => (item.id === id ? { ...item, active } : item)),
  );
  return true;
}

export async function removeAlertRecipient(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((item) => item.id !== id);
  if (next.length === all.length) return false;

  await writePrivateJson(RECIPIENTS_FILE, next);
  return true;
}
