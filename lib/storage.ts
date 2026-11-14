import { get, list, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const PUBLIC_PREFIX = "ashram/public";
const PRIVATE_PREFIX = "ashram/private";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

type LocalScope = "public" | "private";

function localPath(filename: string, scope: LocalScope): string {
  return scope === "private"
    ? path.join(process.cwd(), "data", "private", filename)
    : path.join(process.cwd(), "data", filename);
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Persistent storage is not configured. Add BLOB_READ_WRITE_TOKEN to the Vercel project so uploaded images and events survive deployments.",
    );
    this.name = "StorageNotConfiguredError";
  }
}

export function hasBlobStorage(): boolean {
  return Boolean(BLOB_TOKEN);
}

export function storageMode(): "blob" | "local" | "unconfigured" {
  if (BLOB_TOKEN) return "blob";
  return process.env.VERCEL ? "unconfigured" : "local";
}

async function readLocal<T>(
  filename: string,
  fallback: T,
  scope: LocalScope = "public",
): Promise<T> {
  try {
    // Local development fallback only; production content uses Vercel Blob.
    const raw = await readFile(
      /* turbopackIgnore: true */ localPath(filename, scope),
      "utf8",
    );
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Storage: could not read ${filename}`, error);
    }
    return fallback;
  }
}

async function writeLocal<T>(
  filename: string,
  value: T,
  scope: LocalScope = "public",
): Promise<void> {
  if (process.env.VERCEL) throw new StorageNotConfiguredError();
  const directory =
    scope === "private"
      ? path.join(process.cwd(), "data", "private")
      : path.join(process.cwd(), "data");
  await mkdir(directory, { recursive: true });
  await writeFile(
    /* turbopackIgnore: true */ localPath(filename, scope),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
}

/** Public content such as events and gallery metadata. */
export async function readPublicJson<T>(
  filename: string,
  fallback: T,
): Promise<T> {
  if (!BLOB_TOKEN) return readLocal(filename, fallback);

  try {
    const { blobs } = await list({
      prefix: `${PUBLIC_PREFIX}/${filename}`,
      limit: 10,
      token: BLOB_TOKEN,
    });
    const blob = blobs.find(
      (item) => item.pathname === `${PUBLIC_PREFIX}/${filename}`,
    );
    if (!blob) return fallback;

    const response = await fetch(`${blob.url}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Storage: could not read ${filename}`, error);
    return fallback;
  }
}

export async function writePublicJson<T>(
  filename: string,
  value: T,
): Promise<void> {
  if (!BLOB_TOKEN) {
    await writeLocal(filename, value);
    return;
  }

  await put(`${PUBLIC_PREFIX}/${filename}`, JSON.stringify(value), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: BLOB_TOKEN,
  });
}

/**
 * Private content such as the opted-in member list. Never served from a public
 * URL; Vercel Blob private objects require the server token to read.
 */
export async function readPrivateJson<T>(
  filename: string,
  fallback: T,
): Promise<T> {
  if (!BLOB_TOKEN) return readLocal(filename, fallback, "private");

  try {
    const result = await get(`${PRIVATE_PREFIX}/${filename}`, {
      access: "private",
      useCache: false,
      token: BLOB_TOKEN,
    });
    if (!result || result.statusCode !== 200) return fallback;
    return (await new Response(result.stream).json()) as T;
  } catch (error) {
    console.error(`Storage: could not read private ${filename}`, error);
    return fallback;
  }
}

export async function writePrivateJson<T>(
  filename: string,
  value: T,
): Promise<void> {
  if (!BLOB_TOKEN) {
    await writeLocal(filename, value, "private");
    return;
  }

  await put(`${PRIVATE_PREFIX}/${filename}`, JSON.stringify(value), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: BLOB_TOKEN,
  });
}

/** Save an uploaded image and return its public URL. */
export async function saveUpload(file: File, filename: string): Promise<string> {
  if (BLOB_TOKEN) {
    const blob = await put(`ashram/uploads/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      cacheControlMaxAge: 31_536_000,
      token: BLOB_TOKEN,
    });
    return blob.url;
  }

  if (process.env.VERCEL) throw new StorageNotConfiguredError();

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/${filename}`;
}
