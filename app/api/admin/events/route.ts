import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  slugifyEvent,
  validateAdminEvent,
} from "@/lib/admin-validation";
import {
  addStoredEvent,
  deleteStoredEvent,
  getAllEvents,
  getStoredEvents,
  updateStoredEvent,
  type AshramEvent,
} from "@/lib/events";
import { notifyEventPublished } from "@/lib/notifications";
import { isSameOrigin } from "@/lib/rate-limit";
import { StorageNotConfiguredError } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;

function storageFailure(error: unknown) {
  if (error instanceof StorageNotConfiguredError) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 503 },
    );
  }
  console.error("Admin event: storage failed", error);
  return NextResponse.json(
    { ok: false, error: "The event could not be saved right now." },
    { status: 500 },
  );
}

async function requireAdmin(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { ok: false, error: "Please sign in to the admin studio." },
        { status: 401 },
      ),
    };
  }

  if (!isSameOrigin(request)) {
    return {
      session: null,
      response: NextResponse.json(
        { ok: false, error: "This request was blocked for security reasons." },
        { status: 403 },
      ),
    };
  }

  return { session, response: null };
}

async function readPayload(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return {
      payload: null,
      response: NextResponse.json(
        { ok: false, error: "The event is too large." },
        { status: 413 },
      ),
    };
  }

  try {
    return { payload: (await request.json()) as unknown, response: null };
  } catch {
    return {
      payload: null,
      response: NextResponse.json(
        { ok: false, error: "Please send the event as JSON." },
        { status: 400 },
      ),
    };
  }
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response!;

  const { payload, response: bodyError } = await readPayload(request);
  if (bodyError) return bodyError;

  const validation = validateAdminEvent(payload);
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

  const data = validation.data;
  const existing = await getAllEvents();
  const baseSlug = slugifyEvent(data.title, data.date);
  let slug = baseSlug;
  let suffix = 2;
  while (existing.some((event) => event.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const event: AshramEvent = {
    id: randomUUID(),
    slug,
    date: data.date,
    endDate: data.endDate,
    title: data.title,
    location: data.location,
    description: data.description,
    category: data.category,
    image: data.image,
    imageAlt: data.image ? data.title : undefined,
  };

  try {
    await addStoredEvent(event);
  } catch (error) {
    return storageFailure(error);
  }

  revalidatePath("/events");
  revalidatePath("/");

  let broadcast = null;
  if (data.notify) {
    try {
      broadcast = await notifyEventPublished(event);
    } catch (error) {
      console.error("Admin event: member alert failed", error);
    }
  }

  return NextResponse.json({ ok: true, event, broadcast });
}

export async function PUT(request: Request) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response!;

  const { payload, response: bodyError } = await readPayload(request);
  if (bodyError) return bodyError;

  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const id = typeof record.id === "string" ? record.id : "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Choose the event you want to edit." },
      { status: 400 },
    );
  }

  const validation = validateAdminEvent(payload);
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

  const stored = await getStoredEvents();
  const previous = stored.find((event) => event.id === id);
  if (!previous) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Only events published from the admin studio can be edited here.",
      },
      { status: 404 },
    );
  }

  const data = validation.data;
  const updated: AshramEvent = {
    id: previous.id,
    slug: previous.slug,
    date: data.date,
    endDate: data.endDate,
    title: data.title,
    location: data.location,
    description: data.description,
    category: data.category,
    image: data.image,
    imageAlt: data.image ? data.title : undefined,
  };

  try {
    await updateStoredEvent(updated);
  } catch (error) {
    return storageFailure(error);
  }

  revalidatePath("/events");
  revalidatePath("/");

  return NextResponse.json({ ok: true, event: updated });
}

export async function DELETE(request: Request) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response!;

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Choose the event you want to delete." },
      { status: 400 },
    );
  }

  const stored = await getStoredEvents();
  if (!stored.some((event) => event.id === id)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Only events published from the admin studio can be deleted here.",
      },
      { status: 404 },
    );
  }

  try {
    await deleteStoredEvent(id);
  } catch (error) {
    return storageFailure(error);
  }

  revalidatePath("/events");
  revalidatePath("/");

  return NextResponse.json({ ok: true, id });
}
