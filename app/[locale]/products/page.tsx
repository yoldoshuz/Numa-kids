import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProductsCatalog } from "@/components/pages/products/products-catalog";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { PRODUCTS } from "@/lib/data";
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
    title: t("products.title"),
    description: t("products.description"),
    keywords: t("keywords"),
    path: "/products",
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  return (
    <>
      <PageHero
        title={t("productsPage.title")}
        subtitle={t("productsPage.subtitle")}
        image="/images/mascots/bonny-alt.png"
        imageAlt={t("hero.title")}
      />

      <ProductsCatalog />

      <JsonLd
        data={[
          breadcrumbJsonLd(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("productsPage.title"), path: "/products" },
            ],
            locale,
          ),
          itemListJsonLd(
            PRODUCTS.map((product) => ({
              name: t(`products.${product.slug}.name`),
              path: `/products/${product.slug}`,
            })),
            locale,
          ),
        ]}
      />
    </>
  );
}
