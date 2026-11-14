import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { AshramEvent } from "@/lib/events";
import { formatEventDateRange } from "@/lib/events";
import { getMembers, type Member } from "@/lib/members";
import { isCloudflareRuntime } from "@/lib/storage";
import { maskPhone, normalizePhone } from "@/lib/phone";
import { site } from "@/lib/site";

export type MessageChannel = "sms" | "whatsapp";

export interface DeliveryResult {
  channel: MessageChannel;
  ok: boolean;
  queued?: boolean;
  provider: "twilio" | "webhook" | "none";
  error?: string;
}

export interface ReceiptDelivery {
  sms: DeliveryResult;
  whatsapp: DeliveryResult;
}

const NOTIFICATION_LOG = path.join(
  process.cwd(),
  "data",
  "notification-log.ndjson",
);

function twilioSid(): string {
  return process.env.TWILIO_ACCOUNT_SID ?? "";
}

function twilioToken(): string {
  return process.env.TWILIO_AUTH_TOKEN ?? "";
}

function twilioFrom(channel: MessageChannel): string {
  const raw =
    channel === "sms"
      ? process.env.TWILIO_SMS_FROM
      : process.env.TWILIO_WHATSAPP_FROM;
  if (!raw) return "";
  return channel === "whatsapp" && !raw.startsWith("whatsapp:")
    ? `whatsapp:${raw}`
    : raw;
}

export function isTwilioConfigured(): boolean {
  return Boolean(
    twilioSid() &&
      twilioToken() &&
      process.env.TWILIO_SMS_FROM &&
      process.env.TWILIO_WHATSAPP_FROM,
  );
}

export function isNotificationWebhookConfigured(): boolean {
  return Boolean(process.env.NOTIFICATION_WEBHOOK_URL);
}

export function isMessagingConfigured(): boolean {
  return isTwilioConfigured() || isNotificationWebhookConfigured();
}

export function messagingProviderLabel(): string {
  if (isTwilioConfigured()) return "Twilio SMS + WhatsApp";
  if (isNotificationWebhookConfigured()) return "Notification webhook";
  return "Not configured";
}

export type SubmissionKind = "contact" | "book-order" | "donation";

const SUBMISSION_SUBJECTS: Record<SubmissionKind, string> = {
  contact: "New message from the ashram website",
  "book-order": "New book order from the ashram website",
  donation: "New donation pledge from the ashram website",
};

const SUBMISSION_WEBHOOK_ENV: Record<SubmissionKind, readonly string[]> = {
  contact: ["CONTACT_WEBHOOK_URL", "NOTIFICATION_WEBHOOK_URL"],
  "book-order": [
    "BOOK_ORDER_WEBHOOK_URL",
    "CONTACT_WEBHOOK_URL",
    "NOTIFICATION_WEBHOOK_URL",
  ],
  donation: [
    "DONATION_WEBHOOK_URL",
    "CONTACT_WEBHOOK_URL",
    "NOTIFICATION_WEBHOOK_URL",
  ],
};

function submissionWebhook(kind: SubmissionKind): string {
  for (const name of SUBMISSION_WEBHOOK_ENV[kind]) {
    const value = process.env[name];
    if (value) return value;
  }
  return "";
}

function field(entry: Record<string, unknown>, key: string): string {
  const value = entry[key];
  return typeof value === "string" ? value.trim() : "";
}

function submissionSummary(
  kind: SubmissionKind,
  entry: Record<string, unknown>,
): string {
  const name = field(entry, "name");
  const contact = field(entry, "phone") || field(entry, "email");

  if (kind === "contact") {
    return [name, contact, field(entry, "subject")].filter(Boolean).join(" \u00b7 ");
  }

  if (kind === "book-order") {
    return [name, field(entry, "bookTitle"), contact]
      .filter(Boolean)
      .join(" \u00b7 ");
  }

  const amount = typeof entry.amount === "number" ? `\u20b9${entry.amount}` : "";
  return [name, field(entry, "designation"), amount, contact]
    .filter(Boolean)
    .join(" \u00b7 ");
}

export function isSubmissionAlertConfigured(kind: SubmissionKind): boolean {
  return Boolean(submissionWebhook(kind));
}

/**
 * Alerts the ashram office about a form submission.
 *
 * The payload is flat and human readable on purpose: any webhook receiver
 * (Zapier, Make, n8n or a Google Apps Script) can forward `alertSubject` and
 * `text` as an email without mapping individual fields first.
 */
export async function notifySubmission(
  kind: SubmissionKind,
  entry: Record<string, unknown>,
): Promise<{ sent: boolean; configured: boolean }> {
  const url = submissionWebhook(kind);
  const alertSubject = SUBMISSION_SUBJECTS[kind];
  const summary = submissionSummary(kind, entry);

  if (!url) {
    await logNotification({
      type: `${kind}-received`,
      status: "webhook-not-configured",
      alertSubject,
      summary,
      reference: field(entry, "reference"),
    });
    return { sent: false, configured: false };
  }

  const sent = await postWebhook(url, {
    ...entry,
    type: kind,
    alertSubject,
    summary,
    text: `${alertSubject}\n${summary}`,
  });

  return { sent, configured: true };
}

async function logNotification(payload: Record<string, unknown>) {
  // Workers only has an ephemeral filesystem, so send this to the log stream.
  if (isCloudflareRuntime()) {
    console.info("Notifications:", JSON.stringify(payload));
    return;
  }

  try {
    await mkdir(path.dirname(NOTIFICATION_LOG), { recursive: true });
    await appendFile(
      NOTIFICATION_LOG,
      `${JSON.stringify({ at: new Date().toISOString(), ...payload })}\n`,
      "utf8",
    );
  } catch (error) {
    console.error("Notifications: could not write local log", error);
  }
}

async function postWebhook(
  url: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: site.shortName, ...payload }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`Notifications: webhook returned ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error("Notifications: webhook delivery failed", error);
    return false;
  }
}

async function sendTwilio(
  channel: MessageChannel,
  to: string,
  body: string,
): Promise<DeliveryResult> {
  const from = twilioFrom(channel);
  const sid = twilioSid();
  const token = twilioToken();

  if (!from || !sid || !token) {
    return {
      channel,
      ok: false,
      provider: "twilio",
      error: "The messaging provider is not fully configured.",
    };
  }

  const form = new URLSearchParams({
    To: channel === "whatsapp" ? `whatsapp:${to}` : to,
    From: from,
    Body: body,
  });

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString(
            "base64",
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form,
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(`Notifications: Twilio ${channel} returned ${response.status}`);
      return {
        channel,
        ok: false,
        provider: "twilio",
        error: "The messaging provider rejected this message.",
      };
    }

    return { channel, ok: true, provider: "twilio" };
  } catch (error) {
    console.error(`Notifications: Twilio ${channel} request failed`, error);
    return {
      channel,
      ok: false,
      provider: "twilio",
      error: "The messaging provider could not be reached.",
    };
  }
}

export async function sendMessage(
  channel: MessageChannel,
  recipient: string,
  body: string,
  meta: Record<string, unknown> = {},
): Promise<DeliveryResult> {
  const to = normalizePhone(recipient);
  if (!to) {
    return {
      channel,
      ok: false,
      provider: "none",
      error: "A valid phone number is required.",
    };
  }

  if (isTwilioConfigured()) {
    return sendTwilio(channel, to, body);
  }

  if (isNotificationWebhookConfigured()) {
    const ok = await postWebhook(process.env.NOTIFICATION_WEBHOOK_URL ?? "", {
      type: "message",
      channel,
      to,
      body,
      ...meta,
    });
    return {
      channel,
      ok,
      queued: ok,
      provider: "webhook",
      ...(ok ? {} : { error: "The notification webhook could not be reached." }),
    };
  }

  await logNotification({
    type: "message",
    channel,
    to: maskPhone(to),
    body,
    status: "not-configured",
    ...meta,
  });

  return {
    channel,
    ok: false,
    provider: "none",
    error: "SMS and WhatsApp delivery are not configured yet.",
  };
}

export async function sendDonationReceipt(input: {
  name: string;
  phone: string;
  amount: number;
  designation: string;
  reference: string;
}): Promise<ReceiptDelivery> {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(input.amount);

  const message = [
    `Hari Om ${input.name},`,
    `Your offering of ${amount} towards ${input.designation} is recorded.`,
    `Reference: ${input.reference}.`,
    "The ashram office will acknowledge your gift once the transfer is received.",
    `— ${site.shortName}`,
  ].join(" ");

  const [sms, whatsapp] = await Promise.all([
    sendMessage("sms", input.phone, message, {
      type: "donation-receipt",
      reference: input.reference,
    }),
    sendMessage("whatsapp", input.phone, message, {
      type: "donation-receipt",
      reference: input.reference,
    }),
  ]);

  return { sms, whatsapp };
}

export async function sendMemberWelcome(member: Member): Promise<ReceiptDelivery> {
  const message = [
    `Hari Om ${member.name},`,
    "you are now subscribed to event and satsang updates from the ashram.",
    `We will message you here when a new gathering is announced.`,
    `— ${site.shortName}`,
  ].join(" ");

  const [sms, whatsapp] = await Promise.all([
    sendMessage("sms", member.phone, message, { type: "member-welcome" }),
    sendMessage("whatsapp", member.phone, message, { type: "member-welcome" }),
  ]);

  return { sms, whatsapp };
}

export interface EventBroadcastResult {
  members: number;
  sent: number;
  failed: number;
  queued: boolean;
  provider: "twilio" | "webhook" | "none";
}

export async function notifyEventPublished(
  event: AshramEvent,
): Promise<EventBroadcastResult> {
  const members = await getMembers();
  const link = `${site.url}/events#${event.slug}`;
  const message = [
    `New at ${site.shortName}:`,
    `${event.title} — ${formatEventDateRange(event)} at ${event.location}.`,
    `Details: ${link}`,
    "Reply STOP to opt out.",
  ].join(" ");

  if (members.length > 0 && isTwilioConfigured()) {
    let sent = 0;
    let failed = 0;
    const list = members.slice(0, 100);

    for (const member of list) {
      const results = await Promise.all([
        sendMessage("sms", member.phone, message, {
          type: "event-published",
          eventId: event.id,
        }),
        sendMessage("whatsapp", member.phone, message, {
          type: "event-published",
          eventId: event.id,
        }),
      ]);
      if (results.some((result) => result.ok)) sent += 1;
      else failed += 1;
    }

    return {
      members: list.length,
      sent,
      failed,
      queued: false,
      provider: "twilio",
    };
  }

  if (isNotificationWebhookConfigured()) {
    const ok = await postWebhook(process.env.NOTIFICATION_WEBHOOK_URL ?? "", {
      type: "event-published",
      audience: "members",
      event,
      message,
      members: members.length,
    });
    return {
      members: members.length,
      sent: 0,
      failed: 0,
      queued: ok,
      provider: "webhook",
    };
  }

  await logNotification({
    type: "event-published",
    audience: "members",
    eventId: event.id,
    title: event.title,
    status: "not-configured",
  });

  return {
    members: members.length,
    sent: 0,
    failed: 0,
    queued: false,
    provider: "none",
  };
}
