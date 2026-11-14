import { NextResponse } from "next/server";
import {
  adminCookie,
  createAdminSession,
  isAdminConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "This request was blocked for security reasons." },
      { status: 403 },
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Admin access is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET to the deployment environment.",
      },
      { status: 503 },
    );
  }

  const limited = rateLimit(`admin-login:${clientIp(request)}`, 6, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many sign-in attempts. Please wait a few minutes and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please send the sign-in form as JSON." },
      { status: 400 },
    );
  }

  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const email = typeof record.email === "string" ? record.email : "";
  const password = typeof record.password === "string" ? record.password : "";

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json(
      { ok: false, error: "The email or password is incorrect." },
      { status: 401 },
    );
  }

  const cookie = adminCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, createAdminSession(email), cookie.options);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
