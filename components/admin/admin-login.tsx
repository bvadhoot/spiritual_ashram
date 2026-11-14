"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OmMark } from "@/components/ui/om-mark";

const inputClass =
  "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-ink shadow-[0_2px_8px_-6px_rgba(74,28,28,0.3)] transition placeholder:text-ink-soft/45 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none";

const labelClass =
  "mb-2 block text-[0.7rem] font-semibold tracking-[0.1em] text-maroon uppercase";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The email or password is incorrect.");
      }

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The email or password is incorrect.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-cream-100/50 py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-md rounded-2xl border border-gold/30 bg-cream p-7 shadow-soft sm:p-9">
          <OmMark size="md" variant="solid" className="mx-auto" />

          <div className="mt-5 text-center">
            <p className="eyebrow">Ashram Office</p>
            <h1 className="mt-2 text-[1.8rem]">Admin Access</h1>
            <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-soft">
              A private space for the ashram office to publish events, upload
              photographs and send devotee updates.
            </p>
          </div>

          {!configured ? (
            <div className="mt-6 rounded-xl border border-gold/30 bg-cream-100 p-4">
              <div className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.1em] text-maroon uppercase">
                <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
                Setup required
              </div>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-ink-soft">
                Add <code className="rounded bg-white px-1">ADMIN_EMAIL</code>,{" "}
                <code className="rounded bg-white px-1">ADMIN_PASSWORD</code> and{" "}
                <code className="rounded bg-white px-1">ADMIN_SESSION_SECRET</code>{" "}
                to the deployment environment, then reload this page.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex text-[0.7rem] font-semibold tracking-[0.1em] text-maroon uppercase underline decoration-gold/60 underline-offset-4"
              >
                Return to the ashram
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-email" className={labelClass}>
                  Office email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  placeholder="Office email address"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className={labelClass}>
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                  placeholder="Admin password"
                />
              </div>

              {error ? (
                <div
                  role="alert"
                  className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[0.75rem] leading-relaxed text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {error}
                </div>
              ) : null}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                    Enter the studio
                  </>
                )}
              </Button>

              <p className="text-center text-[0.65rem] leading-relaxed text-ink-soft/55">
                This area is protected by a signed, HttpOnly session. Never share
                the admin password.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
