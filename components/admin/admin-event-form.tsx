"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BellRing,
  CalendarPlus,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface AdminEventFormProps {
  images: Array<{ src: string; caption: string }>;
}

interface BroadcastResult {
  members: number;
  sent: number;
  failed: number;
  queued: boolean;
  provider: "twilio" | "webhook" | "none";
}

function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function AdminEventForm({ images }: AdminEventFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<AdminEventInput>({
    title: "",
    date: todayInIndia(),
    endDate: "",
    location: "Mallayyagiri Ashram",
    description: "",
    category: "Satsang",
    image: "",
    notify: true,
  });
  const [errors, setErrors] = useState<FieldErrors<AdminEventInput>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function update<K extends keyof AdminEventInput>(
    field: K,
    value: AdminEventInput[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "success") setStatus("idle");
  }

  function broadcastMessage(result: BroadcastResult | null): string {
    if (!result || result.provider === "none") {
      return "Member alerts are not configured yet.";
    }
    if (result.provider === "webhook") {
      return result.queued
        ? "The member alert is queued to the notification webhook."
        : "The member alert could not be queued.";
    }
    if (result.sent > 0) {
      return `Alerts sent to ${result.sent} member${
        result.sent === 1 ? "" : "s"
      } by SMS and WhatsApp.`;
    }
    return "No member alerts were sent.";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validation = validateAdminEvent(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("saving");

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        event?: AshramEvent;
        broadcast?: BroadcastResult;
        error?: string;
        errors?: FieldErrors<AdminEventInput>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "The event could not be published.");
      }

      setStatus("success");
      setMessage(
        `${result.event?.title ?? "Event"} is live on the calendar. ${broadcastMessage(
          result.broadcast ?? null,
        )}`,
      );
      setValues((current) => ({ ...current, title: "", description: "" }));
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error
          ? caught.message
          : "The event could not be published.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start gap-3 border-b border-maroon/10 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-gold">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl">Publish an event</h2>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-soft">
            It appears on the public calendar immediately and can alert opted-in
            members.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="admin-event-title" className={labelClass}>
            Event title <span className="text-maroon/45">*</span>
          </label>
          <input
            id="admin-event-title"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
            className={inputClass}
            placeholder="Kartika Pournami Satsang"
          />
          {errors.title ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.title}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-event-date" className={labelClass}>
              Start date <span className="text-maroon/45">*</span>
            </label>
            <input
              id="admin-event-date"
              type="date"
              value={values.date}
              onChange={(event) => update("date", event.target.value)}
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
            <label htmlFor="admin-event-end-date" className={labelClass}>
              End date <span className="text-ink-soft/45">(optional)</span>
            </label>
            <input
              id="admin-event-end-date"
              type="date"
              value={values.endDate ?? ""}
              onChange={(event) => update("endDate", event.target.value)}
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
            <label htmlFor="admin-event-location" className={labelClass}>
              Location <span className="text-maroon/45">*</span>
            </label>
            <input
              id="admin-event-location"
              value={values.location}
              onChange={(event) => update("location", event.target.value)}
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
            <label htmlFor="admin-event-category" className={labelClass}>
              Category
            </label>
            <select
              id="admin-event-category"
              value={values.category}
              onChange={(event) =>
                update("category", event.target.value as AdminEventInput["category"])
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
          <label htmlFor="admin-event-description" className={labelClass}>
            Description <span className="text-maroon/45">*</span>
          </label>
          <textarea
            id="admin-event-description"
            rows={4}
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            aria-invalid={Boolean(errors.description)}
            className={inputClass}
            placeholder="What will happen, who is invited, and what should devotees bring?"
          />
          {errors.description ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.description}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="admin-event-image" className={labelClass}>
            Photograph <span className="text-ink-soft/45">(optional)</span>
          </label>
          <select
            id="admin-event-image"
            value={values.image ?? ""}
            onChange={(event) => update("image", event.target.value)}
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

        <label className="flex items-start gap-3 rounded-xl border border-gold/25 bg-cream-100/70 px-3.5 py-3">
          <input
            type="checkbox"
            checked={values.notify}
            onChange={(event) => update("notify", event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-maroon/30 accent-maroon"
          />
          <span className="text-[0.74rem] leading-relaxed text-ink-soft">
            <span className="flex items-center gap-1.5 font-semibold text-maroon">
              <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
              Alert opted-in members
            </span>
            Send the new event by SMS and WhatsApp to devotees who subscribed.
          </span>
        </label>

        {message ? (
          <div
            role="status"
            className={`flex gap-2.5 rounded-xl border px-3.5 py-3 text-[0.75rem] leading-relaxed ${
              status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{message}</span>
          </div>
        ) : null}

        <Button type="submit" disabled={status === "saving"} className="w-full">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Publishing…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Publish event
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
