import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { validateDonation, validateHoneypot } from "@/lib/validation";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/rate-limit";
import { createReference } from "@/lib/utils";
import { site } from "@/lib/site";
import { sendDonationReceipt } from "@/lib/notifications";
import { upsertMember } from "@/lib/members";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;
const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "donation-intents.ndjson");

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "This request was blocked for security reasons." },
      { status: 403 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "The request is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please send the form as JSON." },
      { status: 400 },
    );
  }

  // Silently accept honeypot submissions so bots do not learn they were caught.
  if (!validateHoneypot(payload)) {
    return NextResponse.json({ ok: true, reference: createReference("SEVA") });
  }

  const validation = validateDonation(payload);
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        errors: validation.errors,
      },
      { status: 422 },
    );
  }

  const limited = rateLimit(`donation:${clientIp(request)}`, 8, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests have been sent. Please try again shortly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  const reference = createReference("SEVA");
  const gift = validation.data;
  const entry = {
    reference,
    receivedAt: new Date().toISOString(),
    mode: "offline",
    status: "awaiting-transfer",
    ...gift,
  };

  let stored = false;
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(FILE_PATH, `${JSON.stringify(entry)}\n`, "utf8");
    stored = true;
  } catch (error) {
    console.error("Donation request: local storage failed", error);
  }

  let delivered = false;
  const webhook =
    process.env.DONATION_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: site.shortName,
          type: "donation-intent",
          ...entry,
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
      delivered = response.ok;
      if (!response.ok) {
        console.error(`Donation request: webhook returned ${response.status}`);
      }
    } catch (error) {
      console.error("Donation request: webhook delivery failed", error);
    }
  }

  if (!stored && !delivered) {
    return NextResponse.json(
      {
        ok: false,
        error: `We could not record your offering right now. Please email ${site.email} or call the ashram office.`,
      },
      { status: 503 },
    );
  }

  const notifications = await sendDonationReceipt({
    name: gift.name,
    phone: gift.phone,
    amount: gift.amount,
    designation: gift.designation,
    reference,
  });

  let updatesEnrolled = false;
  if (gift.updatesOptIn) {
    try {
      await upsertMember({
        name: gift.name,
        phone: gift.phone,
        email: gift.email,
        source: "donation",
      });
      updatesEnrolled = true;
    } catch (error) {
      console.error("Donation request: member enrolment failed", error);
    }
  }

  return NextResponse.json({
    ok: true,
    reference,
    mode: "offline",
    notifications,
    updatesEnrolled,
  });
}
