import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { validateGalleryMeta } from "@/lib/admin-validation";
import type { GalleryImage } from "@/lib/gallery";
import { addStoredGalleryImage } from "@/lib/gallery-store";
import { isSameOrigin } from "@/lib/rate-limit";
import {
  saveUpload,
  StorageNotConfiguredError,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

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

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "The photograph is too large. Please choose one under 4 MB." },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please upload the photograph as a form." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Please choose a photograph to upload." },
      { status: 422 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "The photograph is larger than 4 MB." },
      { status: 413 },
    );
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please use a JPEG, PNG or WebP photograph.",
      },
      { status: 422 },
    );
  }

  const validation = validateGalleryMeta({
    caption: form.get("caption"),
    alt: form.get("alt"),
    category: form.get("category"),
    featured: form.get("featured"),
  });
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the photograph details.",
        errors: validation.errors,
      },
      { status: 422 },
    );
  }

  const filename = `gallery-${Date.now()}-${randomUUID()
    .slice(0, 8)
    .toLowerCase()}.${extension}`;

  try {
    const src = await saveUpload(file, filename);
    const image: GalleryImage = {
      id: randomUUID(),
      src,
      alt: validation.data.alt,
      caption: validation.data.caption,
      category: validation.data.category,
      featured: validation.data.featured,
    };

    await addStoredGalleryImage(image);
    revalidatePath("/gallery");
    revalidatePath("/");

    return NextResponse.json({ ok: true, image });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("Admin gallery: upload failed", error);
    return NextResponse.json(
      { ok: false, error: "The photograph could not be saved right now." },
      { status: 500 },
    );
  }
}
