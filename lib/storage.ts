import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");
const PUBLIC_PREFIX = "ashram/public";
const PRIVATE_PREFIX = "ashram/private";
const UPLOAD_PREFIX = "ashram/uploads";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Private bucket: JSON records, including the opted-in member list. */
const DATA_BINDING = "ASHRAM_DATA";
/** Public bucket: uploaded photographs, served from R2_PUBLIC_URL. */
const MEDIA_BINDING = "ASHRAM_MEDIA";

type LocalScope = "public" | "private";

type R2ObjectLike = {
  json<T>(): Promise<T>;
};

type R2BucketLike = {
  put(
    key: string,
    value: string | ArrayBuffer | Uint8Array,
    options?: {
      httpMetadata?: { contentType?: string; cacheControl?: string };
    },
  ): Promise<unknown>;
  get(key: string): Promise<R2ObjectLike | null>;
};

/**
 * Detects the Cloudflare Workers runtime. `process.env.VERCEL` is not enough:
 * on Workers it is undefined, so a Vercel-only guard would let writes fall
 * through to the in-memory filesystem and disappear after the request.
 */
export function isCloudflareRuntime(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}

let dataBucket: R2BucketLike | null = null;
let mediaBucket: R2BucketLike | null = null;

async function resolveBinding(name: string): Promise<R2BucketLike | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    const env = context?.env as Record<string, unknown> | undefined;
    const binding = env?.[name];
    return (binding as R2BucketLike | undefined) ?? null;
  } catch {
    // Not running on Workers, or the binding is not configured yet.
    return null;
  }
}

async function dataStore(): Promise<R2BucketLike | null> {
  if (dataBucket) return dataBucket;
  const found = await resolveBinding(DATA_BINDING);
  if (found) dataBucket = found;
  return found;
}

async function mediaStore(): Promise<R2BucketLike | null> {
  if (mediaBucket) return mediaBucket;
  const found = await resolveBinding(MEDIA_BINDING);
  if (found) mediaBucket = found;
  return found;
}

function localPath(filename: string, scope: LocalScope): string {
  return scope === "private"
    ? path.join(process.cwd(), "data", "private", filename)
    : path.join(process.cwd(), "data", filename);
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      isCloudflareRuntime()
        ? "Persistent storage is not configured. Bind an R2 bucket to ASHRAM_DATA in wrangler.jsonc so events, festivals and the member list survive deployments."
        : "Persistent storage is not configured. Add BLOB_READ_WRITE_TOKEN to the Vercel project so uploaded images and events survive deployments.",
    );
    this.name = "StorageNotConfiguredError";
  }
}

export function hasBlobStorage(): boolean {
  return Boolean(BLOB_TOKEN);
}

export function storageMode(): "r2" | "blob" | "local" | "unconfigured" {
  if (isCloudflareRuntime()) return "r2";
  if (BLOB_TOKEN) return "blob";
  return process.env.VERCEL ? "unconfigured" : "local";
}

/** True when the runtime has no durable filesystem. */
function isEphemeralRuntime(): boolean {
  return Boolean(process.env.VERCEL) || isCloudflareRuntime();
}

async function readLocal<T>(
  filename: string,
  fallback: T,
  scope: LocalScope = "public",
): Promise<T> {
  try {
    // Local development fallback only; production content uses R2 or Vercel Blob.
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
  if (isEphemeralRuntime()) throw new StorageNotConfiguredError();
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
  const bucket = await dataStore();
  if (bucket) {
    try {
      const object = await bucket.get(`${PUBLIC_PREFIX}/${filename}`);
      if (!object) return fallback;
      return await object.json<T>();
    } catch (error) {
      console.error(`Storage: could not read ${filename} from R2`, error);
      return fallback;
    }
  }

  if (!BLOB_TOKEN) return readLocal(filename, fallback);

  try {
    const { list } = await import("@vercel/blob");
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
  const bucket = await dataStore();
  if (bucket) {
    await bucket.put(
      `${PUBLIC_PREFIX}/${filename}`,
      JSON.stringify(value),
      {
        httpMetadata: {
          contentType: "application/json",
          cacheControl: "public, max-age=60",
        },
      },
    );
    return;
  }

  if (isCloudflareRuntime()) throw new StorageNotConfiguredError();

  if (!BLOB_TOKEN) {
    await writeLocal(filename, value);
    return;
  }

  const { put } = await import("@vercel/blob");
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
 * URL: the ASHRAM_DATA bucket has no public access enabled.
 */
export async function readPrivateJson<T>(
  filename: string,
  fallback: T,
): Promise<T> {
  const bucket = await dataStore();
  if (bucket) {
    try {
      const object = await bucket.get(`${PRIVATE_PREFIX}/${filename}`);
      if (!object) return fallback;
      return await object.json<T>();
    } catch (error) {
      console.error(`Storage: could not read private ${filename}`, error);
      return fallback;
    }
  }

  if (!BLOB_TOKEN) return readLocal(filename, fallback, "private");

  try {
    const { get } = await import("@vercel/blob");
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
  const bucket = await dataStore();
  if (bucket) {
    await bucket.put(
      `${PRIVATE_PREFIX}/${filename}`,
      JSON.stringify(value),
      {
        httpMetadata: {
          contentType: "application/json",
          cacheControl: "no-store",
        },
      },
    );
    return;
  }

  if (isCloudflareRuntime()) throw new StorageNotConfiguredError();

  if (!BLOB_TOKEN) {
    await writeLocal(filename, value, "private");
    return;
  }

  const { put } = await import("@vercel/blob");
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
  const bucket = await mediaStore();
  if (bucket) {
    if (!R2_PUBLIC_URL) {
      throw new Error(
        "Upload storage is not configured. Set R2_PUBLIC_URL to the public domain of the ASHRAM_MEDIA bucket.",
      );
    }
    await bucket.put(`${UPLOAD_PREFIX}/${filename}`, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });
    return `${R2_PUBLIC_URL}/${UPLOAD_PREFIX}/${filename}`;
  }

  if (isCloudflareRuntime()) throw new StorageNotConfiguredError();

  if (BLOB_TOKEN) {
    const { put } = await import("@vercel/blob");
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
