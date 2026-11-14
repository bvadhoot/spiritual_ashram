"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Phone,
  ReceiptText,
  Send,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { site } from "@/lib/site";
import { cn, formatCurrency } from "@/lib/utils";
import {
  validateDonation,
  type DonationRequest,
  type FieldErrors,
} from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-100";

const labelClass =
  "mb-2 block text-[0.72rem] font-semibold tracking-[0.1em] text-maroon uppercase";

interface DonationValues {
  amount: string;
  designation: string;
  name: string;
  email: string;
  phone: string;
  recurring: boolean;
  updatesOptIn: boolean;
}

interface DonationFormProps {
  initialDesignation?: string;
}

interface RecordedGift {
  amount: number;
  designation: string;
  name: string;
  email: string;
  phone: string;
  recurring: boolean;
  updatesOptIn: boolean;
}

interface DeliveryStatus {
  ok?: boolean;
  queued?: boolean;
  provider?: string;
  error?: string;
}

function donationValues(initialDesignation?: string): DonationValues {
  return {
    amount: String(site.donation.min),
    designation: initialDesignation ?? site.donation.designations[0],
    name: "",
    email: "",
    phone: "",
    recurring: false,
    updatesOptIn: false,
  };
}

export function DonationForm({ initialDesignation }: DonationFormProps) {
  const formId = useId().replace(/:/g, "");
  const [values, setValues] = useState<DonationValues>(() =>
    donationValues(initialDesignation),
  );
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors<DonationRequest>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [reference, setReference] = useState("");
  const [recorded, setRecorded] = useState<RecordedGift | null>(null);
  const [generalError, setGeneralError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{
    sms?: DeliveryStatus;
    whatsapp?: DeliveryStatus;
  } | null>(null);

  const fieldId = (field: string) => `${formId}-${field}`;

  function update<K extends keyof DonationValues>(
    field: K,
    value: DonationValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function focusFirstError(nextErrors: FieldErrors<DonationRequest>) {
    const order: Array<keyof DonationRequest> = [
      "amount",
      "designation",
      "name",
      "email",
      "phone",
      "recurring",
    ];
    const first = order.find((field) => nextErrors[field]);
    if (!first) return;
    window.requestAnimationFrame(() => {
      document.getElementById(fieldId(first))?.focus();
    });
  }

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError("");

    const validation = validateDonation(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      focusFirstError(validation.errors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/donations/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, website }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        errors?: FieldErrors<DonationRequest>;
        notifications?: {
          sms?: DeliveryStatus;
          whatsapp?: DeliveryStatus;
        };
        updatesEnrolled?: boolean;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(
          result.error ??
            "We could not record your offering. Please try again or contact the ashram office.",
        );
      }

      setReference(result.reference ?? "");
      setNotifications(result.notifications ?? null);
      setRecorded(validation.data);
      setStatus("success");
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "We could not record your offering. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success" && recorded) {
    const amountLabel = formatCurrency(recorded.amount);
    const receiptQueued = Boolean(
      notifications?.sms?.ok ||
        notifications?.whatsapp?.ok ||
        notifications?.sms?.queued ||
        notifications?.whatsapp?.queued,
    );
    const upiId = site.donation.giving.upiId;
    const bank = site.donation.giving.bank;
    const hasUpi = Boolean(upiId);
    const hasBank = Boolean(bank.accountNumber);
    const bankText = [
      bank.accountName,
      `Account: ${bank.accountNumber}`,
      `IFSC: ${bank.ifsc}`,
      [bank.bankName, bank.branch].filter(Boolean).join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    const mailSubject = `Donation ${reference} — ${recorded.designation}`;
    const mailBody = [
      "Hari Om,",
      "",
      `I have recorded an offering of ${amountLabel} towards ${recorded.designation}.`,
      `Reference: ${reference}`,
      "",
      "Please share the UPI ID or bank details so I can complete the transfer, and acknowledge my gift when received.",
      "",
      `Name: ${recorded.name}`,
      `Phone: ${recorded.phone}`,
      recorded.email ? `Email: ${recorded.email}` : "",
      recorded.recurring ? "This is intended as a monthly offering." : "",
    ]
      .filter(Boolean)
      .join("\n");
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    return (
      <div role="status" className="space-y-5">
        <div className="text-center">
          <OmMark size="lg" variant="solid" className="mx-auto" />
          <CheckCircle2
            className="mx-auto mt-4 h-7 w-7 text-emerald-700"
            aria-hidden="true"
          />
          <h3 className="mt-3 text-2xl">Your giving request is recorded</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            Thank you, {recorded.name}. Your offering of{" "}
            <strong className="text-maroon">{amountLabel}</strong> towards{" "}
            {recorded.designation} has been noted. Nothing has been charged —
            please complete the transfer using the steps below.
          </p>
          <div className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 rounded-xl border border-gold/30 bg-cream-100 px-4 py-2.5">
            <span className="font-mono text-xs text-maroon">{reference}</span>
            <button
              type="button"
              onClick={() => copyText("reference", reference)}
              className="text-maroon/60 transition-colors hover:text-maroon"
              aria-label="Copy donation reference"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {copied === "reference" ? (
              <span className="text-[0.62rem] text-emerald-700">Copied</span>
            ) : null}
          </div>
          <div
            className={cn(
              "mx-auto mt-4 flex max-w-md items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-[0.72rem] leading-relaxed",
              receiptQueued
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-gold/30 bg-cream-100 text-ink-soft",
            )}
          >
            <Smartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {receiptQueued ? (
                <>
                  Your receipt is queued for <strong>{recorded.phone}</strong> by
                  SMS and WhatsApp.
                </>
              ) : (
                <>
                  The ashram office will send your receipt by SMS and WhatsApp to{" "}
                  <strong>{recorded.phone}</strong>.
                </>
              )}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-maroon/10 bg-cream-100/70 p-5">
          <p className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.18em] text-maroon uppercase">
            <ReceiptText className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Complete your offering
          </p>

          {hasUpi ? (
            <div className="mt-4 rounded-xl border border-maroon/10 bg-white p-4">
              <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.12em] text-gold uppercase">
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                UPI
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-mono text-sm break-all text-maroon">{upiId}</p>
                <button
                  type="button"
                  onClick={() => copyText("upi", upiId)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-1.5 text-[0.65rem] font-semibold text-maroon transition hover:border-gold"
                >
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  {copied === "upi" ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-[0.7rem] leading-relaxed text-ink-soft/70">
                Pay {amountLabel} to this UPI ID from any UPI app. Add the
                reference {reference} in the note if your app allows it.
              </p>
            </div>
          ) : null}

          {hasBank ? (
            <div className="mt-4 rounded-xl border border-maroon/10 bg-white p-4">
              <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.12em] text-gold uppercase">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Bank transfer
              </div>
              <dl className="mt-2 space-y-1.5 text-[0.78rem]">
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-ink-soft/60">Account name</dt>
                  <dd className="text-maroon">{bank.accountName}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-ink-soft/60">Account no.</dt>
                  <dd className="font-mono text-maroon">{bank.accountNumber}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-ink-soft/60">IFSC</dt>
                  <dd className="font-mono text-maroon">{bank.ifsc}</dd>
                </div>
                {bank.bankName ? (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-ink-soft/60">Bank</dt>
                    <dd className="text-maroon">
                      {[bank.bankName, bank.branch].filter(Boolean).join(", ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <button
                type="button"
                onClick={() => copyText("bank", bankText)}
                className="mt-3 flex items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-1.5 text-[0.65rem] font-semibold text-maroon transition hover:border-gold"
              >
                <Copy className="h-3 w-3" aria-hidden="true" />
                {copied === "bank" ? "Copied" : "Copy bank details"}
              </button>
            </div>
          ) : null}

          {!hasUpi && !hasBank ? (
            <div className="mt-4 rounded-xl border border-gold/30 bg-white p-4">
              <p className="text-[0.8rem] leading-[1.8] text-ink-soft">
                The ashram office will share the UPI ID or bank account details
                with you. Please quote reference{" "}
                <span className="font-mono text-maroon">{reference}</span> so your
                gift can be matched and acknowledged.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`tel:${site.phones[0].href}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-maroon/20 px-4 py-2 text-[0.7rem] font-semibold text-maroon transition hover:border-gold"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {site.phones[0].label}
                </a>
                <a
                  href={mailto}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-maroon/20 px-4 py-2 text-[0.7rem] font-semibold text-maroon transition hover:border-gold"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  Email the office
                </a>
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-[0.72rem] leading-relaxed text-ink-soft/70">
            After transferring, send the reference and payment details to the
            office so your offering can be acknowledged and receipted. Contact
            the office directly if you would like an 80G receipt.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button href={mailto} variant="gold" size="sm">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email the payment reference
            </Button>
            <Button href="/contact" variant="outline" size="sm">
              Contact the office
            </Button>
          </div>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-[0.66rem] text-ink-soft/55">
          <Check className="h-3 w-3 text-emerald-700" aria-hidden="true" />
          No card details are collected on this website.
        </p>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setValues(donationValues(initialDesignation));
              setRecorded(null);
              setReference("");
              setNotifications(null);
              setErrors({});
              setStatus("idle");
            }}
            className="text-[0.7rem] font-semibold tracking-[0.1em] text-maroon uppercase underline decoration-gold/50 underline-offset-4 transition hover:decoration-gold"
          >
            Record another offering
          </button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={fieldId("amount")} className={labelClass}>
            Offering amount <span className="text-maroon/45">*</span>
          </label>
          <span className="text-[0.62rem] text-ink-soft/55">
            Starts at {formatCurrency(site.donation.min)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {site.donation.presets.map((preset) => {
            const selected = values.amount === String(preset);
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={selected}
                onClick={() => update("amount", String(preset))}
                className={cn(
                  "rounded-lg border px-2 py-2.5 text-[0.76rem] font-semibold tabular-nums transition-colors",
                  selected
                    ? "border-maroon bg-maroon text-cream"
                    : "border-maroon/15 bg-white text-maroon hover:border-gold hover:bg-gold-pale/30",
                )}
              >
                {formatCurrency(preset)}
              </button>
            );
          })}
        </div>

        <div className="relative mt-3">
          <span
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-maroon/50"
            aria-hidden="true"
          >
            ₹
          </span>
          <input
            id={fieldId("amount")}
            name="amount"
            type="number"
            inputMode="numeric"
            min={site.donation.min}
            max={site.donation.max}
            step={1}
            required
            value={values.amount}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? `${fieldId("amount")}-error` : `${fieldId("amount")}-hint`}
            onChange={(event) => update("amount", event.target.value)}
            className={cn(inputClass, "pl-8")}
            placeholder="Enter an amount"
          />
        </div>
        {errors.amount ? (
          <p id={`${fieldId("amount")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
            {errors.amount}
          </p>
        ) : (
          <p id={`${fieldId("amount")}-hint`} className="mt-1.5 text-[0.65rem] text-ink-soft/55">
            Any amount from {formatCurrency(site.donation.min)}. For larger
            gifts, please contact the office directly.
          </p>
        )}
      </div>

      <div>
        <label htmlFor={fieldId("designation")} className={labelClass}>
          Seva <span className="text-maroon/45">*</span>
        </label>
        <select
          id={fieldId("designation")}
          name="designation"
          required
          value={values.designation}
          aria-invalid={Boolean(errors.designation)}
          aria-describedby={errors.designation ? `${fieldId("designation")}-error` : undefined}
          onChange={(event) => update("designation", event.target.value)}
          className={inputClass}
        >
          {site.donation.designations.map((designation) => (
            <option key={designation} value={designation}>
              {designation}
            </option>
          ))}
        </select>
        {errors.designation ? (
          <p id={`${fieldId("designation")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
            {errors.designation}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className={labelClass}>
            Name for the receipt <span className="text-maroon/45">*</span>
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
            placeholder="Full name"
          />
          {errors.name ? (
            <p id={`${fieldId("name")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("email")} className={labelClass}>
            Email <span className="text-ink-soft/45">(optional)</span>
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
            placeholder="you@example.com (optional)"
          />
          {errors.email ? (
            <p id={`${fieldId("email")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("phone")} className={labelClass}>
            Phone <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={
              errors.phone
                ? `${fieldId("phone")}-error`
                : `${fieldId("phone")}-hint`
            }
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
          {errors.phone ? (
            <p id={`${fieldId("phone")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.phone}
            </p>
          ) : (
            <p id={`${fieldId("phone")}-hint`} className="mt-1.5 text-[0.65rem] text-ink-soft/55">
              Your receipt will be sent here by SMS and WhatsApp.
            </p>
          )}
        </div>

      </div>

      <label className="flex items-start gap-3 rounded-xl border border-maroon/10 bg-cream-100/60 px-4 py-3">
        <input
          type="checkbox"
          checked={values.recurring}
          onChange={(event) => update("recurring", event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-maroon/30 accent-maroon"
        />
        <span className="text-[0.75rem] leading-relaxed text-ink-soft">
          I would like this to be a monthly offering. The office will help set it
          up.
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-maroon/10 bg-cream-100/60 px-4 py-3">
        <input
          type="checkbox"
          checked={values.updatesOptIn}
          onChange={(event) => update("updatesOptIn", event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-maroon/30 accent-maroon"
        />
        <span className="text-[0.75rem] leading-relaxed text-ink-soft">
          Send me new event and satsang updates on SMS and WhatsApp. You can opt
          out at any time.
        </span>
      </label>

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
              Recording…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Record my offering
            </>
          )}
        </Button>
        <p className="text-[0.65rem] leading-relaxed text-ink-soft/55">
          UPI or bank transfer only. Read our{" "}
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
