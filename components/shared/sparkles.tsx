import { cn } from "@/lib/utils";

function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-6 w-6 fill-current", className)}
    >
      <path d="M12 0.8l3.1 7.3 7.9.7-6 5.2 1.8 7.7L12 17.6 5.2 21.7 7 14 1 8.8l7.9-.7L12 .8z" />
    </svg>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block size-3 rounded-full", className)}
    />
  );
}

/**
 * Decorative confetti layer used behind headings across the site.
 * Purely presentational, hidden from assistive technology.
 */
export function Sparkles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <Star className="absolute top-[12%] left-[6%] h-7 w-7 text-star-gold" />
      <Star className="absolute top-[30%] right-[9%] h-9 w-9 text-star-gold" />
      <Star className="absolute bottom-[18%] left-[13%] h-5 w-5 text-star-mint" />
      <Star className="absolute top-[8%] right-[22%] hidden h-6 w-6 text-star-mint sm:block" />
      <Dot className="absolute top-[22%] left-[24%] bg-star-gold" />
      <Dot className="absolute bottom-[26%] right-[18%] bg-star-blush" />
      <Dot className="absolute top-[46%] right-[32%] size-2.5 bg-star-grey" />
    </div>
  );
}

export { Star as DecorStar, Dot as DecorDot };
