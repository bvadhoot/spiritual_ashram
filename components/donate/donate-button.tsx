"use client";

import { Heart } from "lucide-react";
import { useDonation } from "@/components/donate/donation-context";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DonateButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  designation?: string;
  label?: string;
  hideLabelOnMobile?: boolean;
}

export function DonateButton({
  variant = "primary",
  size = "md",
  className,
  designation,
  label = "Donate",
  hideLabelOnMobile = false,
}: DonateButtonProps) {
  const { openDonation } = useDonation();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openDonation(designation)}
      aria-label={hideLabelOnMobile ? "Donate to the ashram" : undefined}
    >
      <Heart
        className={cn("h-4 w-4 transition-transform duration-300 group-hover/button:scale-110")}
        aria-hidden="true"
      />
      <span className={hideLabelOnMobile ? "hidden sm:inline" : undefined}>
        {label}
      </span>
    </Button>
  );
}
