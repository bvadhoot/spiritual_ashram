import { MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { SocialLinks } from "@/components/ui/social-links";

export function TopBar() {
  return (
    <div className="bg-maroon-deep text-cream">
      <div className="container-site flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
        <p className="flex items-center gap-2.5 text-[0.65rem] tracking-[0.16em] text-cream/65 uppercase sm:text-[0.7rem]">
          <span className="font-serif text-[0.95rem] leading-none tracking-normal text-gold">
            ॐ
          </span>
          <span>Sri Guru Bhyo Namaha</span>
        </p>

        <div className="flex items-center gap-4">
          <a
            href={site.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 text-[0.7rem] text-cream/60 transition-colors hover:text-gold md:flex"
          >
            <MapPin className="h-3.5 w-3.5 text-gold/80" aria-hidden="true" />
            <span>Kuppa Nagar, Jharasangam, Telangana</span>
          </a>
          <span className="hidden h-3.5 w-px bg-cream/15 md:block" aria-hidden="true" />
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
