import { NextResponse } from "next/server";
import { adminCookie } from "@/lib/admin-auth";
import { isSameOrigin } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "This request was blocked for security reasons." },
      { status: 403 },
    );
  }

  const cookie = adminCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, "", {
    ...cookie.options,
    maxAge: 0,
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
