import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  headingId?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
  headingId,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "max-w-3xl",
        centered ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow mb-4 flex items-center gap-3",
            centered && "justify-center",
            tone === "light" && "text-gold-light",
          )}
        >
          <span
            className={cn(
              "h-px w-8 bg-gold/60",
              tone === "light" && "bg-gold/70",
            )}
            aria-hidden="true"
          />
          {eyebrow}
          <span
            className={cn(
              "h-px w-8 bg-gold/60",
              tone === "light" && "bg-gold/70",
            )}
            aria-hidden="true"
          />
        </p>
      ) : null}

      <h2
        id={headingId}
        className={cn(
          "text-[2rem] leading-[1.12] sm:text-4xl lg:text-[2.85rem]",
          tone === "light" && "text-cream",
        )}
      >
        {title}
      </h2>

      <div
        className={cn(
          "mt-5 flex items-center gap-2.5",
          centered && "justify-center",
        )}
        aria-hidden="true"
      >
        <span className="h-px w-10 bg-gold/50" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-10 bg-gold/50" />
      </div>

      {description ? (
        <p
          className={cn(
            "mt-5 text-[0.95rem] leading-[1.8] text-ink-soft",
            tone === "light" && "text-cream/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
