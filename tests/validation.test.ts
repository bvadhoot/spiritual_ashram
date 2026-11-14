import { describe, expect, it } from "vitest";
import {
  isEmail,
  validateContact,
  validateDonation,
  validateHoneypot,
  validateBookOrder,
  validateMemberSignup,
} from "@/lib/validation";

describe("isEmail", () => {
  it("accepts normal addresses and rejects malformed ones", () => {
    expect(isEmail("seeker@ashram.org")).toBe(true);
    expect(isEmail("seeker+news@ashram.co.in")).toBe(true);
    expect(isEmail("seeker@ashram")).toBe(false);
    expect(isEmail("not-an-email")).toBe(false);
    expect(isEmail("a@b.c")).toBe(false);
  });
});

describe("validateContact", () => {
  it("normalises whitespace and email case", () => {
    const result = validateContact({
      name: "  Anu   Rao ",
      email: " ANU@EXAMPLE.COM ",
      subject: "  Visiting   the ashram ",
      message: "  I would   like to visit next month.  ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.name).toBe("Anu Rao");
    expect(result.data.email).toBe("anu@example.com");
    expect(result.data.subject).toBe("Visiting the ashram");
    expect(result.data.message).toBe("I would like to visit next month.");
  });

  it("reports each invalid field", () => {
    const result = validateContact({
      name: "A",
      email: "bad",
      subject: "",
      message: "short",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.subject).toBeTruthy();
    expect(result.errors.message).toBeTruthy();
  });

  it("rejects non-object input", () => {
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact("hello").ok).toBe(false);
  });
});

describe("validateDonation", () => {
  const valid = {
    amount: 1100,
    designation: "Annadanam Seva",
    name: "Anu Rao",
    email: "anu@example.com",
    phone: "+91 98765 43210",
    recurring: false,
    updatesOptIn: true,
  };

  it("accepts a valid donation without a PAN", () => {
    const result = validateDonation(valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.amount).toBe(1100);
    expect(result.data.phone).toBe("+91 98765 43210");
  });

  it("enforces the minimum and maximum gift", () => {
    expect(validateDonation({ ...valid, amount: 99 }).ok).toBe(false);
    expect(validateDonation({ ...valid, amount: 500001 }).ok).toBe(false);
    expect(validateDonation({ ...valid, amount: 100 }).ok).toBe(true);
    expect(validateDonation({ ...valid, amount: 500000 }).ok).toBe(true);
  });

  it("rejects an unknown designation", () => {
    const result = validateDonation({
      ...valid,
      designation: "Something Else",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.designation).toBeTruthy();
  });

  it("rejects invalid email and phone values", () => {
    const result = validateDonation({
      ...valid,
      email: "nope",
      phone: "12",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.phone).toBeTruthy();
  });

  it("treats string amounts as numbers", () => {
    const result = validateDonation({ ...valid, amount: "2500" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.amount).toBe(2500);
  });

  it("requires a phone number for the SMS/WhatsApp receipt", () => {
    const result = validateDonation({ ...valid, phone: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.phone).toBeTruthy();
  });

  it("allows an optional email address", () => {
    const result = validateDonation({ ...valid, email: "" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.email).toBe("");
  });
});

describe("validateMemberSignup", () => {
  const valid = {
    name: "Anu Rao",
    phone: "+91 98765 43210",
    email: "",
    consent: true,
  };

  it("accepts an opted-in member with a phone number", () => {
    expect(validateMemberSignup(valid).ok).toBe(true);
  });

  it("requires consent and a valid phone", () => {
    const result = validateMemberSignup({
      ...valid,
      phone: "12",
      consent: false,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.phone).toBeTruthy();
    expect(result.errors.consent).toBeTruthy();
  });

  it("accepts an empty optional email", () => {
    expect(validateMemberSignup({ ...valid, email: "" }).ok).toBe(true);
  });
});

describe("validateBookOrder", () => {
  const valid = {
    book: "anubhavaamrutha",
    quantity: 2,
    name: "Anu Rao",
    email: "anu@example.com",
    phone: "+91 98765 43210",
    address: "12 Temple Road, Kuppanagar",
    city: "Jharasangam",
    state: "Telangana",
    pincode: "502246",
    notes: "",
  };

  it("accepts a valid order and trims the pincode", () => {
    const result = validateBookOrder({ ...valid, pincode: " 502 246 " });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.quantity).toBe(2);
    expect(result.data.pincode).toBe("502246");
  });

  it("rejects an unknown book and an invalid quantity", () => {
    const bookResult = validateBookOrder({ ...valid, book: "unknown" });
    expect(bookResult.ok).toBe(false);
    if (!bookResult.ok) expect(bookResult.errors.book).toBeTruthy();

    expect(validateBookOrder({ ...valid, quantity: 0 }).ok).toBe(false);
    expect(validateBookOrder({ ...valid, quantity: 11 }).ok).toBe(false);
  });

  it("requires a phone, address and valid PIN code", () => {
    const result = validateBookOrder({
      ...valid,
      phone: "",
      address: "short",
      pincode: "0123",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.phone).toBeTruthy();
    expect(result.errors.address).toBeTruthy();
    expect(result.errors.pincode).toBeTruthy();
  });
});

describe("validateHoneypot", () => {
  it("allows an empty or missing honeypot", () => {
    expect(validateHoneypot({})).toBe(true);
    expect(validateHoneypot({ website: "  " })).toBe(true);
  });

  it("rejects a filled honeypot", () => {
    expect(validateHoneypot({ website: "https://spam.example" })).toBe(false);
  });
});
