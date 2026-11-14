"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Music2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  validateAartiTrack,
  type AdminAartiInput,
} from "@/lib/admin-validation";
import type { FieldErrors } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500";

const labelClass =
  "mb-1.5 block text-[0.66rem] font-semibold tracking-[0.1em] text-maroon uppercase";

export function AdminAartiForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    title: "",
    videoUrl: "",
    language: "Telugu",
    kind: "Aarti",
  });
  const [errors, setErrors] = useState<FieldErrors<AdminAartiInput>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validation = validateAartiTrack(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("saving");

    try {
      const response = await fetch("/api/admin/aarti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors<AdminAartiInput>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "The song could not be published.");
      }

      setStatus("success");
      setMessage(`${validation.data.title} is now on the Aarti page.`);
      setValues({ title: "", videoUrl: "", language: "Telugu", kind: "Aarti" });
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error
          ? caught.message
          : "The song could not be published.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start gap-3 border-b border-maroon/10 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-gold">
          <Music2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl">Add an aarti or bhajan</h2>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-soft">
            Paste a YouTube link. The song appears on the Aarti page immediately.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="admin-aarti-title" className={labelClass}>
            Song title <span className="text-maroon/45">*</span>
          </label>
          <input
            id="admin-aarti-title"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
            className={inputClass}
            placeholder="Om Jai Jagdish Hare"
          />
          {errors.title ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.title}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="admin-aarti-url" className={labelClass}>
            YouTube link or video ID <span className="text-maroon/45">*</span>
          </label>
          <input
            id="admin-aarti-url"
            value={values.videoUrl}
            onChange={(event) => update("videoUrl", event.target.value)}
            aria-invalid={Boolean(errors.videoId)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {errors.videoId ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.videoId}
            </p>
          ) : (
            <p className="mt-1 text-[0.65rem] text-ink-soft/55">
              Works with youtube.com, youtu.be and Shorts links.
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-aarti-language" className={labelClass}>
              Language
            </label>
            <input
              id="admin-aarti-language"
              value={values.language}
              onChange={(event) => update("language", event.target.value)}
              aria-invalid={Boolean(errors.language)}
              className={inputClass}
            />
            {errors.language ? (
              <p className="mt-1 text-xs text-red-700" role="alert">
                {errors.language}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="admin-aarti-kind" className={labelClass}>
              Kind
            </label>
            <input
              id="admin-aarti-kind"
              value={values.kind}
              onChange={(event) => update("kind", event.target.value)}
              aria-invalid={Boolean(errors.kind)}
              className={inputClass}
              placeholder="Aarti, Bhajan, Devotional song"
            />
            {errors.kind ? (
              <p className="mt-1 text-xs text-red-700" role="alert">
                {errors.kind}
              </p>
            ) : null}
          </div>
        </div>

        {message ? (
          <div
            role="status"
            className={`flex gap-2.5 rounded-xl border px-3.5 py-3 text-[0.75rem] leading-relaxed ${
              status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{message}</span>
          </div>
        ) : null}

        <Button type="submit" disabled={status === "saving"} className="w-full">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Publishing…
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add to the playlist
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
