"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/use-dialog";
import {
  ADMIN_EVENT_CATEGORIES,
  validateAdminEvent,
  type AdminEventInput,
} from "@/lib/admin-validation";
import type { AshramEvent } from "@/lib/events";
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

function rangeLabel(event: AshramEvent): string {
  return event.endDate
    ? `${dateLabel(event.date)} – ${dateLabel(event.endDate)}`
    : dateLabel(event.date);
}

function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function blankEvent(): AdminEventInput {
  return {
    title: "",
    date: todayInIndia(),
    endDate: "",
    location: "Mallayyagiri Ashram",
    description: "",
    category: "Satsang",
    image: "",
    notify: false,
  };
}

interface AdminEventListProps {
  events: AshramEvent[];
  images: Array<{ src: string; caption: string }>;
}

export function AdminEventList({ events, images }: AdminEventListProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<AshramEvent | null>(null);
  const [values, setValues] = useState<AdminEventInput>(blankEvent);
  const [errors, setErrors] = useState<FieldErrors<AdminEventInput>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [failure, setFailure] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function closeEditor() {
    setEditing(null);
    setErrors({});
  }

  useDialog(Boolean(editing), dialogRef, closeEditor);

  function openEditor(event: AshramEvent) {
    setValues({
      title: event.title,
      date: event.date,
      endDate: event.endDate ?? "",
      location: event.location,
      description: event.description,
      category: event.category,
      image: event.image ?? "",
      notify: false,
    });
    setErrors({});
    setNotice("");
    setFailure("");
    setEditing(event);
  }

  function update<K extends keyof AdminEventInput>(
    field: K,
    value: AdminEventInput[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (!editing) return;

    const validation = validateAdminEvent(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setFailure("");

    try {
      const response = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, id: editing.id }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors<AdminEventInput>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "The event could not be updated.");
      }

      setNotice(`“${validation.data.title}” was updated on the calendar.`);
      closeEditor();
      router.refresh();
    } catch (caught) {
      setFailure(
        caught instanceof Error
          ? caught.message
          : "The event could not be updated.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event: AshramEvent) {
    setDeleting(event.id);
    setFailure("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/events?id=${encodeURIComponent(event.id)}`,
        { method: "DELETE" },
      );
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The event could not be deleted.");
      }

      setNotice(`“${event.title}” was removed from the calendar.`);
      setConfirming(null);
      router.refresh();
    } catch (caught) {
      setFailure(
        caught instanceof Error
          ? caught.message
          : "The event could not be deleted.",
      );
    } finally {
      setDeleting(null);
    }
  }

  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-[0.8rem] text-ink-soft">
        No admin-created events yet. Use the form above to publish the first
        one.
      </p>
    );
  }

  return (
    <>
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

      <ul className="divide-y divide-maroon/10">
        {events.map((event) => (
          <li key={event.id} className="py-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-maroon">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[0.98rem] text-maroon">
                  {event.title}
                </p>
                <p className="mt-0.5 text-[0.68rem] text-ink-soft">
                  {rangeLabel(event)} · {event.category}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEditor(event)}
                  aria-label={`Edit ${event.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfirming((current) =>
                      current === event.id ? null : event.id,
                    )
                  }
                  aria-label={`Delete ${event.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {confirming === event.id ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[0.72rem] leading-relaxed text-red-800">
                <span className="min-w-[12rem] flex-1">
                  Remove “{event.title}” from the calendar? This cannot be
                  undone.
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void handleDelete(event)}
                  disabled={deleting === event.id}
                >
                  {deleting === event.id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Removing…
                    </>
                  ) : (
                    "Yes, remove"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="rounded-full border border-maroon/20 px-3 py-1.5 text-[0.66rem] font-semibold text-maroon transition hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {editing ? (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-maroon-deep/80 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(mouseEvent) => {
            if (mouseEvent.target === mouseEvent.currentTarget) closeEditor();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-edit-event-title"
            tabIndex={-1}
            className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/30 bg-cream p-5 shadow-soft outline-none sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-maroon/10 pb-4">
              <div>
                <p className="eyebrow">Edit event</p>
                <h3 id="admin-edit-event-title" className="mt-1 text-xl">
                  {editing.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close the edit form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="edit-event-title" className={labelClass}>
                  Event title <span className="text-maroon/45">*</span>
                </label>
                <input
                  id="edit-event-title"
                  value={values.title}
                  onChange={(inputEvent) => update("title", inputEvent.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  className={inputClass}
                />
                {errors.title ? (
                  <p className="mt-1 text-xs text-red-700" role="alert">
                    {errors.title}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-event-date" className={labelClass}>
                    Start date <span className="text-maroon/45">*</span>
                  </label>
                  <input
                    id="edit-event-date"
                    type="date"
                    value={values.date}
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
                  <label htmlFor="edit-event-end-date" className={labelClass}>
                    End date{" "}
                    <span className="text-ink-soft/45">(optional)</span>
                  </label>
                  <input
                    id="edit-event-end-date"
                    type="date"
                    value={values.endDate ?? ""}
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

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-event-location" className={labelClass}>
                    Location <span className="text-maroon/45">*</span>
                  </label>
                  <input
                    id="edit-event-location"
                    value={values.location}
                    onChange={(inputEvent) =>
                      update("location", inputEvent.target.value)
                    }
                    aria-invalid={Boolean(errors.location)}
                    className={inputClass}
                  />
                  {errors.location ? (
                    <p className="mt-1 text-xs text-red-700" role="alert">
                      {errors.location}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="edit-event-category" className={labelClass}>
                    Category
                  </label>
                  <select
                    id="edit-event-category"
                    value={values.category}
                    onChange={(inputEvent) =>
                      update(
                        "category",
                        inputEvent.target.value as AdminEventInput["category"],
                      )
                    }
                    className={inputClass}
                  >
                    {ADMIN_EVENT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-event-description" className={labelClass}>
                  Description <span className="text-maroon/45">*</span>
                </label>
                <textarea
                  id="edit-event-description"
                  rows={4}
                  value={values.description}
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
                <label htmlFor="edit-event-image" className={labelClass}>
                  Photograph{" "}
                  <span className="text-ink-soft/45">(optional)</span>
                </label>
                <select
                  id="edit-event-image"
                  value={values.image ?? ""}
                  onChange={(inputEvent) =>
                    update("image", inputEvent.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">No photograph</option>
                  {images.map((image) => (
                    <option key={image.src} value={image.src}>
                      {image.caption}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[0.68rem] leading-relaxed text-ink-soft">
                Saving an edit updates the public calendar but does not send a
                new alert to members.
              </p>

              {failure ? (
                <p
                  role="alert"
                  className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.74rem] leading-relaxed text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {failure}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-full border border-maroon/20 px-4 py-2 text-[0.68rem] font-semibold text-maroon transition hover:bg-cream-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
