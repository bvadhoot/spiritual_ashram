# Content Editing & Headless CMS Guide

Two ways to keep the site current. Start with Option A — it costs nothing and works today. Move to Option B when several volunteers need to edit content without a developer.

---

## Option A — Edit the data files (no CMS)

All editable content lives in TypeScript data files with plain, human-readable structures. Editing requires no knowledge of React.

| What | File | Notes |
| --- | --- | --- |
| Events | `lib/events.ts` | Append objects to the `events` array. Past events disappear automatically; sorting is automatic. |
| Gallery photos | `lib/gallery.ts` | One object per image: `src`, `alt`, `caption`, `category`. |
| Quotes, teachings, highlights, daily schedule, timeline | `lib/content.ts` | Grouped exports with the same shape as the site sections. |
| Address, phones, email, socials, nav, donation amounts | `lib/site.ts` | Single source of truth used in the header, footer, contact page, and schema markup. |
| Images | `public/images/` | Drop a compressed WebP/JPEG, then reference `/images/your-file.webp`. |

### Adding an event

```ts
// lib/events.ts — inside the events array
{
  id: "kartika-pournami-2027",
  slug: "kartika-pournami-2027",
  date: "2027-11-11",             // YYYY-MM-DD, IST calendar date
  endDate: "2027-11-12",          // optional, for multi-day programmes
  title: "Kartika Pournami Deepotsava",
  location: "Mallayyagiri Ashram",
  description: "One or two sentences shown on the event card.",
  category: "Festival",           // "Satsang" | "Sadhana" | "Seva" | "Festival"
  image: "/images/gallery-festival.jpg",
  imageAlt: "Describe the photo for screen readers and search engines",
}
```

Rules enforced by the code and tests: dates are `YYYY-MM-DD`, the end date (when present) must not precede the start date, and `slug`/`id` must be unique.

### Adding a gallery photo

```ts
{
  id: "guru-blessing-2027",
  src: "/images/guru-blessing-2027.jpg",
  alt: "Gurudev blessing devotees at the Kartika satsang",
  caption: "Kartika satsang",
  category: "Satsang",            // "Satsang" | "Festivals" | "Seva" | "Ashram Life"
  featured: true,                 // optional: also appears on the homepage mosaic
}
```

### Image checklist

- Landscape, roughly 1600×1000 px, compressed to under ~250 KB.
- Name files in lowercase with hyphens (`guru-blessing-2027.jpg`).
- Always write real `alt` text — it drives accessibility, image search, and social previews.

After editing, run `npm run typecheck && npm test && npm run build`, then deploy.

---

## Option B — Headless CMS for volunteers

Recommended when the ashram team wants to publish events, photos, and daily quotes themselves.

### Choosing a platform

| Platform | Best for | Cost | Volunteer experience |
| --- | --- | --- | --- |
| **Sanity** (recommended) | Fastest to launch, excellent image handling, live preview | Free tier covers a small ashram comfortably | Clean web studio, no rebuild needed for content |
| **Strapi** | Full self-hosting and data ownership | Free (self-hosted) | Familiar admin panel, needs hosting + backups |
| **WordPress (headless)** | Volunteers already know WP | Hosting + plugins | Familiar editor, but heavier to maintain |

Sanity is the default recommendation: it has a hosted studio, built-in image CDN with crop/hotspot, and a generous free tier. Strapi is the right choice if the ashram insists on owning the database. WordPress is worth it only if the team already runs WP.

### Content models

Create these document types in the CMS; they map one-to-one onto the existing data files.

**Event**
`title` (string) · `slug` (slug) · `date` (date) · `endDate` (date, optional) · `location` (string) · `description` (text) · `category` (list: Satsang, Sadhana, Seva, Festival) · `image` (image with alt) · `published` (boolean)

**GalleryImage**
`caption` (string) · `image` (image with alt) · `category` (list: Satsang, Festivals, Seva, Ashram Life) · `featured` (boolean) · `order` (number)

**Quote** (Guru Vani / daily quote)
`text` (text) · `attribution` (string) · `date` (date) · `published` (boolean)

**Teaching** (discourse archive)
`title` · `slug` · `summary` · `body` (portable text) · `topic` · `date` · `audioUrl` (optional)

**SiteSettings** (singleton)
`ashramName` · `teluguName` · `address` · `phones` (array) · `email` · `socialLinks` (array) · `donationPresets` (array of numbers)

### Wiring it into the site

Keep the components untouched; replace the data source in `lib/`.

1. Install the CMS client, e.g. `npm install @sanity/client`.
2. Add env vars in `.env.local` (and in the host dashboard):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=...
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. In `lib/events.ts` (then the same pattern for the others), replace the exported array with a fetch and keep the existing helpers:

   ```ts
   import { createClient } from "@sanity/client";

   const client = createClient({
     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
     apiVersion: "2025-01-01",
     useCdn: true,
   });

   export async function getEvents(): Promise<AshramEvent[]> {
     const rows = await client.fetch(`*[_type == "event" && published] | order(date asc){
       "id": _id, "slug": slug.current, title, date, endDate, location,
       description, category, "image": image.asset->url, "imageAlt": image.alt
     }`);
     return rows;
   }
   ```

   The pure helpers (`getUpcomingEvents`, `sortEventsByDate`, `formatEventDate`, …) already accept an array, so they keep working — pass the fetched rows into them. Their tests in `tests/events.test.ts` stay valid.

4. Convert the pages that consume them to async server components (`export default async function Page()`), `await` the fetch, and add a revalidate window so content updates without a deploy:
   ```ts
   export const revalidate = 3600; // re-render at most hourly
   ```
5. For instant publishing, add a webhook from the CMS to your host's deploy hook, or use `revalidatePath("/events")` inside a small `/api/revalidate` route protected by a secret.

### Volunteer workflow once live

1. Sign in to the CMS studio (bookmark it; use Google sign-in for the ashram account).
2. Events: *Create → Event*, pick the date, write two sentences, upload a photo with alt text, publish. It appears on `/events` and the homepage automatically; past events hide themselves.
3. Gallery: *Create → Gallery image*, upload, caption, choose a category. Tick **featured** for the homepage mosaic.
4. Guru Vani: *Create → Quote*. The newest published quote is used on the homepage.
5. Nothing requires a developer, a code change, or a redeploy (given the revalidation step above).

### Migration checklist

- [ ] Model the five document types above.
- [ ] Import the current entries from `lib/events.ts`, `lib/gallery.ts`, and `lib/content.ts` (a one-off script using the CMS import CLI is usually quickest).
- [ ] Upload images to the CMS CDN; keep `public/images/` as a fallback until verified.
- [ ] Swap the `lib/` data sources and convert consumers to async.
- [ ] Add revalidation (time-based or webhook).
- [ ] Verify `npm run build` — pages must still be statically generated or ISR-cached, not fully dynamic.
- [ ] Hand over CMS logins and this guide to the ashram volunteers.
