"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  validateContact,
  type ContactData,
  type FieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { OmMark } from "@/components/ui/om-mark";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-100";

const labelClass =
  "mb-2 block text-[0.72rem] font-semibold tracking-[0.1em] text-maroon uppercase";

export function ContactForm() {
  const formId = useId().replace(/:/g, "");
  const [values, setValues] = useState<ContactData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors<ContactData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [reference, setReference] = useState("");
  const [generalError, setGeneralError] = useState("");

  const fieldId = (field: string) => `${formId}-${field}`;

  function update(field: keyof ContactData, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function focusFirstError(nextErrors: FieldErrors<ContactData>) {
    const order: Array<keyof ContactData> = ["name", "email", "subject", "message"];
    const first = order.find((field) => nextErrors[field]);
    if (!first) return;
    window.requestAnimationFrame(() => {
      document.getElementById(fieldId(first))?.focus();
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError("");

    const validation = validateContact(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      focusFirstError(validation.errors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, website }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        errors?: FieldErrors<ContactData>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(
          result.error ??
            "We could not send your message. Please try again or email the ashram.",
        );
      }

      setReference(result.reference ?? "");
      setStatus("success");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "We could not send your message. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-8 text-center" role="status">
        <OmMark size="lg" variant="solid" />
        <CheckCircle2 className="mt-5 h-7 w-7 text-emerald-700" aria-hidden="true" />
        <h3 className="mt-3 text-2xl">Your message has been received</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Thank you for writing to the ashram. Someone from the office will reply
          as soon as possible — usually within a few days.
        </p>
        {reference ? (
          <p className="mt-5 rounded-xl border border-gold/30 bg-cream-100 px-4 py-3 font-mono text-xs text-maroon">
            Reference: {reference}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="mt-7"
          onClick={() => {
            setStatus("idle");
            setReference("");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className={labelClass}>
            Your name <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId("name")}-error` : undefined}
            onChange={(event) => update("name", event.target.value)}
            className={inputClass}
            placeholder="How may we address you?"
          />
          {errors.name ? (
            <p id={`${fieldId("name")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("email")} className={labelClass}>
            Email address <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p id={`${fieldId("email")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("subject")} className={labelClass}>
          Subject <span className="text-maroon/45">*</span>
        </label>
        <input
          id={fieldId("subject")}
          name="subject"
          type="text"
          required
          value={values.subject}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? `${fieldId("subject")}-error` : undefined}
          onChange={(event) => update("subject", event.target.value)}
          className={inputClass}
          placeholder="Visiting the ashram, a seva enquiry, a request…"
        />
        {errors.subject ? (
          <p id={`${fieldId("subject")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={fieldId("message")} className={labelClass}>
            Message <span className="text-maroon/45">*</span>
          </label>
          <span
            className={cn(
              "text-[0.65rem] tabular-nums",
              values.message.length > 1100 ? "text-amber-700" : "text-ink-soft/45",
            )}
            aria-hidden="true"
          >
            {values.message.length}/1200
          </span>
        </div>
        <textarea
          id={fieldId("message")}
          name="message"
          required
          rows={6}
          maxLength={1200}
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${fieldId("message")}-error` : `${fieldId("message")}-hint`}
          onChange={(event) => update("message", event.target.value)}
          className={cn(inputClass, "min-h-36 resize-y")}
          placeholder="Tell us how we can help…"
        />
        {errors.message ? (
          <p id={`${fieldId("message")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
            {errors.message}
          </p>
        ) : (
          <p id={`${fieldId("message")}-hint`} className="mt-1.5 text-[0.68rem] text-ink-soft/55">
            Please avoid sharing sensitive personal or medical information.
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, visible to bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {generalError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{generalError}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send message
            </>
          )}
        </Button>
        <p className="text-[0.65rem] leading-relaxed text-ink-soft/55">
          We use your details only to reply. Read our{" "}
          <Link
            href="/privacy"
            className="underline decoration-gold/60 underline-offset-2 hover:text-maroon"
          >
            privacy note
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
