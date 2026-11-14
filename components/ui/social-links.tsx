import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function SocialIcon({ network }: { network: "facebook" | "instagram" | "youtube" }) {
  if (network === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M14.2 8.7h2.6V5.4h-2.9c-3 0-4.8 1.9-4.8 4.9v2.1H6.5v3.4h2.6V22h4v-6.2h2.8l.5-3.4h-3.3V10c0-.9.4-1.3 1.1-1.3Z" />
      </svg>
    );
  }

  if (network === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M21.5 7.2a2.8 2.8 0 0 0-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.5-4.8ZM10 15.2V8.8l5.3 3.2-5.3 3.2Z" />
    </svg>
  );
}

interface SocialLinksProps {
  tone?: "light" | "dark";
  className?: string;
}

export function SocialLinks({ tone = "light", className }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)}>
      {site.socials.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.shortName} on ${social.label} (opens in a new tab)`}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300",
              tone === "light"
                ? "border-cream/20 text-cream/75 hover:border-gold/70 hover:bg-gold hover:text-maroon-deep"
                : "border-maroon/15 text-maroon/70 hover:border-maroon hover:bg-maroon hover:text-cream",
            )}
          >
            <SocialIcon network={social.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
