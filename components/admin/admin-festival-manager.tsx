"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ADMIN_FESTIVAL_CATEGORIES,
  validateAdminFestival,
  type AdminFestivalInput,
} from "@/lib/admin-validation";
import type { AdminFestival } from "@/lib/panchang/overrides";
import type { FieldErrors } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500";

const labelClass =
  "mb-1.5 block text-[0.66rem] font-semibold tracking-[0.1em] text-maroon uppercase";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

function dateLabel(value: string): string {
  const date = new Date(`${value}T12:00:00+05:30`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function shiftDate(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

interface FestivalForm {
  id: string;
  date: string;
  endDate: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  category: string;
  major: boolean;
}

function blankForm(today: string): FestivalForm {
  return {
    id: "",
    date: today,
    endDate: "",
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    category: "Festival",
    major: true,
  };
}

const TITHI_HINTS = ["purnima", "amavasya", "ekadashi"] as const;

function tithiLabel(kind: string): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

interface AdminFestivalManagerProps {
  monthKey: string;
  monthLabel: string;
  previousMonth: string;
  nextMonth: string;
  today: string;
  festivals: AdminFestival[];
}

export function AdminFestivalManager({
  monthKey,
  monthLabel,
  previousMonth,
  nextMonth,
  today,
  festivals,
}: AdminFestivalManagerProps) {
  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<FestivalForm>(() => blankForm(today));
  const [errors, setErrors] = useState<FieldErrors<AdminFestivalInput>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [failure, setFailure] = useState("");
  const [tithi, setTithi] = useState("");
  const [tithiLoading, setTithiLoading] = useState(false);

  useEffect(() => {
    const date = form.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setTithi("");
      return;
    }

    let cancelled = false;
    setTithiLoading(true);
    fetch(`/api/panchang?date=${date}`)
      .then((response) => response.json())
      .then((result: { day?: { tithi?: { name?: string } } }) => {
        if (!cancelled) setTithi(result.day?.tithi?.name ?? "");
      })
      .catch(() => {
        if (!cancelled) setTithi("");
      })
      .finally(() => {
        if (!cancelled) setTithiLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const expected = TITHI_HINTS.find((hint) =>
    form.name.toLowerCase().includes(hint),
  );
  const mismatch = Boolean(
    expected && tithi && !tithi.toLowerCase().includes(expected),
  );

  function update<K extends keyof FestivalForm>(field: K, value: FestivalForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function openNew() {
    setForm(blankForm(today));
    setErrors({});
    setNotice("");
    setFailure("");
    setEditorOpen(true);
  }

  function openEdit(festival: AdminFestival) {
    setForm({
      id: festival.id,
      date: festival.date,
      endDate: festival.endDate ?? "",
      name: festival.name,
      nameTe: festival.nameTe,
      description: festival.description,
      descriptionTe: festival.descriptionTe,
      category: festival.category,
      major: festival.major,
    });
    setErrors({});
    setNotice("");
    setFailure("");
    setEditorOpen(true);
  }

  async function snapToTithi(kind: string) {
    for (const offset of [0, 1, -1, 2, -2, 3, -3, 4, -4]) {
      const candidate = shiftDate(form.date, offset);
      try {
        const result = (await fetch(`/api/panchang?date=${candidate}`).then(
          (response) => response.json(),
        )) as { day?: { tithi?: { name?: string } } };
        const name = result.day?.tithi?.name ?? "";
        if (name.toLowerCase().includes(kind)) {
          update("date", candidate);
          return;
        }
      } catch {
        // Keep looking within the window.
      }
    }
    setFailure(
      `No ${kind} date was found within four days of ${form.date}.`,
    );
  }

  async function save(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const payload: AdminFestivalInput = { ...form, hidden: false };
    const validation = validateAdminFestival(payload);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setFailure("");

    try {
      const response = await fetch("/api/admin/festivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors<AdminFestivalInput>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "The festival could not be saved.");
      }

      setNotice(`“${validation.data.name}” was saved to the calendar.`);
      setEditorOpen(false);
      router.refresh();
    } catch (caught) {
      setFailure(
        caught instanceof Error
          ? caught.message
          : "The festival could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(festival: AdminFestival) {
    setBusyId(festival.id);
    setFailure("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/festivals?id=${encodeURIComponent(festival.id)}`,
        { method: "DELETE" },
      );
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        mode?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The festival could not be removed.");
      }

      setNotice(
        result.mode === "deleted"
          ? `“${festival.name}” was removed from the calendar.`
          : `“${festival.name}” is now hidden from the public calendar.`,
      );
      router.refresh();
    } catch (caught) {
      setFailure(
        caught instanceof Error
          ? caught.message
          : "The festival could not be removed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function restore(festival: AdminFestival) {
    setBusyId(festival.id);
    setFailure("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/festivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: festival.id,
          date: festival.date,
          endDate: festival.endDate ?? "",
          name: festival.name,
          nameTe: festival.nameTe,
          description: festival.description,
          descriptionTe: festival.descriptionTe,
          category: festival.category,
          major: festival.major,
          hidden: false,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The festival could not be restored.");
      }

      setNotice(`“${festival.name}” is back on the public calendar.`);
      router.refresh();
    } catch (caught) {
      setFailure(
        caught instanceof Error
          ? caught.message
          : "The festival could not be restored.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section
      data-month={monthKey}
      className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-maroon/10 pb-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-gold">
            <Flame className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Panchang calendar</p>
            <h2 className="mt-1 text-xl">Festivals &amp; mythology</h2>
            <p className="mt-1 max-w-md text-[0.75rem] leading-relaxed text-ink-soft">
              Changes appear on the public Hindu calendar right away. Telugu
              fields are optional — English is used when they are left blank.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin?tab=calendar&month=${previousMonth}`}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="min-w-[7.5rem] text-center text-[0.72rem] font-semibold text-maroon">
            {monthLabel}
          </span>
          <Link
            href={`/admin?tab=calendar&month=${nextMonth}`}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {editorOpen ? null : (
            <Button type="button" size="sm" onClick={openNew}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add festival
            </Button>
          )}
        </div>
      </div>

      {notice ? (
        <p
          role="status"
          className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[0.74rem] leading-relaxed text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      ) : null}

      {failure ? (
        <p
          role="alert"
          className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.74rem] leading-relaxed text-red-800"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {failure}
        </p>
      ) : null}

      {editorOpen ? (
        <form onSubmit={save} className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg">
              {form.id ? "Edit festival" : "Add a festival"}
            </h3>
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="rounded-full border border-maroon/20 px-3 py-1.5 text-[0.66rem] font-semibold text-maroon transition hover:bg-cream-100"
            >
              Cancel
            </button>
          </div>

          <div>
            <label htmlFor="festival-name" className={labelClass}>
              Name <span className="text-maroon/45">*</span>
            </label>
            <input
              id="festival-name"
              value={form.name}
              onChange={(inputEvent) => update("name", inputEvent.target.value)}
              aria-invalid={Boolean(errors.name)}
              className={inputClass}
              placeholder="Kartika Purnima"
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-700" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="festival-name-te" className={labelClass}>
              Telugu name{" "}
              <span className="text-ink-soft/45">(optional)</span>
            </label>
            <input
              id="festival-name-te"
              lang="te"
              value={form.nameTe}
              onChange={(inputEvent) => update("nameTe", inputEvent.target.value)}
              className={cn(inputClass, "font-telugu-body")}
              placeholder="కార్తీక పౌర్ణమి"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="festival-date" className={labelClass}>
                Date <span className="text-maroon/45">*</span>
              </label>
              <input
                id="festival-date"
                type="date"
                value={form.date}
                onChange={(inputEvent) => update("date", inputEvent.target.value)}
                aria-invalid={Boolean(errors.date)}
                className={inputClass}
              />
              {errors.date ? (
                <p className="mt-1 text-xs text-red-700" role="alert">
                  {errors.date}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="festival-end-date" className={labelClass}>
                End date{" "}
                <span className="text-ink-soft/45">(optional)</span>
              </label>
              <input
                id="festival-end-date"
                type="date"
                value={form.endDate}
                onChange={(inputEvent) =>
                  update("endDate", inputEvent.target.value)
                }
                aria-invalid={Boolean(errors.endDate)}
                className={inputClass}
              />
              {errors.endDate ? (
                <p className="mt-1 text-xs text-red-700" role="alert">
                  {errors.endDate}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-maroon/10 bg-cream-100/60 px-3.5 py-2.5 text-[0.7rem] leading-relaxed text-ink-soft">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
              {tithiLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-gold" aria-hidden="true" />
                  Checking the tithi…
                </>
              ) : tithi ? (
                <>
                  The tithi on this date is{" "}
                  <strong className="text-maroon">{tithi}</strong>.
                </>
              ) : (
                "Choose a date to check its tithi."
              )}
            </p>
            {mismatch && expected ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-amber-900">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {tithiLabel(expected)} festivals belong on the{" "}
                  {tithiLabel(expected)} tithi, but this date is {tithi}.
                </span>
                <button
                  type="button"
                  onClick={() => void snapToTithi(expected)}
                  className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[0.64rem] font-semibold text-amber-900 transition hover:bg-amber-50"
                >
                  Use the nearest {tithiLabel(expected)} date
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="festival-category" className={labelClass}>
                Category
              </label>
              <select
                id="festival-category"
                value={form.category}
                onChange={(inputEvent) =>
                  update("category", inputEvent.target.value)
                }
                aria-invalid={Boolean(errors.category)}
                className={inputClass}
              >
                {ADMIN_FESTIVAL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="mt-1 text-xs text-red-700" role="alert">
                  {errors.category}
                </p>
              ) : null}
            </div>
            <label className="flex items-start gap-2.5 self-end rounded-xl border border-gold/25 bg-cream-100/70 px-3.5 py-2.5">
              <input
                type="checkbox"
                checked={form.major}
                onChange={(inputEvent) =>
                  update("major", inputEvent.target.checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-maroon/30 accent-maroon"
              />
              <span className="text-[0.7rem] leading-relaxed text-ink-soft">
                <span className="block font-semibold text-maroon">
                  Major festival
                </span>
                Highlighted with the flame in the calendar.
              </span>
            </label>
          </div>

          <div>
            <label htmlFor="festival-description" className={labelClass}>
              Mythology or note <span className="text-maroon/45">*</span>
            </label>
            <textarea
              id="festival-description"
              rows={3}
              value={form.description}
              onChange={(inputEvent) =>
                update("description", inputEvent.target.value)
              }
              aria-invalid={Boolean(errors.description)}
              className={inputClass}
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-red-700" role="alert">
                {errors.description}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="festival-description-te" className={labelClass}>
              Telugu note{" "}
              <span className="text-ink-soft/45">(optional)</span>
            </label>
            <textarea
              id="festival-description-te"
              lang="te"
              rows={3}
              value={form.descriptionTe}
              onChange={(inputEvent) =>
                update("descriptionTe", inputEvent.target.value)
              }
              className={cn(inputClass, "font-telugu-body")}
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              "Save festival"
            )}
          </Button>
        </form>
      ) : (
        <ul className="divide-y divide-maroon/10">
          {festivals.length === 0 ? (
            <li className="py-8 text-center text-[0.8rem] text-ink-soft">
              No festivals recorded for {monthLabel}.
            </li>
          ) : null}
          {festivals.map((festival) => (
            <li
              key={festival.id}
              className="flex flex-wrap items-start justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-serif text-[0.98rem]",
                    festival.hidden
                      ? "text-ink-soft/55 line-through"
                      : "text-maroon",
                  )}
                >
                  {festival.name}
                  {festival.major ? (
                    <span className="ml-2 rounded-full bg-gold-pale/60 px-1.5 py-0.5 align-middle text-[0.5rem] font-semibold tracking-[0.08em] text-maroon uppercase">
                      Major
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[0.68rem] text-ink-soft">
                  {dateLabel(festival.date)}
                  {festival.endDate ? ` – ${dateLabel(festival.endDate)}` : ""} ·{" "}
                  {festival.category} ·{" "}
                  {festival.source === "built-in" ? "Reference" : "Ashram"}
                  {festival.hidden ? " · Hidden" : ""}
                </p>
                <p className="font-telugu-body mt-0.5 text-[0.66rem] text-ink-soft/70">
                  {festival.nameTe}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {festival.hidden ? (
                  <button
                    type="button"
                    onClick={() => void restore(festival)}
                    disabled={busyId === festival.id}
                    aria-label={`Restore ${festival.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40 disabled:opacity-50"
                  >
                    {busyId === festival.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openEdit(festival)}
                      aria-label={`Edit ${festival.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(festival)}
                      disabled={busyId === festival.id}
                      aria-label={
                        festival.source === "custom"
                          ? `Delete ${festival.name}`
                          : `Hide ${festival.name}`
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    >
                      {busyId === festival.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 border-t border-maroon/10 pt-3 text-[0.66rem] leading-relaxed text-ink-soft/70">
        Hiding a reference festival keeps it out of the public calendar without
        losing the original entry, so you can restore it at any time.
      </p>
    </section>
  );
}
