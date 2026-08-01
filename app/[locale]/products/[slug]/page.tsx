import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProductAdvantages } from "@/components/pages/product/product-advantages";
import { ProductComposition } from "@/components/pages/product/product-composition";
import { ProductEffects } from "@/components/pages/product/product-effects";
import { ProductHero } from "@/components/pages/product/product-hero";
import { ProductIntake } from "@/components/pages/product/product-intake";
import { ProductOrder } from "@/components/pages/product/product-order";
import { ProductPurpose } from "@/components/pages/product/product-purpose";
import { JsonLd } from "@/components/shared/json-ld";
import { getProduct, PRODUCTS } from "@/lib/data";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ locale: AppLocale; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCTS.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const t = await getTranslations({ locale });
  const name = t(`products.${slug}.name`);

  return buildMetadata({
    locale,
    title: t("meta.product.title", {
      name,
      tagline: t(`products.${slug}.tagline`),
    }),
    description: t("meta.product.description", {
      name,
      // Card copy has no trailing period — add one so the two sentences join.
      description: t(`products.${slug}.description`).replace(/\.?$/, "."),
    }),
    keywords: t("meta.keywords"),
    path: `/products/${slug}`,
    image: product.image,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <>
      <ProductHero product={product} />
      <ProductPurpose product={product} />
      <ProductIntake product={product} />
      <ProductComposition product={product} />
      <ProductAdvantages product={product} />
      <ProductEffects product={product} />
      <ProductOrder />

      <JsonLd
        data={[
          productJsonLd(
            {
              name: t(`products.${slug}.name`),
              description: t(`products.${slug}.long`),
              image: product.image,
              price: product.price,
              slug,
            },
            locale,
          ),
          breadcrumbJsonLd(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("productsPage.title"), path: "/products" },
              {
                name: t(`products.${slug}.shortName`),
                path: `/products/${slug}`,
              },
            ],
            locale,
          ),
        ]}
      />
    </>
  );
}
