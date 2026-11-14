/**
 * Normalize Indian and international phone numbers to a compact E.164 form.
 * The ashram's audience is primarily in India, so a bare 10-digit number is
 * treated as +91.
 */
export function normalizePhone(input: string): string {
  const cleaned = input.trim().replace(/[\s().-]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+")) {
    return `+${cleaned.slice(1).replace(/\D/g, "")}`;
  }

  const digits = cleaned.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

export function maskPhone(input: string): string {
  const phone = normalizePhone(input);
  if (phone.length <= 5) return phone;
  return `${phone.slice(0, 3)}••••${phone.slice(-4)}`;
}
