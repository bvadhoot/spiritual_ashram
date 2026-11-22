import type { Metadata } from "next";
import Link from "next/link";
import { DateTime } from "luxon";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CalendarRange,
  Camera,
  Database,
  ExternalLink,
  ImageIcon,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Music2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminAartiForm } from "@/components/admin/admin-aarti-form";
import { AdminAartiList } from "@/components/admin/admin-aarti-list";
import { AdminAlertRecipients } from "@/components/admin/admin-alert-recipients";
import { AdminEventForm } from "@/components/admin/admin-event-form";
import { AdminEventList } from "@/components/admin/admin-event-list";
import { AdminFestivalManager } from "@/components/admin/admin-festival-manager";
import { AdminGalleryList } from "@/components/admin/admin-gallery-list";
import { AdminImageForm } from "@/components/admin/admin-image-form";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLogout } from "@/components/admin/admin-logout";
import { getAllAartiTracks, getStoredAartiTracks } from "@/lib/aarti-store";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getAllAlertRecipients } from "@/lib/alert-recipients";
import { getAllEvents, getStoredEvents, todayInIndia } from "@/lib/events";
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

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "aarti", label: "Aarti & Bhajans", icon: Music2 },
  { id: "calendar", label: "Calendar", icon: CalendarRange },
  { id: "alerts", label: "Alert numbers", icon: BellRing },
] as const;

type TabId = (typeof TABS)[number]["id"];

function resolveTab(value: unknown): TabId {
  return TABS.some((tab) => tab.id === value) ? (value as TabId) : "overview";
}

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

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-maroon/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-card"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold-pale/40 text-maroon">
        {icon}
      </span>
      <span className="mt-4 flex items-center gap-1.5 text-[1.02rem] font-serif text-maroon">
        {title}
        <ArrowRight
          className="h-3.5 w-3.5 text-gold opacity-0 transition group-hover:opacity-100"
          aria-hidden="true"
        />
      </span>
      <span className="mt-1.5 text-[0.76rem] leading-relaxed text-ink-soft">
        {description}
      </span>
    </Link>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; tab?: string }>;
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
    alertRecipients,
  ] = await Promise.all([
    getAllEvents(),
    getStoredEvents(),
    getAllGalleryImages(),
    getStoredGalleryImages(),
    getMemberCount(),
    getAllAartiTracks(),
    getStoredAartiTracks(),
    getStoredFestivals(),
    getAllAlertRecipients(),
  ]);

  const storage = storageMode();
  const messaging = messagingProviderLabel();

  const params = await searchParams;
  const tab = resolveTab(params.tab);
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
  const activeAlerts = alertRecipients.filter((item) => item.active).length;

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
              Persistent storage is not configured, so events, photographs and
              the member list will not survive a restart. On Cloudflare bind an
              R2 bucket to{" "}
              <code className="rounded bg-white px-1">ASHRAM_DATA</code> in{" "}
              <code className="rounded bg-white px-1">wrangler.jsonc</code>; on
              Vercel add{" "}
              <code className="rounded bg-white px-1">BLOB_READ_WRITE_TOKEN</code>
              .
            </p>
          </div>
        ) : null}

        <nav
          className="mt-6 flex flex-wrap gap-2 border-b border-maroon/10 pb-3"
          aria-label="Admin sections"
        >
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = item.id === tab;
            return (
              <Link
                key={item.id}
                href={`/admin?tab=${item.id}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.7rem] font-semibold transition ${
                  active
                    ? "border-maroon bg-maroon text-cream"
                    : "border-maroon/15 bg-white text-maroon hover:border-gold hover:bg-cream-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {tab === "overview" ? (
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
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
              <StatCard
                icon={<BellRing className="h-3.5 w-3.5" />}
                label="Alert numbers"
                value={`${activeAlerts}/${alertRecipients.length}`}
              />
            </div>

            <h2 className="mt-10 text-xl">What would you like to do?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QuickLink
                href="/admin?tab=events"
                icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
                title="Publish an event"
                description="Add a satsang, festival or camp to the public calendar and alert devotees."
              />
              <QuickLink
                href="/admin?tab=gallery"
                icon={<ImagePlus className="h-4 w-4" aria-hidden="true" />}
                title="Add photographs"
                description="Upload images to the public gallery, feature one on the homepage."
              />
              <QuickLink
                href="/admin?tab=aarti"
                icon={<Music2 className="h-4 w-4" aria-hidden="true" />}
                title="Add a bhajan"
                description="Paste a YouTube link to add an aarti or bhajan to the playlist."
              />
              <QuickLink
                href="/admin?tab=calendar"
                icon={<CalendarRange className="h-4 w-4" aria-hidden="true" />}
                title="Edit the calendar"
                description="Add festivals, Ekadashi and Purnima observances to the panchang."
              />
              <QuickLink
                href="/admin?tab=alerts"
                icon={<BellRing className="h-4 w-4" aria-hidden="true" />}
                title="Manage alert numbers"
                description="Choose which office phones receive SMS or WhatsApp alerts."
              />
              <QuickLink
                href="/events"
                icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
                title="See the public site"
                description="Open the calendar devotees see, and check how a listing looks."
              />
            </div>

            <div className="mt-8 rounded-2xl border border-maroon/10 bg-white p-5 text-[0.75rem] leading-relaxed text-ink-soft sm:p-6">
              <p className="flex items-center gap-2 font-semibold text-maroon">
                <Megaphone className="h-4 w-4 text-gold" aria-hidden="true" />
                Delivery status: {messaging}
              </p>
              <p className="mt-1.5">
                Only devotees who explicitly opt in are stored in the private
                member list. Donation receipts are transactional and are sent to
                the phone number provided with every offering. Office alert
                numbers are managed under{" "}
                <Link
                  href="/admin?tab=alerts"
                  className="font-semibold text-maroon underline decoration-gold/50 underline-offset-4"
                >
                  Alert numbers
                </Link>
                .
              </p>
            </div>
          </div>
        ) : null}

        {tab === "events" ? (
          <div className="mt-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminEventForm
                images={images.map((image) => ({
                  src: image.src,
                  caption: image.caption,
                }))}
              />

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
            </div>
          </div>
        ) : null}

        {tab === "gallery" ? (
          <div className="mt-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminImageForm />

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

                <AdminGalleryList images={storedImages} />
              </section>
            </div>
          </div>
        ) : null}

        {tab === "aarti" ? (
          <div className="mt-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
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

                <AdminAartiList tracks={storedTracks} />
              </section>
            </div>
          </div>
        ) : null}

        {tab === "calendar" ? (
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
        ) : null}

        {tab === "alerts" ? (
          <div className="mt-8">
            <AdminAlertRecipients
              recipients={alertRecipients}
              provider={messaging}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
