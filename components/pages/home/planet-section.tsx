import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";

/** Order comes from the client's own list: proven, natural, useful. */
const ITEMS = [
  { id: "checked", chip: "bg-green-action", icon: "/images/icons/leaf.png" },
  { id: "natural", chip: "bg-brand-yellow-deep/70", icon: "/images/icons/sunflower.png" },
  { id: "useful", chip: "bg-brand-orange", icon: "/images/icons/alert.png" },
] as const;

export function PlanetSection() {
  const t = useTranslations("planet");

  return (
    <section className="relative overflow-hidden bg-brand-pink-soft">
      <Container className="relative grid gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:py-20">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl leading-tight font-extrabold text-brand-ink sm:text-4xl lg:text-[2.6rem]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
            {t("text")}
          </p>

          <ul className="mt-10 grid gap-5 sm:grid-cols-3 lg:mt-16">
            {ITEMS.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ${item.chip}`}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={22}
                    height={22}
                    className="size-[22px] object-contain"
                  />
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-ink">
                    {t(`items.${item.id}.title`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/90 sm:text-sm">
                    {t(`items.${item.id}.text`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/*
          The new artwork carries its own pink backdrop, so it cannot bleed off
          the section the way the old cut-out did — two different pinks meeting
          at a straight edge read as a printing fault. It gets a frame instead:
          its own 16:9 box, so neither end of the line-up is cropped away, and
          rounded corners so the rectangle reads as deliberate.
        */}
        <div className="relative aspect-[16/9] w-full self-center overflow-hidden rounded-2xl shadow-[0_18px_40px_-20px_rgba(23,28,51,0.45)] lg:rounded-3xl">
          <Image
            src="/images/kids-image.png"
            alt={t("title")}
            fill
            sizes="(max-width: 1024px) 92vw, 640px"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
