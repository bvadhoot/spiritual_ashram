"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  validateMemberSignup,
  type FieldErrors,
  type MemberSignupData,
} from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500";

const labelClass =
  "mb-1.5 block text-[0.64rem] font-semibold tracking-[0.1em] text-maroon uppercase";

export function MemberSignupForm() {
  const [values, setValues] = useState<MemberSignupData>({
    name: "",
    phone: "",
    email: "",
    consent: false,
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors<MemberSignupData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function update<K extends keyof MemberSignupData>(
    field: K,
    value: MemberSignupData[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validation = validateMemberSignup(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, website }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors<MemberSignupData>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(
          result.error ?? "We could not add you to the update list.",
        );
      }

      setStatus("success");
      setMessage(
        "You are on the ashram update list. New satsangs and festivals will reach you by SMS and WhatsApp.",
      );
      setValues({ name: "", phone: "", email: "", consent: false });
    } catch (caught) {
      setStatus("error");
      setMessage(
        caught instanceof Error
          ? caught.message
          : "We could not add you to the update list.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex h-full flex-col justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 sm:p-8"
      >
        <CheckCircle2 className="h-8 w-8 text-emerald-700" aria-hidden="true" />
        <h3 className="mt-4 text-2xl text-emerald-950">You are on the list</h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-emerald-900/80">
          {message}
        </p>
        <p className="mt-4 text-[0.68rem] leading-relaxed text-emerald-900/60">
          Only opted-in devotees are messaged. Reply STOP to any message to leave
          the list, or contact the office at any time.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cream/20 bg-cream p-5 text-ink shadow-soft sm:p-6"
    >
      <div className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.16em] text-maroon uppercase">
        <BellRing className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
        Join the update list
      </div>
      <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ink-soft">
        Phone number is required. Email is optional.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="member-name" className={labelClass}>
            Name <span className="text-maroon/45">*</span>
          </label>
          <input
            id="member-name"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            placeholder="Your name"
          />
          {errors.name ? (
            <p className="mt-1 text-[0.68rem] text-red-700" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="member-phone" className={labelClass}>
            WhatsApp / phone <span className="text-maroon/45">*</span>
          </label>
          <input
            id="member-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
          {errors.phone ? (
            <p className="mt-1 text-[0.68rem] text-red-700" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="member-email" className={labelClass}>
          Email <span className="text-ink-soft/45">(optional)</span>
        </label>
        <input
          id="member-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          className={inputClass}
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-[0.68rem] text-red-700" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <label className="mt-3 flex items-start gap-2.5 rounded-xl border border-maroon/10 bg-cream-100/70 px-3.5 py-3">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(event) => update("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          className="mt-0.5 h-4 w-4 rounded border-maroon/30 accent-maroon"
        />
        <span className="text-[0.7rem] leading-relaxed text-ink-soft">
          I agree to receive new event and satsang updates by SMS and WhatsApp. I
          can opt out at any time. See the{" "}
          <Link
            href="/privacy"
            className="text-maroon underline decoration-gold/60 underline-offset-2"
          >
            privacy note
          </Link>
          .
        </span>
      </label>
      {errors.consent ? (
        <p className="mt-1 text-[0.68rem] text-red-700" role="alert">
          {errors.consent}
        </p>
      ) : null}

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="member-website">Website</label>
        <input
          id="member-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {message ? (
        <div
          role="alert"
          className="mt-3 flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[0.72rem] leading-relaxed text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {message}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-full"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Joining…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send me ashram updates
          </>
        )}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.62rem] leading-relaxed text-ink-soft/55">
        <MessageCircle className="h-3 w-3" aria-hidden="true" />
        Delivered by SMS and WhatsApp. Your number stays private.
      </p>
    </form>
  );
}
