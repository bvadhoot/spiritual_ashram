import { Flower2, HandHeart, Landmark, Users } from "lucide-react";
import { featureStrip } from "@/lib/content";
import { cn } from "@/lib/utils";

const icons = {
  users: Users,
  temple: Landmark,
  hands: HandHeart,
  lotus: Flower2,
} as const;

export function FeatureStrip() {
  return (
    <section aria-label="Life at the ashram" className="gold-gradient relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.28),transparent_45%),linear-gradient(120deg,transparent,rgba(74,28,28,0.06))]"
        aria-hidden="true"
      />
      <div className="container-site relative grid grid-cols-2 lg:grid-cols-4">
        {featureStrip.map((feature, index) => {
          const Icon = icons[feature.icon as keyof typeof icons] ?? Flower2;
          return (
            <div
              key={feature.title}
              className={cn(
                "flex flex-col items-center gap-3 px-3 py-7 text-center sm:flex-row sm:items-start sm:gap-4 sm:px-5 sm:text-left lg:py-9",
                index % 2 === 1 && "border-l border-maroon/15",
                index >= 2 && "border-t border-maroon/15 lg:border-t-0",
                index > 0 && "lg:border-l lg:border-maroon/15",
              )}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-maroon/25 bg-cream/25 text-maroon shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                aria-hidden="true"
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
              </span>
              <div>
                <h2 className="font-serif text-[0.98rem] leading-tight text-maroon-deep">
                  {feature.title}
                </h2>
                <p className="mt-1.5 text-[0.65rem] leading-relaxed text-maroon/65">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
