"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Loader2,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  validateAlertRecipient,
  type AdminRecipientInput,
} from "@/lib/admin-validation";
import type { AlertChannel, AlertRecipient } from "@/lib/alert-recipients";
import type { FieldErrors } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500";

const labelClass =
  "mb-1.5 block text-[0.66rem] font-semibold tracking-[0.1em] text-maroon uppercase";

const CHANNEL_LABELS: Record<AlertChannel, string> = {
  sms: "SMS",
  whatsapp: "WhatsApp",
  both: "SMS + WhatsApp",
};

interface Props {
  recipients: AlertRecipient[];
  provider: string;
}

export function AdminAlertRecipients({ recipients, provider }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<AdminRecipientInput>({
    name: "",
    phone: "",
    channel: "both",
  });
  const [errors, setErrors] = useState<FieldErrors<AdminRecipientInput>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function update<K extends keyof AdminRecipientInput>(
    field: K,
    value: AdminRecipientInput[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validation = validateAlertRecipient(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const response = await fetch("/api/admin/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors<AdminRecipientInput>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "The number could not be added.");
      }

      setStatus("success");
      setMessage(`${validation.data.name} will now receive event alerts.`);
      setValues({ name: "", phone: "", channel: "both" });
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error ? caught.message : "The number could not be added.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggle(recipient: AlertRecipient) {
    setBusyId(recipient.id);
    setMessage("");

    try {
      const response = await fetch("/api/admin/recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recipient.id, active: !recipient.active }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The number could not be changed.");
      }
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error
          ? caught.message
          : "The number could not be changed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function remove(recipient: AlertRecipient) {
    const confirmed = window.confirm(
      `Stop sending event alerts to ${recipient.name} (${recipient.phone})?`,
    );
    if (!confirmed) return;

    setBusyId(recipient.id);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/recipients?id=${encodeURIComponent(recipient.id)}`,
        { method: "DELETE" },
      );
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The number could not be removed.");
      }
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error
          ? caught.message
          : "The number could not be removed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = recipients.filter((item) => item.active).length;

  return (
    <section className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3 border-b border-maroon/10 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-gold">
          <BellRing className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl">Alert phone numbers</h2>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-soft">
            Every number on this list receives an SMS or WhatsApp message
            whenever an event is published. Add as many as the office needs.
          </p>
        </div>
      </div>

      {provider === "Not configured" ? (
        <div className="mt-4 flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-[0.74rem] leading-relaxed text-amber-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Numbers are saved, but no message will actually be delivered yet.
            Configure Twilio or a{" "}
            <code className="rounded bg-white px-1">
              NOTIFICATION_WEBHOOK_URL
            </code>{" "}
            first.
          </p>
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[0.74rem] text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Delivery via {provider} · {activeCount} of {recipients.length} number
          {recipients.length === 1 ? "" : "s"} active
        </p>
      )}

      <form onSubmit={handleAdd} className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="alert-name" className={labelClass}>
            Label <span className="text-maroon/45">*</span>
          </label>
          <input
            id="alert-name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            placeholder="Ashram office"
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="alert-phone" className={labelClass}>
            Phone number <span className="text-maroon/45">*</span>
          </label>
          <input
            id="alert-phone"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
            inputMode="tel"
            placeholder="+91 98765 43210"
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="alert-channel" className={labelClass}>
            Delivery
          </label>
          <select
            id="alert-channel"
            value={values.channel}
            onChange={(event) =>
              update("channel", event.target.value as AlertChannel)
            }
            className={inputClass}
          >
            <option value="both">SMS + WhatsApp</option>
            <option value="sms">SMS only</option>
            <option value="whatsapp">WhatsApp only</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Adding…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add number
              </>
            )}
          </Button>
        </div>
      </form>

      {message ? (
        <div
          role="status"
          className={`mt-4 flex gap-2.5 rounded-xl border px-3.5 py-3 text-[0.75rem] leading-relaxed ${
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

      <div className="mt-5">
        {recipients.length === 0 ? (
          <p className="rounded-xl border border-dashed border-maroon/15 py-8 text-center text-[0.8rem] text-ink-soft">
            No alert numbers yet. Add the office phone above to start receiving
            event alerts.
          </p>
        ) : (
          <ul className="divide-y divide-maroon/10">
            {recipients.map((recipient) => (
              <li
                key={recipient.id}
                className="flex flex-wrap items-center gap-3 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-maroon">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[0.98rem] text-maroon">
                    {recipient.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.7rem] text-ink-soft">
                    {recipient.phone}
                  </p>
                </div>

                <span className="rounded-full border border-maroon/15 bg-cream-100 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.08em] text-maroon uppercase">
                  {CHANNEL_LABELS[recipient.channel]}
                </span>

                <button
                  type="button"
                  onClick={() => toggle(recipient)}
                  disabled={busyId === recipient.id}
                  aria-pressed={recipient.active}
                  className={`rounded-full border px-3 py-1 text-[0.62rem] font-semibold tracking-[0.08em] uppercase transition disabled:opacity-60 ${
                    recipient.active
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-maroon/20 bg-white text-ink-soft hover:border-gold"
                  }`}
                >
                  {recipient.active ? "Active" : "Paused"}
                </button>

                <button
                  type="button"
                  onClick={() => remove(recipient)}
                  disabled={busyId === recipient.id}
                  aria-label={`Remove ${recipient.name} from the alert list`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-maroon/15 text-maroon/70 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
                >
                  {busyId === recipient.id ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
