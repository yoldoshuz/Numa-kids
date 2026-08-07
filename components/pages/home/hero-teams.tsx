"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { useRotation } from "@/hooks";
import { TEAM_CARDS } from "@/lib/data";
import { cn } from "@/lib/utils";

/** How long each mascot rests in a slot before the row advances. */
const ROTATE_MS = 3200;

/**
 * Five staggered arches with the mascot teams — the first screen of the site.
 *
 * The arches hold fixed positions and the teams travel through them: every few
 * seconds each slot takes on the mascot from the slot to its left, so the row
 * reads as a wheel turning clockwise and every team cycles through the tall
 * centre arch. Only the artwork moves, so the staggered silhouette the layout
 * is built around never shifts.
 *
 * Below xl the arches don't fan out into a fixed row, so the block stays a
 * snap-scrolling carousel and the rotation is switched off — moving artwork
 * under a finger that is mid-swipe is disorienting.
 */
export function HeroTeams() {
  const t = useTranslations("hero");

  // `useRotation` no-ops for reduced-motion visitors, leaving a static row.
  const tick = useRotation(ROTATE_MS);
  const count = TEAM_CARDS.length;

  return (
    <section aria-labelledby="hero-title" className="bg-white pb-10 sm:pb-16">
      <h1 id="hero-title" className="sr-only">
        {t("title")}
      </h1>

      <Container className="pt-6 md:pt-10">
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 xl:mx-0 xl:gap-0 xl:overflow-visible xl:px-0 xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEAM_CARDS.map((slot, index) => {
            // Which team currently occupies this arch. Subtracting the tick
            // walks the teams rightwards through the slots.
            const card = TEAM_CARDS[(((index - tick) % count) + count) % count];

            return (
              <article
                key={slot.id}
                style={{ "--offset": `${slot.offset}px` } as React.CSSProperties}
                className="relative h-[360px] w-[62vw] max-w-[248px] shrink-0 snap-center overflow-hidden rounded-t-full sm:h-[420px] sm:w-[38vw] md:h-[480px] md:w-[30vw] xl:h-[520px] xl:w-auto xl:max-w-none xl:flex-1 xl:translate-y-[var(--offset)]"
              >
                {/*
                  Keyed on the occupying team so React swaps the subtree and the
                  entry animation replays on every rotation.
                */}
                <div key={card.id} className="absolute inset-0 xl:animate-team-in">
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
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-2/5",
                      "bg-gradient-to-t from-black/45 to-transparent",
                    )}
                  />
                  <h2 className="absolute inset-x-4 bottom-8 text-center text-xl leading-tight font-extrabold text-white drop-shadow-lg sm:text-2xl xl:bottom-10">
                    {t(`teams.${card.id}`)}
                  </h2>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
