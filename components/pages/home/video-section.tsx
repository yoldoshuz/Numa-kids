"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { YouTubeIcon } from "@/components/shared/brand-icons";
import { Container } from "@/components/shared/container";
import { CONTACTS } from "@/lib/constants";

/** youtube.com/@numakids — "Mahsulotlarimiz bolalar salomatligini…", 16:9. */
const VIDEO_ID = "q608a8IRVpg";

const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
/*
 * `youtube-nocookie` and no autoplay until the visitor asks for it: the player
 * is only mounted after a click, so the home page loads without any of
 * YouTube's script on it and nobody is tracked for scrolling past.
 */
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
/*
 * Hot-linked rather than copied into `public/`, and a plain `<img>` rather than
 * `next/image`: the optimizer would need `i.ytimg.com` in `remotePatterns`, and
 * adding Google's CDN to the trusted-host list for one poster is a worse trade
 * than depending on it for one image. The frame behind it is painted, so a
 * blocked thumbnail leaves a tinted card with a play button on it rather than a
 * hole.
 */
const POSTER_URL = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export function VideoSection() {
  const t = useTranslations("videoSection");
  const [playing, setPlaying] = useState(false);

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
                src={EMBED_URL}
                title={t("caption")}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`${t("play")}: ${t("caption")}`}
                className="group size-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-pink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={POSTER_URL}
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
            <p className="text-center text-sm text-brand-ink/60 sm:text-left">
              {t("caption")}
            </p>
            {/*
              A way out if the embed is blocked — a dead black rectangle is a
              worse answer than a link that always works.
            */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <a
                href={WATCH_URL}
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
      </Container>
    </section>
  );
}
