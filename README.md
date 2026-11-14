# Sri Basavalinga Avadhoota Ashram — Website

Production website for **Sri Dr. Basavalinga Avadhoota** and the **Mallayyagiri Ashram** (Kuppa Nagar, Jharasangam, Telangana).

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Lucide icons, and Google Fonts (Playfair Display, Inter, Noto Sans Telugu, Ramabhadra). All content is statically rendered for SEO; the contact, donation and book-request forms are server routes.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build && npm start   # http://localhost:3000
```

Checks:

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest — event sorting/filtering, form validation
```

---

## Pages

| Route | Contents |
| --- | --- |
| `/` | Hero, feature strip, About the Guru, Ashram highlights, quote banner, gallery + events split, seva CTA |
| `/about` | Gurudev biography, timeline, Guru parampara, quote |
| `/ashram` | The campus, daily schedule, annadanam, goshala, visiting information and map |
| `/teachings` | Guru Vani, core teachings, discourse archive, daily practice |
| `/books` | Book catalogue and validated order-request form |
| `/aarti` | Aarti and bhajan playlist from the official YouTube channel |
| `/gallery` | Filterable photo grid with full-screen lightbox (keyboard + swipe) |
| `/events` | Upcoming events (auto-sorted, past ones hidden) and past-events archive |
| `/contact` | Validated contact form, ashram address, phones, email, map |
| `/donate` | Give by UPI or bank transfer — the form records the offering and returns a reference |
| `/privacy` | Privacy and donation policy |
| `/admin` | Private admin studio for publishing events, uploading photographs and member alerts |

Extras: `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, Open Graph/Twitter metadata, and JSON-LD (`Organization`, `Place`, `WebSite`, `Event` list).

---

## Project structure

```
app/                    routes, metadata, API handlers
  api/contact/          contact form endpoint (validation, honeypot, rate limit)
  api/donations/        records a UPI/bank giving request and returns a reference
  api/book-orders/      records book requests and optionally forwards them
  api/admin/            authenticated event/gallery publishing and login
  api/members/          opted-in SMS/WhatsApp update subscriptions
components/
  admin/                admin login and publishing forms
  layout/               top bar, sticky header, mobile nav, footer
  home/                 homepage sections
  gallery/              lightbox + filterable explorer
  events/               event cards
  donate/               donation context, modal, form
  contact/              contact form
  ui/                   buttons, section headings, reveal animation, Om mark
lib/
  site.ts               name, address, phones, socials, nav, donation presets
  content.ts            teachings, highlights, timeline, schedule, quotes
  events.ts             event data + date sorting/filtering helpers
  gallery.ts            gallery data + categories
  validation.ts         shared form validation (used by client and API)
  admin-auth.ts         signed HttpOnly admin sessions
  admin-validation.ts   event and gallery publishing validation
  storage.ts            Vercel Blob (production) or local files (development)
  members.ts            private opted-in member list
  notifications.ts      Twilio or webhook SMS/WhatsApp delivery
  rate-limit.ts         in-memory limiter for the API routes
data/                   contact submissions written on self-hosted servers
docs/CMS-GUIDE.md       how volunteers edit content, and how to plug in a headless CMS
```

---

## Editing content without touching components

- **Events** — `lib/events.ts` (dates in `YYYY-MM-DD`, IST calendar dates).
- **Gallery** — `lib/gallery.ts` (image path, alt text, caption, category).
- **Quotes, teachings, highlights, schedule** — `lib/content.ts`.
- **Address, phones, socials, nav, donation amounts, UPI and bank details** — `lib/site.ts`.
- **Book catalogue** — `lib/books.ts`.
- **Aarti and bhajan playlist** — `lib/aarti.ts`.
- **Images** — `public/images/` (WebP/JPEG, already compressed).

The recommended Headless CMS setup (Sanity, Strapi, or WordPress) is documented in [docs/CMS-GUIDE.md](docs/CMS-GUIDE.md).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. Nothing is required to run the site locally.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG/sitemap base URL. Set to the live domain before deploying. |
| `CONTACT_WEBHOOK_URL` | Optional JSON endpoint for enquiries (Zapier, Make, Apps Script, CRM). Without it, enquiries are appended to `data/contact-submissions.ndjson`. |
| `DONATION_WEBHOOK_URL` | Optional JSON endpoint for giving requests. Falls back to `CONTACT_WEBHOOK_URL`. |
| `BOOK_ORDER_WEBHOOK_URL` | Optional JSON endpoint for book requests. Falls back to `CONTACT_WEBHOOK_URL`. |
| `ADMIN_EMAIL` | Office email for `/admin`. Defaults to the public office email. |
| `ADMIN_PASSWORD` | Strong password for `/admin`. Required to enable the studio. |
| `ADMIN_SESSION_SECRET` | Random 32-byte hex secret for signing admin sessions. Required. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for persistent events, uploads and the private member list. Required on Vercel. |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | Optional Twilio credentials for direct SMS and WhatsApp receipts. |
| `TWILIO_SMS_FROM` / `TWILIO_WHATSAPP_FROM` | Optional Twilio sender numbers. WhatsApp senders use the `whatsapp:` prefix. |
| `NOTIFICATION_WEBHOOK_URL` | Optional JSON webhook for message and event-broadcast delivery when Twilio is not configured. |

### Giving and books

The donation form never touches card details. It records the donor's intent and returns a reference; the donor then pays by UPI or bank transfer.

- Add the ashram's confirmed UPI ID and bank details to `site.donation.giving` in `lib/site.ts`. Until they are filled in, the form tells the donor the office will share them.
- Book prices are intentionally not hard-coded. Every order is confirmed by the office before payment and dispatch.
- Both endpoints append to private NDJSON files under `data/` in self-hosted deployments; set the webhook variables to deliver them elsewhere.

---

## Admin studio

Open `/admin` (also linked discreetly in the footer). The office signs in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`; the session is a signed, HttpOnly cookie and the page is `noindex`.

- **Publish events** — title, dates, location, category, description and an optional existing gallery photograph. The event appears on `/events` immediately and can alert opted-in members.
- **Upload photographs** — JPEG/PNG/WebP, compressed in the browser to a web-friendly size. The image appears in `/gallery` and can be featured on the homepage.
- **Member updates** — devotees opt in on `/events#updates` or when donating. The list is stored privately (Vercel Blob private object in production) and is never exposed publicly.
- **SMS/WhatsApp** — donation receipts always go to the phone number provided. Event alerts go to opted-in members. Twilio is supported directly; a generic `NOTIFICATION_WEBHOOK_URL` can hand delivery to an existing automation.

### Persistent storage on Vercel

Create a Vercel Blob store, connect it to the project and set `BLOB_READ_WRITE_TOKEN`. Without it, Vercel cannot persist admin images, events or the member list; the admin shows a setup warning. Local development silently uses `data/` and `public/uploads/` instead.

## Deploying

The site is a standard Next.js app, so it deploys as-is to Vercel, Netlify, or any Node host:

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain.
2. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and `BLOB_READ_WRITE_TOKEN` in the host's dashboard (never in git).
3. Add Twilio or `NOTIFICATION_WEBHOOK_URL` for SMS/WhatsApp delivery, and set the UPI/bank details in `lib/site.ts` before publishing.
4. Build with `npm run build`, run with `npm start`.
5. On self-hosted servers, back up `data/` — it holds contact submissions and private member data.

If you deploy to a static-only host, the contact, donation and book-order endpoints need a separate backend; the marketing pages themselves export fine.

---

## Accessibility and performance

- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) and a skip link.
- Lightbox and mobile menu are focus-trapped dialogs with Escape/arrow-key support and restored focus.
- All images carry descriptive alt text and `loading="lazy"` below the fold; hero imagery is prioritised.
- Colour pairings meet WCAG AA contrast; icon-only controls have `aria-label`s.
- Reduced-motion preferences are respected by the reveal animations.
