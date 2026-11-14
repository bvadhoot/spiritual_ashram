"use client";

import { useRef, useState } from "react";
import { ArrowRight, BookOpen, Mail, Phone } from "lucide-react";
import { BookOrderForm } from "@/components/books/book-order-form";
import { Button } from "@/components/ui/button";
import { books } from "@/lib/books";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const coverStyles = [
  "bg-maroon-deep text-cream",
  "bg-maroon text-cream",
  "bg-[#3f2a1d] text-cream",
] as const;

export function BooksCatalog() {
  const [selectedBook, setSelectedBook] = useState(books[0]?.slug ?? "");
  const orderRef = useRef<HTMLDivElement>(null);

  function chooseBook(slug: string) {
    setSelectedBook(slug);
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <article
            key={book.slug}
            className="group flex h-full flex-col rounded-2xl border border-maroon/10 bg-cream p-4 transition-colors duration-300 hover:border-gold/50"
          >
            <div
              className={cn(
                "relative flex aspect-[4/5] flex-col overflow-hidden rounded-xl border border-gold/25 p-5",
                coverStyles[index % coverStyles.length],
              )}
            >
              <div
                className="mandala-field absolute inset-0 opacity-30"
                aria-hidden="true"
              />
              <div
                className="absolute inset-2.5 rounded-lg border border-gold/25"
                aria-hidden="true"
              />
              <BookOpen className="relative h-5 w-5 text-gold" aria-hidden="true" />
              <p className="relative mt-6 text-[0.55rem] font-semibold tracking-[0.22em] text-gold uppercase">
                {[book.language, book.form].filter(Boolean).join(" · ")}
              </p>
              <h3 className="relative mt-2 font-serif text-[1.35rem] leading-[1.2] text-cream">
                {book.title}
              </h3>
              <p className="relative mt-auto pt-6 text-[0.58rem] tracking-[0.18em] text-cream/55 uppercase">
                Poojya Sri Dr. Basavalinga Avadhoota
              </p>
            </div>

            <p className="mt-4 flex-1 text-[0.8rem] leading-[1.8] text-ink-soft">
              {book.description}
            </p>
            <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.12em] text-gold uppercase">
              Price confirmed by the office
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => chooseBook(book.slug)}
            >
              Request this book
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
          </article>
        ))}
      </div>

      <div
        ref={orderRef}
        id="book-order"
        className="mt-16 scroll-mt-28 overflow-hidden rounded-3xl border border-gold/30 bg-cream-100/60"
      >
        <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative overflow-hidden bg-maroon-deep p-7 text-cream sm:p-9">
            <div
              className="pointer-events-none absolute -right-8 -bottom-16 font-serif text-[13rem] leading-none text-gold/[0.05] select-none"
              aria-hidden="true"
            >
              ॐ
            </div>
            <div className="relative">
              <p className="text-[0.62rem] font-semibold tracking-[0.24em] text-gold uppercase">
                Order a Book
              </p>
              <h2 className="mt-3 font-serif text-[2rem] leading-[1.15] text-cream">
                Request Your Copy
              </h2>
              <p className="mt-4 text-[0.84rem] leading-[1.85] text-cream/65">
                Tell us which title you would like and where to send it. The
                ashram office will confirm availability, price and dispatch
                personally.
              </p>

              <ul className="mt-6 space-y-3 text-[0.78rem] text-cream/65">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  No payment is collected on this website.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  Prices and postage are confirmed before dispatch.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  Payment is completed by UPI or bank transfer.
                </li>
              </ul>

              <div className="mt-7 space-y-2 border-t border-cream/10 pt-5 text-[0.76rem]">
                <a
                  href={`tel:${site.phones[0].href}`}
                  className="flex items-center gap-2 text-cream/75 transition-colors hover:text-gold"
                >
                  <Phone className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
                  {site.phones[0].label}
                </a>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Book enquiry")}`}
                  className="flex items-center gap-2 break-all text-cream/75 transition-colors hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
                  {site.email}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <BookOrderForm initialBook={selectedBook} />
          </div>
        </div>
      </div>
    </>
  );
}
