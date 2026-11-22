import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { validateAlertRecipient } from "@/lib/admin-validation";
import {
  addAlertRecipient,
  removeAlertRecipient,
  setAlertRecipientActive,
} from "@/lib/alert-recipients";
import { isSameOrigin } from "@/lib/rate-limit";
import { StorageNotConfiguredError } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_000;

function storageFailure(error: unknown) {
  if (error instanceof StorageNotConfiguredError) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 503 },
    );
  }
  console.error("Admin recipients: storage failed", error);
  return NextResponse.json(
    { ok: false, error: "The alert list could not be saved right now." },
    { status: 500 },
  );
}

async function requireAdmin(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, error: "Please sign in to the admin studio." },
        { status: 401 },
      ),
    };
  }

  if (!isSameOrigin(request)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, error: "This request was blocked for security reasons." },
        { status: 403 },
      ),
    };
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, error: "The request is too large." },
        { status: 413 },
      ),
    };
  }

  return { ok: true as const, response: null };
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please send the number as JSON." },
      { status: 400 },
    );
  }

  const validation = validateAlertRecipient(payload);
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the number details.",
        errors: validation.errors,
      },
      { status: 422 },
    );
  }

  try {
    const recipient = await addAlertRecipient(validation.data);
    return NextResponse.json({ ok: true, recipient });
  } catch (error) {
    return storageFailure(error);
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please send the change as JSON." },
      { status: 400 },
    );
  }

  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const id = typeof record.id === "string" ? record.id : "";
  const active = record.active === true;

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Choose the number you want to change." },
      { status: 400 },
    );
  }

  try {
    const changed = await setAlertRecipientActive(id, active);
    if (!changed) {
      return NextResponse.json(
        { ok: false, error: "That number is no longer on the list." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, id, active });
  } catch (error) {
    return storageFailure(error);
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Choose the number you want to remove." },
      { status: 400 },
    );
  }

  try {
    const removed = await removeAlertRecipient(id);
    if (!removed) {
      return NextResponse.json(
        { ok: false, error: "That number is no longer on the list." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return storageFailure(error);
  }
}
