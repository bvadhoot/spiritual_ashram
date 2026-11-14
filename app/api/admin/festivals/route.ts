import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { validateAdminFestival } from "@/lib/admin-validation";
import {
  builtInFestival,
  deleteStoredFestival,
  getStoredFestivals,
  newFestivalId,
  saveStoredFestival,
} from "@/lib/panchang/festival-store";
import type { StoredFestival } from "@/lib/panchang/overrides";
import { isSameOrigin } from "@/lib/rate-limit";
import { StorageNotConfiguredError } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

function revalidateCalendar() {
  revalidatePath("/events");
  revalidatePath("/admin");
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Please sign in to the admin studio." },
      { status: 401 },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "This request was blocked for security reasons." },
      { status: 403 },
    );
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "The festival details are too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please send the festival as JSON." },
      { status: 400 },
    );
  }

  const validation = validateAdminFestival(payload);
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
  const festival: StoredFestival = {
    id: data.id || newFestivalId(),
    date: data.date,
    endDate: data.endDate,
    name: data.name,
    nameTe: data.nameTe,
    description: data.description,
    descriptionTe: data.descriptionTe,
    category: data.category,
    major: data.major,
    hidden: data.hidden,
    updatedAt: new Date().toISOString(),
    updatedBy: session.email,
  };

  try {
    await saveStoredFestival(festival);
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("Admin festival: storage failed", error);
    return NextResponse.json(
      { ok: false, error: "The festival could not be saved right now." },
      { status: 500 },
    );
  }

  revalidateCalendar();
  return NextResponse.json({ ok: true, festival });
}

/**
 * Removes a festival from the public calendar. Built-in festivals are hidden
 * with an override so the reference entry survives; admin-created ones are
 * deleted outright.
 */
export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Please sign in to the admin studio." },
      { status: 401 },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "This request was blocked for security reasons." },
      { status: 403 },
    );
  }

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Choose the festival you want to hide." },
      { status: 400 },
    );
  }

  const base = builtInFestival(id);

  try {
    if (!base) {
      const removed = await deleteStoredFestival(id);
      if (!removed) {
        return NextResponse.json(
          { ok: false, error: "That festival is no longer on the calendar." },
          { status: 404 },
        );
      }
      revalidateCalendar();
      return NextResponse.json({ ok: true, mode: "deleted" });
    }

    const stored = await getStoredFestivals();
    const previous = stored.find((item) => item.id === id);
    const hidden: StoredFestival = {
      id,
      date: previous?.date ?? base.date,
      endDate: previous?.endDate ?? base.endDate,
      name: previous?.name ?? base.name,
      nameTe: previous?.nameTe ?? base.nameTe,
      description: previous?.description ?? base.description,
      descriptionTe: previous?.descriptionTe ?? base.descriptionTe,
      category: previous?.category ?? base.category,
      major: previous?.major ?? base.major,
      hidden: true,
      updatedAt: new Date().toISOString(),
      updatedBy: session.email,
    };
    await saveStoredFestival(hidden);
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("Admin festival: storage failed", error);
    return NextResponse.json(
      { ok: false, error: "The festival could not be updated right now." },
      { status: 500 },
    );
  }

  revalidateCalendar();
  return NextResponse.json({ ok: true, mode: "hidden" });
}
