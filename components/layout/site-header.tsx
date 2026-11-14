"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, Phone, X } from "lucide-react";
import { DonateButton } from "@/components/donate/donate-button";
import { SiteLogo } from "@/components/ui/site-logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/use-dialog";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDialog(menuOpen, panelRef, closeMenu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-cream/95 backdrop-blur-md transition-shadow duration-300",
        scrolled
          ? "border-maroon/10 shadow-[0_12px_40px_-28px_rgba(74,28,28,0.55)]"
          : "border-transparent",
      )}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 sm:h-20">
        <SiteLogo compact className="min-w-0 shrink" />

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {site.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 xl:text-[0.7rem]",
                  active
                    ? "text-maroon"
                    : "text-ink-soft/80 hover:text-maroon",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300",
                    active ? "w-full" : "w-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`tel:${site.phones[0].href}`}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-maroon/15 text-maroon-soft transition hover:border-gold hover:text-maroon xl:flex"
            aria-label={`Call the ashram on ${site.phones[0].label}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
          </a>

          <DonateButton size="sm" hideLabelOnMobile />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-maroon/15 text-maroon transition hover:border-gold hover:bg-gold-pale/40 lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            ref={panelRef}
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-gold/20 bg-cream px-5 pt-5 pb-7 shadow-[0_30px_60px_-20px_rgba(50,17,17,0.4)] lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="divide-y divide-maroon/8">
                {site.nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between gap-4 py-3.5 text-[1.02rem] transition-colors",
                          active ? "text-maroon" : "text-ink-soft hover:text-maroon",
                        )}
                      >
                        <span className={active ? "font-medium" : undefined}>
                          {item.label}
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4",
                            active ? "text-maroon" : "text-gold",
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-5 flex flex-col gap-3">
              <DonateButton size="md" className="w-full" />
              <a
                href={`tel:${site.phones[0].href}`}
                className="flex items-center justify-center gap-2 rounded-full border border-maroon/15 px-5 py-3 text-xs font-semibold tracking-[0.12em] text-maroon uppercase transition hover:border-gold hover:bg-gold-pale/40"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {site.phones[0].label}
              </a>
            </div>

            <p className="mt-5 text-center text-[0.62rem] tracking-[0.18em] text-ink-soft/55 uppercase">
              ॐ Sri Guru Bhyo Namaha
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
