import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { validateAartiTrack } from "@/lib/admin-validation";
import { addStoredAartiTrack, deleteStoredAartiTrack } from "@/lib/aarti-store";
import { isSameOrigin } from "@/lib/rate-limit";
import { StorageNotConfiguredError } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

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
      { ok: false, error: "The request is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please send the song as JSON." },
      { status: 400 },
    );
  }

  const validation = validateAartiTrack(payload);
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

  try {
    await addStoredAartiTrack(validation.data);
    revalidatePath("/aarti");
    return NextResponse.json({ ok: true, track: validation.data });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("Admin aarti: storage failed", error);
    return NextResponse.json(
      { ok: false, error: "The song could not be saved right now." },
      { status: 500 },
    );
  }
}

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

  const videoId = new URL(request.url).searchParams.get("videoId") ?? "";
  if (!videoId) {
    return NextResponse.json(
      { ok: false, error: "Choose the song you want to remove." },
      { status: 400 },
    );
  }

  try {
    const removed = await deleteStoredAartiTrack(videoId);
    if (!removed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "That song belongs to the built-in playlist, so it cannot be removed here.",
        },
        { status: 404 },
      );
    }

    revalidatePath("/aarti");

    return NextResponse.json({ ok: true, videoId });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("Admin aarti: delete failed", error);
    return NextResponse.json(
      { ok: false, error: "The song could not be removed right now." },
      { status: 500 },
    );
  }
}
