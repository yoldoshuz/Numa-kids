import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleCard } from "@/components/shared/article-card";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { getArticle, getArticles } from "@/lib/api/catalog";
import { ARTICLES } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ locale: AppLocale; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const t = await getTranslations({ locale });

  return buildMetadata({
    locale,
    title: t("meta.article.title", { title: t(`articles.${slug}.title`) }),
    description: t("meta.article.description", {
      excerpt: t(`articles.${slug}.excerpt`),
    }),
    path: `/blog/${slug}`,
    image: article.image,
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const paragraphs = t(`articles.${slug}.body`).split("\n\n");
  const related = (await getArticles()).filter((item) => item.slug !== slug).slice(0, 2);

  return (
    <>
      <article className="pb-16">
        <Container className="py-10 sm:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink/60 transition hover:text-brand-pink"
          >
            <ArrowLeft className="size-4" />
            {t("blogPage.backToBlog")}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-badge px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white uppercase">
              {t(`articleTopics.${article.topic}`)}
            </span>
            <span className="text-sm text-brand-ink/50">
              {t("common.minutes", { count: article.readingTime })}
            </span>
            <time
              dateTime={article.publishedAt}
              className="text-sm text-brand-ink/50"
            >
              {formatDate(article.publishedAt, locale)}
            </time>
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl leading-tight font-extrabold text-brand-ink sm:text-[2.6rem]">
            {t(`articles.${slug}.title`)}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink/60">
            {t(`articles.${slug}.excerpt`)}
          </p>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={article.image}
              alt={t(`articles.${slug}.title`)}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          <div className="mt-10 max-w-3xl space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-relaxed text-brand-ink/75"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>

        <Container>
          <h2 className="mt-6 text-2xl font-extrabold text-brand-ink">
            {t("articlesSection.title")}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </Container>
      </article>

      <JsonLd
        data={[
          articleJsonLd(
            {
              title: t(`articles.${slug}.title`),
              description: t(`articles.${slug}.excerpt`),
              image: article.image,
              slug,
              publishedAt: article.publishedAt,
            },
            locale,
          ),
          breadcrumbJsonLd(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("blogPage.title"), path: "/blog" },
              { name: t(`articles.${slug}.title`), path: `/blog/${slug}` },
            ],
            locale,
          ),
        ]}
      />
    </>
  );
}
