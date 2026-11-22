"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Music2, Trash2 } from "lucide-react";
import type { AartiTrack } from "@/lib/aarti";

export function AdminAartiList({ tracks }: { tracks: AartiTrack[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (tracks.length === 0) {
    return (
      <p className="py-8 text-center text-[0.8rem] text-ink-soft">
        No admin-added songs yet. Paste a YouTube link above to add the first
        aarti or bhajan.
      </p>
    );
  }

  async function remove(track: AartiTrack) {
    const confirmed = window.confirm(
      `Remove “${track.title}” from the aarti playlist? This cannot be undone.`,
    );
    if (!confirmed) return;

    setPending(track.videoId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/aarti?videoId=${encodeURIComponent(track.videoId)}`,
        { method: "DELETE" },
      );
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The song could not be removed.");
      }

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The song could not be removed.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      {error ? (
        <p
          role="alert"
          className="mt-3 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[0.72rem] text-red-800"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <ul className="divide-y divide-maroon/10">
        {tracks.map((track) => (
          <li key={track.videoId} className="flex items-center gap-3 py-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-maroon">
              <Music2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[0.98rem] text-maroon">
                {track.title}
              </p>
              <p className="mt-0.5 text-[0.68rem] text-ink-soft">
                {track.language} · {track.kind}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(track)}
              disabled={pending === track.videoId}
              aria-label={`Remove ${track.title} from the playlist`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-maroon/15 text-maroon/70 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
            >
              {pending === track.videoId ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
