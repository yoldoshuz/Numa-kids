import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

const TONE = {
  blue: {
    card: "bg-blue-card",
    tag: "bg-blue-badge text-white",
    link: "text-blue-ink",
  },
  green: {
    card: "bg-green-card",
    tag: "bg-green-action text-green-ink",
    link: "text-green-ink",
  },
} as const;

/** Compact variant — used in the two-up block on the home page. */
export function ArticleCard({ article }: { article: Article }) {
  const t = useTranslations();
  const tone = TONE[article.accent];

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8",
        tone.card,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide uppercase",
            tone.tag,
          )}
        >
          {t(`articleTopics.${article.topic}`)}
        </span>
        <span className="text-sm text-brand-ink/50">
          {t("common.minutes", { count: article.readingTime })}
        </span>
      </div>

      <h3 className="mt-5 text-lg leading-snug font-bold text-brand-ink sm:text-xl">
        <Link
          href={`/blog/${article.slug}`}
          className="outline-none after:absolute hover:underline focus-visible:underline"
        >
          {t(`articles.${article.slug}.title`)}
        </Link>
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink/55">
        {t(`articles.${article.slug}.excerpt`)}
      </p>

      <Link
        href={`/blog/${article.slug}`}
        className={cn(
          "mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold hover:gap-2.5 focus-visible:gap-2.5",
          tone.link,
        )}
      >
        {t("common.readMore")}
        <ArrowRight className="size-4 transition-all" />
      </Link>
    </article>
  );
}

/** Wide variant with a cover image — used on the blog index. */
export function ArticleRow({ article }: { article: Article }) {
  const t = useTranslations();

  return (
    <article className="grid overflow-hidden rounded-3xl bg-blue-card transition-shadow hover:shadow-lg md:grid-cols-[minmax(0,340px)_1fr]">
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[240px]">
        <Image
          src={article.image}
          alt={t(`articles.${article.slug}.title`)}
          fill
          sizes="(max-width: 768px) 100vw, 340px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-badge px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white uppercase">
            {t(`articleTopics.${article.topic}`)}
          </span>
          <span className="text-sm text-brand-ink/50">
            {t("common.minutes", { count: article.readingTime })}
          </span>
        </div>

        <h2 className="mt-4 text-lg leading-snug font-bold text-brand-ink sm:text-xl">
          <Link href={`/blog/${article.slug}`} className="hover:underline">
            {t(`articles.${article.slug}.title`)}
          </Link>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-ink/55">
          {t(`articles.${article.slug}.excerpt`)}
        </p>

        <Link
          href={`/blog/${article.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-blue-ink hover:gap-2.5"
        >
          {t("common.readMore")}
          <ArrowRight className="size-4 transition-all" />
        </Link>
      </div>
    </article>
  );
}
