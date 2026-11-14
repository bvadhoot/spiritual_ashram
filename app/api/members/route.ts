import { NextResponse } from "next/server";
import { upsertMember } from "@/lib/members";
import { sendMemberWelcome } from "@/lib/notifications";
import {
  clientIp,
  isSameOrigin,
  rateLimit,
} from "@/lib/rate-limit";
import { StorageNotConfiguredError } from "@/lib/storage";
import {
  validateHoneypot,
  validateMemberSignup,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;

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

  if (!validateHoneypot(payload)) {
    return NextResponse.json({ ok: true });
  }

  const validation = validateMemberSignup(payload);
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

  const limited = rateLimit(`member:${clientIp(request)}`, 5, 10 * 60 * 1000);
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

  try {
    const member = await upsertMember({
      name: validation.data.name,
      phone: validation.data.phone,
      email: validation.data.email,
      source: "signup",
    });
    const notifications = await sendMemberWelcome(member);

    return NextResponse.json({ ok: true, notifications });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("Member signup: storage failed", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Updates could not be saved right now. Please try again or contact the ashram office.",
      },
      { status: 500 },
    );
  }
}
