import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { TEAM_CARDS } from "@/lib/data";

/**
 * Five staggered arches with the mascot teams — the first screen of the site.
 * They only fan out into a fixed row once the container is wide enough (xl);
 * below that the row stays a snap-scrolling carousel so the arches never
 * overlap or get squeezed on tablets and small laptops.
 */
export function HeroTeams() {
  const t = useTranslations("hero");

  return (
    <section aria-labelledby="hero-title" className="bg-white pb-10 sm:pb-16">
      <h1 id="hero-title" className="sr-only">
        {t("title")}
      </h1>

      <Container className="pt-6 md:pt-10">
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 xl:mx-0 xl:gap-0 xl:overflow-visible xl:px-0 xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEAM_CARDS.map((card, index) => (
            <article
              key={card.id}
              style={{ "--offset": `${card.offset}px` } as React.CSSProperties}
              className="relative h-[360px] w-[62vw] max-w-[248px] shrink-0 snap-center overflow-hidden rounded-t-full sm:h-[420px] sm:w-[38vw] md:h-[480px] md:w-[30vw] xl:h-[520px] xl:w-auto xl:max-w-none xl:flex-1 xl:translate-y-[var(--offset)]"
            >
              <Image
                src={card.image}
                alt={t(`teams.${card.id}`)}
                fill
                priority={index < 3}
                sizes="(max-width: 1280px) 40vw, 250px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent"
              />
              <h2 className="absolute inset-x-4 bottom-8 text-center text-xl leading-tight font-extrabold text-white drop-shadow-lg sm:text-2xl xl:bottom-10">
                {t(`teams.${card.id}`)}
              </h2>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
