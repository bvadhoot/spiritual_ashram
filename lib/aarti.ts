export interface AartiTrack {
  videoId: string;
  title: string;
  language: string;
  kind: string;
}

/**
 * Devotional recordings published on the ashram's official YouTube channel.
 * The channel is the source of truth; this list is refreshed as new songs are
 * released there.
 */
export const aartiPlaylist: AartiTrack[] = [
  {
    videoId: "y4-OZ2Iihgg",
    title: "Gurudev Tumhari Jai Jai Ho",
    language: "Hindi",
    kind: "Bhajan",
  },
  {
    videoId: "8HRVCrUR38M",
    title: "Mallayyagiri Maha Santha",
    language: "Kannada",
    kind: "Devotional song",
  },
  {
    videoId: "PntVnZA2FPE",
    title: "Appa Appa Ante Chaalu",
    language: "Telugu",
    kind: "Guru bhakti song",
  },
  {
    videoId: "IEUflDAqTN4",
    title: "Challaga Raa Swami",
    language: "Telugu",
    kind: "Guru bhakti song",
  },
  {
    videoId: "ZPu4o-jonMI",
    title: "Vinade Vinade Oyamma",
    language: "Telugu",
    kind: "Folk song",
  },
];

export const youtubeChannel =
  "https://www.youtube.com/channel/UCu9l6DAQTXW5kSoRjSefulQ";
