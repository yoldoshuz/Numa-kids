import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticlesSection } from "@/components/pages/home/articles-section";
import { CatalogSection } from "@/components/pages/home/catalog-section";
import { CertificatesSection } from "@/components/pages/home/certificates-section";
import { CtaSection } from "@/components/pages/home/cta-section";
import { HeroTeams } from "@/components/pages/home/hero-teams";
import { PlanetSection } from "@/components/pages/home/planet-section";
import { ReviewsSection } from "@/components/pages/home/reviews-section";
import { TrustSection } from "@/components/pages/home/trust-section";
import { JsonLd } from "@/components/shared/json-ld";
import { PRODUCTS } from "@/lib/data";
import { itemListJsonLd } from "@/lib/json-ld";
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
    title: t("home.title"),
    description: t("home.description"),
    keywords: t("keywords"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "products" });

  return (
    <>
      <HeroTeams />
      <TrustSection />
      <PlanetSection />
      <ArticlesSection />
      <CatalogSection />
      <CertificatesSection />
      <CtaSection />
      <ReviewsSection />

      <JsonLd
        data={[
          itemListJsonLd(
            PRODUCTS.map((product) => ({
              name: t(`${product.slug}.name`),
              path: `/products/${product.slug}`,
            })),
            locale,
          ),
        ]}
      />
    </>
  );
}
