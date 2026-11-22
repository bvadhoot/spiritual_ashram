import { aartiPlaylist, type AartiTrack } from "@/lib/aarti";
import { readPublicJson, writePublicJson } from "@/lib/storage";

const STORED_AARTI_FILE = "aarti.json";

export async function getStoredAartiTracks(): Promise<AartiTrack[]> {
  return readPublicJson<AartiTrack[]>(STORED_AARTI_FILE, []);
}

export async function getAllAartiTracks(): Promise<AartiTrack[]> {
  const stored = await getStoredAartiTracks();
  const seen = new Set<string>();
  const merged: AartiTrack[] = [];

  for (const track of [...stored, ...aartiPlaylist]) {
    if (!track.videoId || seen.has(track.videoId)) continue;
    seen.add(track.videoId);
    merged.push(track);
  }

  return merged;
}

export async function deleteStoredAartiTrack(
  videoId: string,
): Promise<boolean> {
  const stored = await getStoredAartiTracks();
  const next = stored.filter((item) => item.videoId !== videoId);
  if (next.length === stored.length) return false;
  await writePublicJson(STORED_AARTI_FILE, next);
  return true;
}

export async function addStoredAartiTrack(track: AartiTrack): Promise<void> {
  const stored = await getStoredAartiTracks();
  await writePublicJson(STORED_AARTI_FILE, [
    track,
    ...stored.filter((item) => item.videoId !== track.videoId),
  ]);
}
