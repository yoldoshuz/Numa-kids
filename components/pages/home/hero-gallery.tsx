"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { Container } from "@/components/shared/container";
import { HERO_SLIDES } from "@/lib/data";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/** How long the front arch holds before the gallery turns by one. */
const AUTOPLAY_MS = 5000;

const COUNT = HERO_SLIDES.length;
/** Front arch at load — Bonny, as in the approved layout. */
const INITIAL = 2;

/**
 * Where an arch sits, by how many places it stands from the front one.
 *
 * `x` is a share of the arch's own width, so the fan keeps its proportions at
 * every breakpoint instead of needing a offset table per screen size.
 */
const RING = [
  { x: 0, scale: 1, opacity: 1, blur: 0, z: 40 },
  { x: 0.7, scale: 0.85, opacity: 0.95, blur: 0, z: 30 },
  { x: 1.24, scale: 0.69, opacity: 0.4, blur: 2.5, z: 20 },
  /*
   * Anything further round than two places is parked out of sight behind the
   * front arch. With an even number of slides the window would otherwise be
   * lopsided — three arches to one side, two to the other — and the odd one
   * would sit on top of its opposite number.
   */
  { x: 1.24, scale: 0.69, opacity: 0, blur: 2.5, z: 10 },
] as const;

/**
 * The first screen: a turning gallery of mascot posters.
 *
 * Five arches stand in a fan, the front one square on and the rest falling away
 * behind it to either side. It turns by one every five seconds, and the whole
 * section takes the colour of whichever poster is in front — violet under
 * Bonny, green under Rikki, red under Funny — so the page changes mood with the
 * artwork rather than sitting on one fixed tint. Every arch is a link straight
 * to its product.
 *
 * The turn is a spring on transform and opacity only, so the posters are never
 * re-rasterised mid-move and stay crisp. Autoplay stops while a pointer is over
 * the gallery — otherwise the card under the cursor slides away as it is
 * clicked — while the tab is in the background, and for anyone who has asked
 * for reduced motion.
 */
export function HeroGallery() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(INITIAL);
  const [paused, setPaused] = useState(false);
  /** Bumped by every manual turn, to restart the countdown from that moment. */
  const [nudge, setNudge] = useState(0);

  const go = useCallback((next: number) => {
    setActive((current) => (next - current === 0 ? current : (next + COUNT) % COUNT));
    setNudge((value) => value + 1);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;

    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(
        () => setActive((current) => (current + 1) % COUNT),
        AUTOPLAY_MS,
      );
    };

    // A backgrounded tab would otherwise bank up turns and spend them all at
    // once the moment the visitor comes back.
    const onVisibility = () => {
      if (document.hidden) window.clearInterval(timer);
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused, reduceMotion, nudge]);

  const current = HERO_SLIDES[active];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[#fffdfb]"
    >
      <h1 id="hero-title" className="sr-only">
        {t("hero.title")}
      </h1>

      <Container className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        <div
          className="relative mx-auto h-[300px] w-full max-w-[620px] sm:h-[356px] lg:h-[420px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/*
            The colour blooms out of the front arch itself, not in from the
            corners of the section: one circle centred on the poster, wider than
            the viewport, clipped by the section. Anchoring it to the arch is
            what makes the tint read as light coming off the product rather than
            as a background someone painted behind it.

            One layer per poster, cross-faded. A single layer whose gradient is
            rewritten would jump — `background-image` does not interpolate, so
            the new colour has to arrive by fading a second layer in over the
            first.
          */}
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.slug}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[125vw] max-h-[1500px] w-[125vw] max-w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-[900ms] ease-out"
              style={{
                opacity: index === active ? 1 : 0,
                backgroundImage: `radial-gradient(closest-side, color-mix(in oklab, ${slide.tint} 52%, transparent), color-mix(in oklab, ${slide.tint} 20%, transparent) 34%, transparent 70%)`,
              }}
            />
          ))}

          {/* Tight halo right behind the front arch, on top of that bloom. */}
          <motion.div
            aria-hidden
            initial={false}
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[78%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[70px]"
            animate={{ backgroundColor: current.tint }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          {HERO_SLIDES.map((slide, index) => {
            // Shortest way round the ring, so turning past the last arch does
            // not send four of them sweeping across the screen the long way.
            const half = Math.floor(COUNT / 2);
            const rel = ((index - active + COUNT + half) % COUNT) - half;
            const step = RING[Math.min(Math.abs(rel), RING.length - 1)];
            const sign = Math.sign(rel);
            const name = t(`products.${slide.slug}.shortName`);

            return (
              <div
                key={slide.slug}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ zIndex: step.z }}
              >
                <motion.div
                  /*
                   * `initial={false}` so the fan is already fanned in the
                   * server markup. Left to animate in, the five arches ship
                   * stacked dead centre at full size and only spread once
                   * hydration runs a frame — a visible pile-up on the first
                   * paint of the first screen.
                   */
                  initial={false}
                  animate={{
                    x: `${sign * step.x * 100}%`,
                    scale: step.scale,
                    opacity: step.opacity,
                    filter: `blur(${step.blur}px)`,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 120, damping: 21, mass: 0.9 }
                  }
                  className="pointer-events-auto h-full w-[148px] sm:w-[176px] lg:w-[208px]"
                >
                  <Link
                    href={`/products/${slide.slug}`}
                    aria-label={name}
                    tabIndex={rel === 0 ? undefined : -1}
                    className={cn(
                      "relative block h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-[0_24px_48px_-18px_rgba(23,28,51,0.45)] outline-none",
                      "focus-visible:ring-4 focus-visible:ring-brand-pink/60",
                      rel === 0 && "ring-4 ring-white/70",
                    )}
                  >
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      priority={index === INITIAL}
                      sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 210px"
                      className="object-cover"
                    />
                  </Link>
                </motion.div>
              </div>
            );
          })}

          {/* Rides the front arch's lower edge, exactly as in the layout. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex translate-y-1/2 justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeOut" }}
                className="rounded-full bg-white px-9 py-3.5 text-xl font-extrabold text-brand-ink shadow-[0_14px_30px_-10px_rgba(23,28,51,0.35)] sm:text-2xl"
              >
                {t(`products.${current.slug}.shortName`)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-14 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
              className="text-sm text-brand-ink/60 sm:text-base"
            >
              {t(`products.${current.slug}.tagline`)}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label={t("common.prev")}
            onClick={() => go(active - 1)}
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-brand-ink shadow-[0_10px_24px_-10px_rgba(23,28,51,0.4)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>

          <ul className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <li key={slide.slug}>
                <button
                  type="button"
                  aria-label={t("hero.goTo", {
                    name: t(`products.${slide.slug}.shortName`),
                  })}
                  aria-current={index === active}
                  onClick={() => go(index)}
                  className={cn(
                    "block h-2 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
                    index === active
                      ? "w-7 bg-brand-orange"
                      : "w-2 bg-brand-ink/15 hover:bg-brand-ink/30",
                  )}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={t("common.next")}
            onClick={() => go(active + 1)}
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-brand-ink shadow-[0_10px_24px_-10px_rgba(23,28,51,0.4)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </Container>
    </section>
  );
}
