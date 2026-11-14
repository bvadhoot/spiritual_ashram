import Image from "next/image";
import { CalendarRange, MapPin } from "lucide-react";
import {
  formatEventDateRange,
  getEventDateParts,
  type AshramEvent,
} from "@/lib/events";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: AshramEvent;
  variant?: "compact" | "featured";
  className?: string;
}

const categoryStyles: Record<AshramEvent["category"], string> = {
  Satsang: "bg-gold-pale/60 text-maroon",
  Sadhana: "bg-emerald-50 text-emerald-900",
  Seva: "bg-orange-50 text-orange-900",
  Festival: "bg-rose-50 text-rose-900",
};

export function EventCard({ event, variant = "compact", className }: EventCardProps) {
  const date = getEventDateParts(event.date);
  const multiDay = Boolean(event.endDate);

  if (variant === "featured") {
    return (
      <article
        id={event.slug}
        className={cn(
          "group overflow-hidden rounded-2xl border border-maroon/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-soft sm:grid sm:grid-cols-[13.5rem_1fr]",
          className,
        )}
      >
        {event.image ? (
          <div className="relative h-48 overflow-hidden sm:h-full sm:min-h-[15rem]">
            <Image
              src={event.image}
              alt={event.imageAlt ?? event.title}
              fill
              sizes="(min-width: 640px) 216px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-maroon-deep/35 to-transparent sm:bg-gradient-to-r"
              aria-hidden="true"
            />
            <span className="absolute top-3 left-3 rounded-full bg-maroon/90 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
              {event.category}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col justify-center gap-3 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[0.68rem] font-medium tracking-wide text-ink-soft/70 uppercase">
            <CalendarRange className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <time dateTime={event.date}>{formatEventDateRange(event)}</time>
            {multiDay ? (
              <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[0.55rem] tracking-[0.12em] text-maroon-soft">
                Multi-day
              </span>
            ) : null}
          </div>

          <h3 className="text-xl leading-snug sm:text-[1.35rem]">{event.title}</h3>

          <p className="flex items-start gap-1.5 text-[0.75rem] text-ink-soft/80">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon/55" aria-hidden="true" />
            {event.location}
          </p>

          <p className="text-[0.82rem] leading-[1.75] text-ink-soft">
            {event.description}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      id={event.slug}
      className={cn(
        "group relative flex gap-4 rounded-2xl border border-maroon/10 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(74,28,28,0.5)] transition-all duration-300 hover:border-gold/40 hover:shadow-card sm:gap-5 sm:p-5",
        className,
      )}
    >
      <div
        className="flex h-[4.6rem] w-[3.9rem] shrink-0 flex-col items-center justify-center rounded-xl border border-gold/30 bg-cream-100 text-center"
        aria-hidden="true"
      >
        <span className="text-[0.6rem] font-semibold tracking-[0.18em] text-maroon-soft">
          {date.month}
        </span>
        <span className="font-serif text-[1.7rem] leading-none text-maroon">
          {date.day}
        </span>
        <span className="mt-0.5 text-[0.55rem] tracking-wider text-ink-soft/55">
          {date.year}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.12em] uppercase",
              categoryStyles[event.category],
            )}
          >
            {event.category}
          </span>
          <time
            dateTime={event.date}
            className="text-[0.65rem] font-medium tracking-wide text-ink-soft/55"
          >
            {date.weekday} · {formatEventDateRange(event)}
          </time>
        </div>
        <h3 className="mt-2 text-[1.08rem] leading-snug transition-colors group-hover:text-maroon-soft">
          {event.title}
        </h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-[0.7rem] text-ink-soft/75">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-maroon/50" aria-hidden="true" />
          {event.location}
        </p>
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed text-ink-soft/85">
          {event.description}
        </p>
      </div>
    </article>
  );
}
