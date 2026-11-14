import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { validateBookOrder, validateHoneypot } from "@/lib/validation";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/rate-limit";
import { createReference } from "@/lib/utils";
import { getBook } from "@/lib/books";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24_000;
const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "book-orders.ndjson");

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
    return NextResponse.json({ ok: true, reference: createReference("BOOK") });
  }

  const validation = validateBookOrder(payload);
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

  const limited = rateLimit(`book-order:${clientIp(request)}`, 5, 10 * 60 * 1000);
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

  const reference = createReference("BOOK");
  const book = getBook(validation.data.book);
  const entry = {
    reference,
    receivedAt: new Date().toISOString(),
    status: "awaiting-confirmation",
    bookSlug: validation.data.book,
    bookTitle: book?.title ?? validation.data.book,
    ...validation.data,
  };

  let stored = false;
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(FILE_PATH, `${JSON.stringify(entry)}\n`, "utf8");
    stored = true;
  } catch (error) {
    console.error("Book order: local storage failed", error);
  }

  let delivered = false;
  const webhook =
    process.env.BOOK_ORDER_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: site.shortName,
          type: "book-order",
          ...entry,
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
      delivered = response.ok;
      if (!response.ok) {
        console.error(`Book order: webhook returned ${response.status}`);
      }
    } catch (error) {
      console.error("Book order: webhook delivery failed", error);
    }
  }

  if (!stored && !delivered) {
    return NextResponse.json(
      {
        ok: false,
        error: `We could not send your request right now. Please email ${site.email} or call the ashram office.`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, reference });
}
