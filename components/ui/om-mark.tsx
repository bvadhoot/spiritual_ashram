import { cn } from "@/lib/utils";

interface OmMarkProps {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "solid" | "bare";
  className?: string;
  label?: boolean;
}

const dimensions = {
  sm: "h-10 w-10 text-lg",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-4xl",
};

export function OmMark({
  size = "md",
  variant = "outline",
  className,
  label = false,
}: OmMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        dimensions[size],
        variant === "outline" &&
          "border border-gold/45 bg-maroon/20 text-gold backdrop-blur-sm",
        variant === "solid" && "gold-gradient text-maroon-deep shadow-gold",
        variant === "bare" && "text-gold",
        className,
      )}
      role={label ? "img" : undefined}
      aria-label={label ? "Om" : undefined}
      aria-hidden={label ? undefined : true}
    >
      {variant === "outline" ? (
        <span
          className="absolute inset-1 rounded-full border border-gold/20"
          aria-hidden="true"
        />
      ) : null}
      <span className="relative font-serif leading-none">ॐ</span>
    </span>
  );
}
