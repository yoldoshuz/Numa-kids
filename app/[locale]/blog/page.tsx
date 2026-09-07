import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BlogList } from "@/components/pages/blog/blog-list";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { getArticles } from "@/lib/api/catalog";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/json-ld";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return buildMetadata({
    locale,
    title: t("blog.title"),
    description: t("blog.description"),
    path: "/blog",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  const articles = await getArticles();

  return (
    <>
      <PageHero
        title={t("blogPage.title")}
        subtitle={t("blogPage.subtitle")}
        image="/images/mascots/jekky.png"
        imageAlt={t("blogPage.title")}
      />

      <BlogList articles={articles} />

      <JsonLd
        data={[
          breadcrumbJsonLd(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("blogPage.title"), path: "/blog" },
            ],
            locale,
          ),
          itemListJsonLd(
            articles.map((article) => ({
              name: t(`articles.${article.slug}.title`),
              path: `/blog/${article.slug}`,
            })),
            locale,
          ),
        ]}
      />
    </>
  );
}
