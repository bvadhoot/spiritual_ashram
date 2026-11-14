import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "gold"
  | "outline"
  | "light"
  | "ghost-light";
export type ButtonSize = "sm" | "md" | "lg";

type Variant = ButtonVariant;
type Size = ButtonSize;

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

interface ActionButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

export type ButtonProps = LinkButtonProps | ActionButtonProps;

const base =
  "group/button inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-[0.015em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold";

const variants: Record<Variant, string> = {
  primary:
    "bg-maroon text-cream shadow-[0_14px_34px_-18px_rgba(74,28,28,0.9)] hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-[0_20px_40px_-20px_rgba(74,28,28,0.85)]",
  gold: "gold-gradient text-maroon-deep shadow-gold hover:-translate-y-0.5 hover:brightness-105",
  outline:
    "border border-maroon/25 bg-transparent text-maroon hover:border-maroon hover:bg-maroon hover:text-cream",
  light:
    "bg-cream text-maroon shadow-[0_16px_36px_-22px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 hover:bg-gold hover:text-maroon-deep",
  "ghost-light":
    "border border-cream/35 bg-white/5 text-cream backdrop-blur-sm hover:border-gold/70 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.8rem]",
  md: "px-6 py-3.5 text-sm",
  lg: "px-8 py-4 text-[0.95rem]",
};

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, onClick, ...rest } = props;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClick}
          aria-label={rest["aria-label"]}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={rest["aria-label"]}
      >
        {children}
      </Link>
    );
  }

  const { href: _href, variant: _variant, size: _size, className: _className, ...rest } =
    props as ActionButtonProps & { href?: undefined };
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
