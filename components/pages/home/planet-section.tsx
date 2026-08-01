import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";

const ITEMS = [
  { id: "natural", chip: "bg-brand-yellow-deep/70", icon: "/images/icons/sunflower.png" },
  { id: "checked", chip: "bg-green-action", icon: "/images/icons/leaf.png" },
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

        <div className="relative -mb-14 h-56 sm:h-72 lg:-mr-16 lg:-mb-20 lg:h-auto lg:min-h-[340px]">
          <Image
            src="/images/mascots/team.png"
            alt={t("title")}
            fill
            sizes="(max-width: 1024px) 90vw, 640px"
            className="object-contain object-bottom"
          />
        </div>
      </Container>
    </section>
  );
}
