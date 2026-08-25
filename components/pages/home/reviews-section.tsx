"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { CarouselControls } from "@/components/shared/carousel-controls";
import { Container } from "@/components/shared/container";
import { useCarousel } from "@/hooks";
import { REVIEWS } from "@/lib/data";
import type { ReviewCard } from "@/types";
import { cn } from "@/lib/utils";

const TONE = {
  yellow: "bg-review-yellow text-brand-ink",
  pink: "bg-review-pink text-white",
  orange: "bg-review-orange text-white",
} as const;

/**
 * Parent reviews.
 *
 * `reviews` is what the CMS published, already localised on the server. It is
 * `null` when the backend could not be reached — not empty — so this can tell
 * an outage apart from a store that genuinely has none yet, and falls back to
 * the bundled set only in the first case. An empty array renders nothing,
 * which is the honest answer to "the CMS is up and there are no reviews".
 */
export function ReviewsSection({ reviews }: { reviews?: ReviewCard[] | null }) {
  const t = useTranslations("reviews");
  const { ref, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel<HTMLUListElement>();

  const cards: ReviewCard[] =
    reviews ??
    REVIEWS.map((review) => ({
      id: review.id,
      name: t(`items.${review.id}.name`),
      text: t(`items.${review.id}.text`),
      rating: null,
      videoUrl: null,
      avatar: review.avatar,
      tone: review.tone,
    }));

  if (!cards.length) return null;

  return (
    <section id="reviews" className="py-14 sm:py-20">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <h2 className="flex items-center gap-3 text-2xl font-extrabold text-brand-ink sm:text-3xl">
            <span aria-hidden="true">💗</span>
            {t("title")}
            <svg
              aria-hidden="true"
              viewBox="0 0 120 12"
              className="hidden h-3 w-28 text-brand-ink/70 sm:block"
            >
              <path
                d="M0 6l10-5 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </h2>

          <CarouselControls
            onPrev={scrollPrev}
            onNext={scrollNext}
            canPrev={canScrollPrev}
            canNext={canScrollNext}
          />
        </div>

        <ul
          ref={ref}
          className="-mx-5 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((review) => (
            <li
              key={review.id}
              className={cn(
                "flex w-[82vw] shrink-0 snap-start flex-col rounded-2xl p-6 sm:w-[46%] lg:w-[32%]",
                TONE[review.tone],
              )}
            >
              <blockquote className="text-sm leading-relaxed">
                {review.text}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <Image
                  src={review.avatar}
                  alt=""
                  width={40}
                  height={40}
                  sizes="40px"
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold">
                    {review.name}
                  </p>
                  <p className="text-xs opacity-70">{t("role")}</p>
                </div>
              </figcaption>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
