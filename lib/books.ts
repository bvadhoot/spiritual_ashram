export interface Book {
  slug: string;
  title: string;
  language?: string;
  form: string;
  description: string;
}

export const books: Book[] = [
  {
    slug: "anubhavaamrutha",
    title: "Anubhavaamrutha",
    language: "Telugu",
    form: "Devotional songs",
    description:
      "Telugu devotional songs that carry spiritual experience and philosophical insight in simple, singable verse.",
  },
  {
    slug: "satya-shudda",
    title: "Satya Shudda",
    form: "Vachanas",
    description:
      "Modern vachana compositions reflecting spiritual wisdom and ethical values, signed 'Ghana Yogi Mallinatha'.",
  },
  {
    slug: "oldie-haadida-hridaya-geeta",
    title: "Oldie Haadida Hridaya Geeta",
    form: "Songs & reflections",
    description:
      "A collection of devotional songs and reflections expressing the heart's longing for the Divine.",
  },
  {
    slug: "avadhoota-vaibhavam",
    title: "Avadhoota Vaibhavam",
    form: "Biography",
    description:
      "The life history, spiritual journey and divine leelas of Poojya Sri Dr. Basavalinga Avadhoota, recorded through the experiences of devotees.",
  },
  {
    slug: "twenty-four-avatars-of-dattatreya",
    title: "The Twenty-Four Avatars of Lord Dattatreya",
    form: "Dattatreya study",
    description:
      "A study of the twenty-four avatars of Lord Dattatreya and the timeless wisdom of the Dattatreya tradition.",
  },
  {
    slug: "akkamahadevi-yoganga-trividhi",
    title: "Akkamahadevi Yoganga Trividhi",
    form: "Sharana tradition",
    description:
      "An exploration of Jaganmatha Akkamahadevi's teachings and the spiritual heritage of the Sharana tradition.",
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}
