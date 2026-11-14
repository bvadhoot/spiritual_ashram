import { books } from "@/lib/books";
import { site } from "@/lib/site";

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: FieldErrors<T> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,18}$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export function validateContact(input: unknown): ValidationResult<ContactData> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const data: ContactData = {
    name: text(record.name).slice(0, 80),
    email: text(record.email).toLowerCase().slice(0, 160),
    subject: text(record.subject).slice(0, 120),
    message: text(record.message).slice(0, 1200),
  };

  const errors: FieldErrors<ContactData> = {};

  if (data.name.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  }
  if (!isEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (data.subject.length < 3) {
    errors.subject = "Please add a short subject.";
  }
  if (data.message.length < 10) {
    errors.message = "Please write at least 10 characters so we can help.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export interface DonationRequest {
  amount: number;
  designation: string;
  name: string;
  email: string;
  phone: string;
  recurring: boolean;
  updatesOptIn: boolean;
}

export function validateDonation(input: unknown): ValidationResult<DonationRequest> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const rawAmount =
    typeof record.amount === "string" ? Number(record.amount) : record.amount;
  const amount =
    typeof rawAmount === "number" && Number.isFinite(rawAmount)
      ? Math.round(rawAmount)
      : 0;

  const data: DonationRequest = {
    amount,
    designation: text(record.designation) || site.donation.designations[0],
    name: text(record.name).slice(0, 80),
    email: text(record.email).toLowerCase().slice(0, 160),
    phone: text(record.phone).slice(0, 20),
    recurring: record.recurring === true,
    updatesOptIn: record.updatesOptIn === true,
  };

  const errors: FieldErrors<DonationRequest> = {};

  if (amount < site.donation.min) {
    errors.amount = `Please give at least ₹${site.donation.min.toLocaleString("en-IN")}.`;
  } else if (amount > site.donation.max) {
    errors.amount = `For gifts above ₹${site.donation.max.toLocaleString(
      "en-IN",
    )}, please contact the ashram office directly.`;
  }

  if (data.name.length < 2) {
    errors.name = "Please enter the name for the receipt.";
  }
  if (data.email && !isEmail(data.email)) {
    errors.email = "Please enter a valid email address, or leave it blank.";
  }
  if (
    !(site.donation.designations as readonly string[]).includes(data.designation)
  ) {
    errors.designation = "Please choose a seva.";
  }
  if (!data.phone) {
    errors.phone =
      "Please enter a phone number so we can send your receipt by SMS and WhatsApp.";
  } else if (!PHONE_PATTERN.test(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export interface MemberSignupData {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export function validateMemberSignup(
  input: unknown,
): ValidationResult<MemberSignupData> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const data: MemberSignupData = {
    name: text(record.name).slice(0, 80),
    phone: text(record.phone).slice(0, 20),
    email: text(record.email).toLowerCase().slice(0, 160),
    consent: record.consent === true,
  };

  const errors: FieldErrors<MemberSignupData> = {};

  if (data.name.length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!data.phone) {
    errors.phone = "Please enter a phone number for SMS and WhatsApp updates.";
  } else if (!PHONE_PATTERN.test(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (data.email && !isEmail(data.email)) {
    errors.email = "Please enter a valid email address, or leave it blank.";
  }
  if (!data.consent) {
    errors.consent = "Please agree to receive ashram updates.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export interface BookOrderData {
  book: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

export function validateBookOrder(
  input: unknown,
): ValidationResult<BookOrderData> {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const rawQuantity =
    typeof record.quantity === "string" ? Number(record.quantity) : record.quantity;
  const quantity =
    typeof rawQuantity === "number" && Number.isFinite(rawQuantity)
      ? Math.round(rawQuantity)
      : 0;

  const data: BookOrderData = {
    book: text(record.book).slice(0, 80),
    quantity,
    name: text(record.name).slice(0, 80),
    email: text(record.email).toLowerCase().slice(0, 160),
    phone: text(record.phone).slice(0, 20),
    address: text(record.address).slice(0, 300),
    city: text(record.city).slice(0, 80),
    state: text(record.state).slice(0, 80),
    pincode: text(record.pincode).replace(/\s+/g, "").slice(0, 6),
    notes: text(record.notes).slice(0, 500),
  };

  const errors: FieldErrors<BookOrderData> = {};

  if (!books.some((book) => book.slug === data.book)) {
    errors.book = "Please choose a book from the list.";
  }
  if (data.quantity < 1 || data.quantity > 10) {
    errors.quantity = "Please request between 1 and 10 copies.";
  }
  if (data.name.length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!isEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.phone) {
    errors.phone = "Please enter a phone number for delivery.";
  } else if (!PHONE_PATTERN.test(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (data.address.length < 8) {
    errors.address = "Please enter the full postal address.";
  }
  if (data.city.length < 2) {
    errors.city = "Please enter your city or town.";
  }
  if (data.state.length < 2) {
    errors.state = "Please enter your state.";
  }
  if (!/^[1-9][0-9]{5}$/.test(data.pincode)) {
    errors.pincode = "Please enter a valid six-digit PIN code.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export function validateHoneypot(input: unknown): boolean {
  if (typeof input !== "object" || input === null) return true;
  const value = (input as Record<string, unknown>).website;
  return typeof value !== "string" || value.trim() === "";
}
