import { useTranslations } from "next-intl";

const REPEATS = 10;

/** Infinite pink ticker that separates the page body from the footer. */
export function Marquee() {
  const t = useTranslations();
  const items = Array.from({ length: REPEATS });

  return (
    <div
      aria-hidden="true"
      className="flex overflow-hidden bg-brand-pink-soft py-4 select-none"
    >
      {[0, 1].map((track) => (
        <div
          key={track}
          className="animate-marquee flex shrink-0 items-center gap-12 pr-12"
        >
          {items.map((_, index) => (
            <span
              key={index}
              className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] whitespace-nowrap text-white uppercase"
            >
              {t("marquee")}
              <svg viewBox="0 0 24 24" className="size-3 fill-white">
                <path d="M12 0l2.8 9.2L24 12l-9.2 2.8L12 24l-2.8-9.2L0 12l9.2-2.8L12 0z" />
              </svg>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
