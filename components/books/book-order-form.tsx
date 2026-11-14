"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";
import { books, getBook } from "@/lib/books";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  validateBookOrder,
  type BookOrderData,
  type FieldErrors,
} from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-100";

const labelClass =
  "mb-2 block text-[0.72rem] font-semibold tracking-[0.1em] text-maroon uppercase";

function emptyValues(book: string): BookOrderData {
  return {
    book,
    quantity: 1,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  };
}

export function BookOrderForm({ initialBook }: { initialBook: string }) {
  const formId = useId().replace(/:/g, "");
  const [values, setValues] = useState<BookOrderData>(() => emptyValues(initialBook));
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors<BookOrderData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [reference, setReference] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    setValues((current) => ({ ...current, book: initialBook }));
    setErrors((current) => ({ ...current, book: undefined }));
  }, [initialBook]);

  const fieldId = (field: string) => `${formId}-${field}`;

  function update<K extends keyof BookOrderData>(
    field: K,
    value: BookOrderData[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function focusFirstError(nextErrors: FieldErrors<BookOrderData>) {
    const order: Array<keyof BookOrderData> = [
      "book",
      "quantity",
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "notes",
    ];
    const first = order.find((field) => nextErrors[field]);
    if (!first) return;
    window.requestAnimationFrame(() => {
      document.getElementById(fieldId(first))?.focus();
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError("");

    const validation = validateBookOrder(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      focusFirstError(validation.errors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/book-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, website }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        errors?: FieldErrors<BookOrderData>;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(
          result.error ??
            "We could not send your book request. Please try again or email the ashram.",
        );
      }

      setReference(result.reference ?? "");
      setStatus("success");
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "We could not send your book request. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    const selected = getBook(values.book);
    const mailSubject = `Book request ${reference} — ${selected?.title ?? "Ashram publication"}`;
    const mailBody = [
      "Hari Om,",
      "",
      `I have requested ${values.quantity} ${values.quantity === 1 ? "copy" : "copies"} of "${selected?.title ?? "an ashram book"}".`,
      `Reference: ${reference}`,
      "",
      "Please confirm price, availability and dispatch.",
      "",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Address: ${values.address}, ${values.city}, ${values.state} ${values.pincode}`,
    ].join("\n");
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    return (
      <div className="flex flex-col items-center py-6 text-center" role="status">
        <OmMark size="lg" variant="solid" />
        <CheckCircle2 className="mt-5 h-7 w-7 text-emerald-700" aria-hidden="true" />
        <h3 className="mt-3 text-2xl">Your book request is received</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Thank you, {values.name}. The ashram office will confirm availability,
          price and dispatch by phone or email. Payment is completed by UPI or
          bank transfer.
        </p>

        <div className="mt-5 w-full max-w-md rounded-xl border border-gold/30 bg-cream-100 px-4 py-4 text-left">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-maroon uppercase">
            Your request
          </p>
          <p className="mt-2 text-sm font-medium text-maroon">
            {values.quantity} × {selected?.title ?? "Ashram publication"}
          </p>
          <p className="mt-1 font-mono text-xs text-ink-soft/70">
            Reference: {reference}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={mailto} variant="outline" size="sm">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email the office
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              setValues(emptyValues(initialBook));
              setReference("");
              setStatus("idle");
            }}
          >
            Request another book
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
        <div>
          <label htmlFor={fieldId("book")} className={labelClass}>
            Choose a book <span className="text-maroon/45">*</span>
          </label>
          <select
            id={fieldId("book")}
            name="book"
            required
            value={values.book}
            aria-invalid={Boolean(errors.book)}
            aria-describedby={errors.book ? `${fieldId("book")}-error` : undefined}
            onChange={(event) => update("book", event.target.value)}
            className={inputClass}
          >
            {books.map((book) => (
              <option key={book.slug} value={book.slug}>
                {book.title}
                {book.language ? ` — ${book.language}` : ""}
              </option>
            ))}
          </select>
          {errors.book ? (
            <p id={`${fieldId("book")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.book}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("quantity")} className={labelClass}>
            Copies <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("quantity")}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={10}
            required
            value={values.quantity}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? `${fieldId("quantity")}-error` : undefined}
            onChange={(event) => update("quantity", Number(event.target.value))}
            className={inputClass}
          />
          {errors.quantity ? (
            <p id={`${fieldId("quantity")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.quantity}
            </p>
          ) : null}
        </div>
      </div>

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
            aria-describedby={errors.phone ? `${fieldId("phone")}-error` : undefined}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
          {errors.phone ? (
            <p id={`${fieldId("phone")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("email")} className={labelClass}>
          Email <span className="text-maroon/45">*</span>
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

      <div>
        <label htmlFor={fieldId("address")} className={labelClass}>
          Postal address <span className="text-maroon/45">*</span>
        </label>
        <textarea
          id={fieldId("address")}
          name="address"
          rows={3}
          required
          value={values.address}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? `${fieldId("address")}-error` : undefined}
          onChange={(event) => update("address", event.target.value)}
          className={cn(inputClass, "min-h-24 resize-y")}
          placeholder="House or building, street, village or locality"
        />
        {errors.address ? (
          <p id={`${fieldId("address")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
            {errors.address}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={fieldId("city")} className={labelClass}>
            City / town <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("city")}
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            value={values.city}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? `${fieldId("city")}-error` : undefined}
            onChange={(event) => update("city", event.target.value)}
            className={inputClass}
          />
          {errors.city ? (
            <p id={`${fieldId("city")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.city}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("state")} className={labelClass}>
            State <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("state")}
            name="state"
            type="text"
            autoComplete="address-level1"
            required
            value={values.state}
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? `${fieldId("state")}-error` : undefined}
            onChange={(event) => update("state", event.target.value)}
            className={inputClass}
          />
          {errors.state ? (
            <p id={`${fieldId("state")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.state}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("pincode")} className={labelClass}>
            PIN code <span className="text-maroon/45">*</span>
          </label>
          <input
            id={fieldId("pincode")}
            name="pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            required
            value={values.pincode}
            aria-invalid={Boolean(errors.pincode)}
            aria-describedby={errors.pincode ? `${fieldId("pincode")}-error` : undefined}
            onChange={(event) => update("pincode", event.target.value)}
            className={inputClass}
            placeholder="500001"
          />
          {errors.pincode ? (
            <p id={`${fieldId("pincode")}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
              {errors.pincode}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("notes")} className={labelClass}>
          Anything else? <span className="text-ink-soft/45">(optional)</span>
        </label>
        <textarea
          id={fieldId("notes")}
          name="notes"
          rows={3}
          maxLength={500}
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
          className={cn(inputClass, "min-h-20 resize-y")}
          placeholder="Language preference, a dedication, or a question about the book"
        />
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
              Send book request
            </>
          )}
        </Button>
        <p className="text-[0.65rem] leading-relaxed text-ink-soft/55">
          We use your details only for this order. Read our{" "}
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
