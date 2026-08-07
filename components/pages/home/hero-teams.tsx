"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { useRotation } from "@/hooks";
import { TEAM_CARDS } from "@/lib/data";

/** How long each arrangement rests before the row advances one place. */
const ROTATE_MS = 3600;

/**
 * Five staggered arches with the mascot teams — the first screen of the site.
 *
 * The arches themselves travel: every few seconds the order shifts by one and
 * each arch slides to its new place, the way a gallery moves its frames. The
 * movement is a layout animation on the containers, so the artwork inside is
 * never scaled or cross-faded — it simply rides along, which is what keeps the
 * mascots looking crisp.
 *
 * Below xl the arches do not fan out into a fixed row, so the block stays a
 * snap-scrolling carousel and the rotation is switched off — moving things
 * under a finger that is mid-swipe is disorienting.
 */
export function HeroTeams() {
  const t = useTranslations("hero");
  const reduceMotion = useReducedMotion();

  const tick = useRotation(ROTATE_MS, !reduceMotion);
  const count = TEAM_CARDS.length;

  // Rotating the array is what framer's `layout` animation reacts to: each card
  // keeps its key, so it animates from its old slot to its new one.
  const ordered = Array.from(
    { length: count },
    (_, i) => TEAM_CARDS[(i + tick) % count],
  );

  return (
    <section aria-labelledby="hero-title" className="bg-white pb-10 sm:pb-16">
      <h1 id="hero-title" className="sr-only">
        {t("title")}
      </h1>

      <Container className="pt-6 md:pt-10">
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 xl:mx-0 xl:gap-0 xl:overflow-visible xl:px-0 xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence initial={false}>
            {ordered.map((card, slot) => (
              <motion.article
                key={card.id}
                layout
                transition={{
                  layout: { type: "spring", stiffness: 90, damping: 20, mass: 0.9 },
                }}
                // The stagger belongs to the slot, not the card, so the
                // silhouette of the row stays put while the arches move.
                style={{ "--offset": `${TEAM_CARDS[slot].offset}px` } as React.CSSProperties}
                className="relative h-[360px] w-[62vw] max-w-[248px] shrink-0 snap-center overflow-hidden rounded-t-full sm:h-[420px] sm:w-[38vw] md:h-[480px] md:w-[30vw] xl:h-[520px] xl:w-auto xl:max-w-none xl:flex-1 xl:translate-y-[var(--offset)]"
              >
                <Image
                  src={card.image}
                  alt={t(`teams.${card.id}`)}
                  fill
                  priority={slot < 3}
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
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
