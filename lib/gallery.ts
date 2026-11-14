export type GalleryCategory = "Satsang" | "Festivals" | "Seva" | "Ashram Life";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  featured?: boolean;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "guru-blessing",
    src: "/images/gallery-blessing.jpg",
    alt: "Sri Dr. Basavalinga Avadhoota raising his hand in blessing, wearing saffron robes",
    caption: "A blessing from Gurudev",
    category: "Ashram Life",
    featured: true,
  },
  {
    id: "evening-prayer",
    src: "/images/gallery-prayer.jpg",
    alt: "Sri Dr. Basavalinga Avadhoota with folded hands before a flower-decorated shrine and oil lamps",
    caption: "Evening prayer at the shrine",
    category: "Festivals",
    featured: true,
  },
  {
    id: "festival-stage",
    src: "/images/gallery-festival.jpg",
    alt: "A decorated festival stage with an idol of Hanuman and saffron flags at the ashram",
    caption: "Festival night at Mallayyagiri",
    category: "Festivals",
    featured: true,
  },
  {
    id: "procession",
    src: "/images/gallery-procession.jpg",
    alt: "Devotees walking in a devotional procession beneath a golden canopy",
    caption: "A procession of devotees",
    category: "Festivals",
    featured: true,
  },
  {
    id: "night-satsang",
    src: "/images/gallery-night.jpg",
    alt: "Thousands of devotees seated under lights for a night satsang at the ashram",
    caption: "Night satsang under the open sky",
    category: "Satsang",
  },
  {
    id: "ashram-gathering",
    src: "/images/gallery-crowd.jpg",
    alt: "A large gathering of devotees listening to a discourse at the ashram",
    caption: "A gathering of seekers",
    category: "Satsang",
  },
  {
    id: "women-devotees",
    src: "/images/gallery-devotees.jpg",
    alt: "Women devotees in colourful sarees seated together at an ashram programme",
    caption: "The ashram family",
    category: "Satsang",
  },
  {
    id: "guru-portrait",
    src: "/images/gallery-portrait.jpg",
    alt: "Portrait of Sri Dr. Basavalinga Avadhoota in a white turban and saffron shawl",
    caption: "Sri Dr. Basavalinga Avadhoota",
    category: "Ashram Life",
  },
  {
    id: "annadanam",
    src: "/images/highlight-annadanam.jpg",
    alt: "Volunteers serving annadanam to devotees seated in long rows",
    caption: "Annadanam, served with love",
    category: "Seva",
  },
  {
    id: "discourse",
    src: "/images/guru-speaking.jpg",
    alt: "Sri Dr. Basavalinga Avadhoota speaking into a microphone before a gathering",
    caption: "Guru Vani in the midst of devotees",
    category: "Ashram Life",
  },
];

export const galleryCategories: Array<"All" | GalleryCategory> = [
  "All",
  "Satsang",
  "Festivals",
  "Seva",
  "Ashram Life",
];

