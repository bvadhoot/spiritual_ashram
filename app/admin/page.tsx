import type { Metadata } from "next";
import Link from "next/link";
import { DateTime } from "luxon";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Database,
  ExternalLink,
  ImageIcon,
  Megaphone,
  Music2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminAartiForm } from "@/components/admin/admin-aarti-form";
import { AdminEventForm } from "@/components/admin/admin-event-form";
import { AdminEventList } from "@/components/admin/admin-event-list";
import { AdminFestivalManager } from "@/components/admin/admin-festival-manager";
import { AdminImageForm } from "@/components/admin/admin-image-form";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLogout } from "@/components/admin/admin-logout";
import { getAllAartiTracks, getStoredAartiTracks } from "@/lib/aarti-store";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import {
  getAllEvents,
  getStoredEvents,
  todayInIndia,
} from "@/lib/events";
import {
  getAllGalleryImages,
  getStoredGalleryImages,
} from "@/lib/gallery-store";
import { getMemberCount } from "@/lib/members";
import { messagingProviderLabel } from "@/lib/notifications";
import { festivalAdminView } from "@/lib/panchang";
import { getStoredFestivals } from "@/lib/panchang/festival-store";
import { storageMode } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Studio",
  robots: { index: false, follow: false },
};

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-maroon/10 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(74,28,28,0.5)]">
      <div className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.16em] text-ink-soft/60 uppercase">
        <span className="text-gold">{icon}</span>
        {label}
      </div>
      <p className="mt-2 font-serif text-2xl text-maroon">{value}</p>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await getAdminSession();

  if (!session) {
    return <AdminLogin configured={isAdminConfigured()} />;
  }

  const [
    events,
    storedEvents,
    images,
    storedImages,
    memberCount,
    tracks,
    storedTracks,
    storedFestivals,
  ] = await Promise.all([
    getAllEvents(),
    getStoredEvents(),
    getAllGalleryImages(),
    getStoredGalleryImages(),
    getMemberCount(),
    getAllAartiTracks(),
    getStoredAartiTracks(),
    getStoredFestivals(),
  ]);

  const storage = storageMode();
  const messaging = messagingProviderLabel();

  const params = await searchParams;
  const requestedMonth =
    typeof params.month === "string" ? params.month : "";
  const monthKey = /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth)
    ? requestedMonth
    : todayInIndia().slice(0, 7);
  const monthStart = DateTime.fromISO(`${monthKey}-01`, {
    zone: "Asia/Kolkata",
  });
  const monthLabel = monthStart.setLocale("en-IN").toFormat("LLLL yyyy");
  const previousMonth = monthStart.minus({ months: 1 }).toFormat("yyyy-MM");
  const nextMonth = monthStart.plus({ months: 1 }).toFormat("yyyy-MM");
  const festivals = festivalAdminView(monthKey, storedFestivals);

  return (
    <div className="min-h-screen bg-cream-100/50 py-10 sm:py-14">
      <div className="container-site">
        <div className="flex flex-col gap-5 border-b border-maroon/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Ashram Office
            </p>
            <h1 className="mt-2 text-[2.1rem] sm:text-[2.6rem]">Admin Studio</h1>
            <p className="mt-2 text-[0.82rem] text-ink-soft">
              Signed in as <span className="text-maroon">{session.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-maroon/20 px-4 py-2 text-[0.68rem] font-semibold text-maroon transition hover:border-gold hover:bg-cream-100"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <AdminLogout />
          </div>
        </div>

        {storage === "unconfigured" ? (
          <div className="mt-6 flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[0.76rem] leading-relaxed text-amber-900">
            <Database className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Persistent storage is not configured. Add{" "}
              <code className="rounded bg-white px-1">BLOB_READ_WRITE_TOKEN</code>{" "}
              to this Vercel project before uploading photographs or publishing
              events.
            </p>
          </div>
        ) : null}

        {messaging === "Not configured" ? (
          <div className="mt-3 flex gap-2.5 rounded-xl border border-gold/30 bg-gold-pale/35 px-4 py-3 text-[0.76rem] leading-relaxed text-maroon">
            <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <p>
              Donation receipts are recorded, but SMS and WhatsApp delivery need{" "}
              <code className="rounded bg-white px-1">TWILIO_ACCOUNT_SID</code>,{" "}
              <code className="rounded bg-white px-1">TWILIO_AUTH_TOKEN</code>,{" "}
              <code className="rounded bg-white px-1">TWILIO_SMS_FROM</code>,{" "}
              <code className="rounded bg-white px-1">TWILIO_WHATSAPP_FROM</code>{" "}
              or a{" "}
              <code className="rounded bg-white px-1">
                NOTIFICATION_WEBHOOK_URL
              </code>
              .
            </p>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            label="Events on calendar"
            value={events.length}
          />
          <StatCard
            icon={<ImageIcon className="h-3.5 w-3.5" />}
            label="Gallery photographs"
            value={images.length}
          />
          <StatCard
            icon={<Camera className="h-3.5 w-3.5" />}
            label="Admin uploads"
            value={storedImages.length}
          />
          <StatCard
            icon={<Users className="h-3.5 w-3.5" />}
            label="Update subscribers"
            value={memberCount}
          />
          <StatCard
            icon={<Music2 className="h-3.5 w-3.5" />}
            label="Aarti & bhajan tracks"
            value={tracks.length}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <AdminAartiForm />

          <section className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-maroon/10 pb-4">
              <div>
                <p className="eyebrow">Devotional playlist</p>
                <h2 className="mt-1 text-xl">Songs on the Aarti page</h2>
              </div>
              <Link
                href="/aarti"
                className="inline-flex shrink-0 items-center gap-1 text-[0.64rem] font-semibold tracking-[0.12em] text-maroon uppercase hover:text-maroon-soft"
              >
                Listen
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>

            {storedTracks.length === 0 ? (
              <p className="py-8 text-center text-[0.8rem] text-ink-soft">
                No admin-added songs yet. Paste a YouTube link above to add the
                first aarti or bhajan.
              </p>
            ) : (
              <ul className="divide-y divide-maroon/10">
                {storedTracks.slice(0, 6).map((track) => (
                  <li key={track.videoId} className="flex gap-3 py-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-maroon">
                      <Music2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-[0.98rem] text-maroon">
                        {track.title}
                      </p>
                      <p className="mt-0.5 text-[0.68rem] text-ink-soft">
                        {track.language} · {track.kind}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AdminEventForm
            images={images.map((image) => ({
              src: image.src,
              caption: image.caption,
            }))}
          />
          <AdminImageForm />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-maroon/10 pb-4">
              <div>
                <p className="eyebrow">Recent additions</p>
                <h2 className="mt-1 text-xl">Events you published</h2>
              </div>
              <Link
                href="/events"
                className="inline-flex shrink-0 items-center gap-1 text-[0.64rem] font-semibold tracking-[0.12em] text-maroon uppercase hover:text-maroon-soft"
              >
                View calendar
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>

            <AdminEventList
              events={storedEvents}
              images={images.map((image) => ({
                src: image.src,
                caption: image.caption,
              }))}
            />
          </section>

          <section className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-maroon/10 pb-4">
              <div>
                <p className="eyebrow">Recent additions</p>
                <h2 className="mt-1 text-xl">Photographs you uploaded</h2>
              </div>
              <Link
                href="/gallery"
                className="inline-flex shrink-0 items-center gap-1 text-[0.64rem] font-semibold tracking-[0.12em] text-maroon uppercase hover:text-maroon-soft"
              >
                View gallery
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>

            {storedImages.length === 0 ? (
              <p className="py-8 text-center text-[0.8rem] text-ink-soft">
                No admin uploads yet. Add a photograph to start the new album.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {storedImages.slice(0, 6).map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-cream-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep/80 to-transparent px-2 py-1.5 text-[0.58rem] leading-tight text-cream">
                      {image.caption}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-8">
          <AdminFestivalManager
            monthKey={monthKey}
            monthLabel={monthLabel}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            today={todayInIndia()}
            festivals={festivals}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-maroon/10 bg-white p-5 text-[0.75rem] leading-relaxed text-ink-soft sm:p-6">
          <p className="flex items-center gap-2 font-semibold text-maroon">
            <Megaphone className="h-4 w-4 text-gold" aria-hidden="true" />
            Delivery status: {messaging}
          </p>
          <p className="mt-1.5">
            Only devotees who explicitly opt in are stored in the private member
            list. Donation receipts are transactional and are sent to the phone
            number provided with every offering.
          </p>
        </div>
      </div>
    </div>
  );
}
