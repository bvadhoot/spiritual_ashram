import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { site } from "@/lib/site";

const COOKIE_NAME = "ashram_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function adminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? site.email).trim().toLowerCase();
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

export function isAdminConfigured(): boolean {
  return Boolean(adminPassword() && sessionSecret());
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminCredentials(
  email: string,
  password: string,
): boolean {
  if (!isAdminConfigured()) return false;
  return (
    safeEqual(email.trim().toLowerCase(), adminEmail()) &&
    safeEqual(password, adminPassword())
  );
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createAdminSession(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      exp: Date.now() + SESSION_SECONDS * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export interface AdminSession {
  email: string;
  expiresAt: number;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isAdminConfigured()) return null;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { email?: unknown; exp?: unknown };

    if (
      typeof data.email !== "string" ||
      typeof data.exp !== "number" ||
      data.exp < Date.now()
    ) {
      return null;
    }

    return { email: data.email, expiresAt: data.exp };
  } catch {
    return null;
  }
}

export function adminCookie() {
  return {
    name: COOKIE_NAME,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_SECONDS,
    },
  };
}
