"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { YouTubeIcon } from "@/components/shared/brand-icons";
import { CarouselControls } from "@/components/shared/carousel-controls";
import { Container } from "@/components/shared/container";
import { useCarousel } from "@/hooks";
import { CONTACTS } from "@/lib/constants";
import { HOME_VIDEOS } from "@/lib/data";
import { cn } from "@/lib/utils";

const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
/*
 * `youtube-nocookie` and no autoplay until the visitor asks for it: no player
 * is mounted until a card is clicked, so the home page loads without any of
 * YouTube's script on it and nobody is tracked for scrolling past.
 */
const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
/*
 * Hot-linked rather than copied into `public/`, and plain `<img>` rather than
 * `next/image`: the optimizer would need `i.ytimg.com` in `remotePatterns`, and
 * adding Google's CDN to the trusted-host list for ten posters is a worse trade
 * than depending on it for ten images. The frame behind each one is painted, so
 * a blocked thumbnail leaves a tinted card with a play button on it rather than
 * a hole.
 */
const posterUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/**
 * The channel's clips: one big player with the rest of the shelf under it.
 *
 * This section used to carry a single hardcoded video id, which meant the ten
 * films the channel actually published were reachable only by leaving the site.
 * Picking a card swaps the player rather than opening a modal, so the choice
 * and the film stay on the same screen.
 */
export function VideoSection() {
  const t = useTranslations("videoSection");
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { ref, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel<HTMLUListElement>();

  const active = HOME_VIDEOS[activeIndex];

  const select = (index: number) => {
    setActiveIndex(index);
    // Picking a card is a request to watch it, not just to look at its poster.
    setPlaying(true);
  };

  return (
    <section className="bg-tint-rose py-16 sm:py-20">
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-brand-ink/60 sm:text-base">
          {t("subtitle")}
        </p>

        <div className="mx-auto mt-10 w-full max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-brand-ink shadow-[0_18px_50px_rgba(23,28,51,0.18)]">
            {playing ? (
              <iframe
                // Keyed by id so switching clips replaces the player instead of
                // leaving the previous film running behind a new src.
                key={active.id}
                src={embedUrl(active.id)}
                title={active.title}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`${t("play")}: ${active.title}`}
                className="group size-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-pink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl(active.id)}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-brand-ink/10 to-transparent transition-colors duration-300 group-hover:from-brand-ink/70" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-brand-pink text-white shadow-lg shadow-brand-pink/40 transition-transform duration-300 group-hover:scale-110 sm:size-20">
                    <Play className="ml-1 size-7 fill-current sm:size-8" aria-hidden />
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm font-semibold text-brand-ink sm:text-left">
              {active.title}
            </p>
            {/*
              A way out if the embed is blocked — a dead black rectangle is a
              worse answer than a link that always works.
            */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <a
                href={watchUrl(active.id)}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-semibold text-brand-ink/70 transition hover:text-brand-pink"
              >
                {t("openOnYouTube")}
              </a>
              <a
                href={CONTACTS.youtubeHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-brand-pink hover:text-brand-pink"
              >
                <YouTubeIcon className="size-4" aria-hidden />
                {t("channel")}
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-10">
          <ul
            ref={ref}
            aria-label={t("title")}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {HOME_VIDEOS.map((video, index) => (
              <li
                key={video.id}
                className="w-[200px] shrink-0 snap-start sm:w-[232px]"
              >
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-current={index === activeIndex}
                  className={cn(
                    "group block w-full overflow-hidden rounded-2xl bg-white text-left ring-2 transition",
                    index === activeIndex
                      ? "ring-brand-pink"
                      : "ring-transparent hover:ring-brand-pink/40",
                  )}
                >
                  <span className="relative block aspect-video overflow-hidden bg-brand-ink/90">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={posterUrl(video.id)}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-brand-ink/15 transition-colors group-hover:bg-brand-ink/30">
                      <span className="grid size-10 place-items-center rounded-full bg-white/95 text-brand-pink transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 size-4 fill-current" aria-hidden />
                      </span>
                    </span>
                  </span>
                  <span className="flex min-h-16 items-start px-4 py-3">
                    <span className="line-clamp-2 text-xs leading-snug font-semibold text-brand-ink">
                      {video.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <CarouselControls
            onPrev={scrollPrev}
            onNext={scrollNext}
            canPrev={canScrollPrev}
            canNext={canScrollNext}
            variant="floating"
            className="pointer-events-none absolute inset-x-0 top-[4.5rem] hidden -translate-y-1/2 justify-between sm:flex [&>button]:pointer-events-auto"
          />
        </div>
      </Container>
    </section>
  );
}
