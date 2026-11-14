import { NextResponse } from "next/server";
import { validateContact, validateHoneypot } from "@/lib/validation";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/rate-limit";
import { createReference } from "@/lib/utils";
import { site } from "@/lib/site";
import { saveSubmission } from "@/lib/storage";
import { notifySubmission } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24_000;

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
      { ok: false, error: "The message is too large." },
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
    return NextResponse.json({ ok: true, reference: createReference("MSG") });
  }

  const validation = validateContact(payload);
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

  const limited = rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages have been sent. Please try again shortly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  const reference = createReference("MSG");
  const entry = {
    reference,
    receivedAt: new Date().toISOString(),
    ...validation.data,
  };

  const stored = await saveSubmission("contact", entry);

  const alert = await notifySubmission("contact", entry);
  const delivered = alert.sent;

  if (!stored && !delivered) {
    return NextResponse.json(
      {
        ok: false,
        error: `We could not send your message right now. Please email ${site.email} or call the ashram office.`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, reference });
}
