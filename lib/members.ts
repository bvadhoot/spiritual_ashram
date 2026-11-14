import { randomUUID } from "node:crypto";
import { readPrivateJson, writePrivateJson } from "@/lib/storage";
import { normalizePhone } from "@/lib/phone";

const MEMBERS_FILE = "members.json";

export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: "donation" | "signup";
  consentAt: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface MemberInput {
  name: string;
  phone: string;
  email?: string;
  source: Member["source"];
}

async function readMembers(): Promise<Member[]> {
  return readPrivateJson<Member[]>(MEMBERS_FILE, []);
}

export async function getMembers(): Promise<Member[]> {
  const members = await readMembers();
  const seen = new Set<string>();
  const active: Member[] = [];

  for (const member of members) {
    const phone = normalizePhone(member.phone);
    if (!phone || !member.active || seen.has(phone)) continue;
    seen.add(phone);
    active.push({ ...member, phone });
  }

  return active;
}

export async function getMemberCount(): Promise<number> {
  return (await getMembers()).length;
}

/**
 * Create or refresh a member. Donation receipts are transactional; event
 * updates are only stored when the donor explicitly opts in.
 */
export async function upsertMember(input: MemberInput): Promise<Member> {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new Error("A valid phone number is required.");

  const members = await readMembers();
  const now = new Date().toISOString();
  const existing = members.find(
    (member) => normalizePhone(member.phone) === phone,
  );

  if (existing) {
    existing.name = input.name || existing.name;
    existing.phone = phone;
    existing.email = input.email || existing.email;
    existing.source = input.source;
    existing.active = true;
    existing.updatedAt = now;
    await writePrivateJson(MEMBERS_FILE, members);
    return existing;
  }

  const member: Member = {
    id: randomUUID(),
    name: input.name,
    phone,
    email: input.email || undefined,
    source: input.source,
    consentAt: now,
    createdAt: now,
    updatedAt: now,
    active: true,
  };

  await writePrivateJson(MEMBERS_FILE, [...members, member]);
  return member;
}
