"use client";

import { useState } from "react";
import { ExternalLink, ListMusic, Play } from "lucide-react";
import { type AartiTrack, youtubeChannel } from "@/lib/aarti";
import { cn } from "@/lib/utils";

export function AartiPlaylist({ tracks }: { tracks: AartiTrack[] }) {
  const [activeId, setActiveId] = useState(tracks[0]?.videoId ?? "");
  const active =
    tracks.find((track) => track.videoId === activeId) ?? tracks[0];

  if (!active) {
    return (
      <p className="rounded-2xl border border-maroon/10 bg-cream-100/70 p-6 text-center text-sm text-ink-soft">
        The ashram&apos;s devotional recordings will be added here soon.
      </p>
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-maroon/15 bg-maroon-deep shadow-card">
          <iframe
            key={active.videoId}
            src={`https://www.youtube-nocookie.com/embed/${active.videoId}?rel=0`}
            title={`${active.title} — ${active.kind}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mt-3 flex flex-col gap-2 text-[0.7rem] text-ink-soft/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Now playing:{" "}
            <span className="font-medium text-maroon">{active.title}</span>
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${active.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold tracking-[0.08em] text-maroon uppercase transition-colors hover:text-gold"
          >
            Open on YouTube
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-maroon/10 bg-cream-100/70 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-maroon/10 pb-3">
          <ListMusic className="h-4 w-4 text-gold" aria-hidden="true" />
          <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-maroon uppercase">
            The Playlist
          </p>
        </div>

        <ol className="mt-2 divide-y divide-maroon/10">
          {tracks.map((track, index) => {
            const isActive = track.videoId === activeId;
            return (
              <li key={track.videoId}>
                <button
                  type="button"
                  onClick={() => setActiveId(track.videoId)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors",
                    isActive
                      ? "bg-white text-maroon"
                      : "text-ink-soft hover:bg-white/60 hover:text-maroon",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-semibold tabular-nums",
                      isActive
                        ? "border-gold/60 bg-gold-pale/50 text-maroon"
                        : "border-maroon/15 text-ink-soft/60",
                    )}
                  >
                    {isActive ? (
                      <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.82rem] leading-snug font-medium">
                      {track.title}
                    </span>
                    <span className="mt-0.5 block text-[0.66rem] text-ink-soft/60">
                      {track.language} · {track.kind}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <a
          href={youtubeChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-full border border-maroon/20 px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.1em] text-maroon uppercase transition-colors hover:border-gold hover:bg-white"
        >
          Visit the ashram channel
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
