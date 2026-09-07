"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ProductImage } from "@/components/shared/product-image";
import { useCart } from "@/hooks";
import type { ProductContent } from "@/lib/api/blocks";
import { ACCENT } from "@/lib/accents";
import { Container } from "@/components/shared/container";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn, isSoldOut } from "@/lib/utils";
import type { Product } from "@/types";

const SPECS = [
  "volume",
  "form",
  "age",
  "country",
  "shelfLife",
  "storage",
] as const;

export function ProductHero({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations();
  const { add } = useCart();
  const accent = ACCENT[product.accent];

  /*
   * Every photo the product has, once.
   *
   * The packshot is usually also the first gallery entry, so without the dedupe
   * the same picture opened the strip twice.
   */
  const images = [...new Set([product.image, ...product.gallery])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const name = t(`products.${product.slug}.name`);
  const soldOut = isSoldOut(product);

  /*
   * The table is written once for the range, which is marmalade bears in a jar
   * — so a product that is not one has to be able to answer for itself.
   * Endomarine is a 500 ml syrup, and inheriting "400 mg / marmalade bears"
   * would have printed a spec sheet for a different product.
   */
  const specValue = (spec: string) => {
    const own = `products.${product.slug}.specs.${spec}`;
    return (t.has(own) && t(own)) || t(`product.specs.${spec}.value`);
  };

  /*
   * The admin's own spec sheet, when it has one. It is not limited to the six
   * rows the design shipped — a moderator adding "Состав" or dropping "Срок
   * хранения" is the whole point of moving this table into the CMS — so the
   * rows carry their own labels rather than being looked up by key.
   */
  const cmsSpecs = content?.specs;
  const tagline = content?.hero?.tagline || t(`products.${product.slug}.tagline`);
  const description = content?.hero?.text || t(`products.${product.slug}.long`);
  const badge = content?.hero?.badge;

  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div>
        <div
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-3xl",
            accent.card,
          )}
        >
          <ProductImage
            slug={product.slug}
            src={images[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            // Every frame is contained: the set is whatever was uploaded for
            // the product, so "slot 0 is the packshot, the rest are lifestyle"
            // stopped being a safe assumption.
            className="object-contain p-8"
          />
        </div>

        {/*
          Every uploaded photo, not the first three.

          The strip was `grid-cols-3` over `images.slice(0, 3)`, so a product
          with six photos showed three and a moderator who added a seventh had
          nowhere to see it — which read as "I uploaded a picture and the site
          ignored it". Now it scrolls: three across at rest, and more if they
          are there.
        */}
        <ul
          aria-label={t("product.gallery")}
          className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <li
              key={image + index}
              className="w-[calc((100%-2rem)/3)] shrink-0 snap-start"
            >
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={active === index}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-2xl ring-2 transition",
                  accent.card,
                  active === index
                    ? "ring-brand-pink"
                    : "ring-transparent hover:ring-brand-pink/40",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-contain p-3"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-brand-ink/45">
            <li>
              <Link href="/" className="hover:text-brand-pink">
                {t("product.breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-brand-pink">
                {t("product.breadcrumbProducts")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-ink/70">
              {t(`products.${product.slug}.shortName`)}
            </li>
          </ol>
        </nav>

        {badge && (
          <p
            className={cn(
              "mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold",
              accent.card,
              accent.text,
            )}
          >
            {badge}
          </p>
        )}

        <h1 className="mt-5 text-4xl font-extrabold text-brand-ink sm:text-5xl">
          {t(`products.${product.slug}.shortName`)}
        </h1>
        {tagline && <p className={cn("mt-2 text-base", accent.text)}>{tagline}</p>}
        {description && (
          <p className="mt-5 max-w-xl leading-relaxed text-brand-ink/60">
            {description}
          </p>
        )}

        <p className="mt-9 text-3xl font-extrabold text-brand-ink">
          {formatPrice(product.price)}{" "}
          <span className="text-2xl">{t("common.currency")}</span>
        </p>

        {soldOut ? (
          /*
           * With nothing in stock there is no quantity worth picking, so the row
           * is replaced outright rather than greyed in place: a dimmed stepper
           * beside a dimmed button still invites a try, and this page was taking
           * the order all the way through to checkout.
           */
          <div className="mt-6 rounded-2xl border border-border bg-surface-sand px-5 py-4">
            <p className="text-base font-bold text-brand-ink">
              {t("common.outOfStock")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-brand-ink/60">
              {t("common.outOfStockNote")}
            </p>
          </div>
        ) : (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div
            className="flex items-center gap-1 rounded-xl border border-border p-1"
            role="group"
            aria-label={t("product.quantity")}
          >
            <button
              type="button"
              aria-label={t("product.decrease")}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="grid size-10 place-items-center rounded-lg text-brand-ink transition hover:bg-surface-sand"
            >
              <Minus className="size-4" />
            </button>
            <span
              aria-live="polite"
              className="w-10 text-center text-base font-semibold"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label={t("product.increase")}
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              className="grid size-10 place-items-center rounded-lg text-brand-ink transition hover:bg-surface-sand"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => add(product.slug, quantity)}
            className="h-13 flex-1 rounded-xl bg-brand-ink px-10 text-base font-semibold text-white transition hover:brightness-125 active:translate-y-px sm:flex-none"
          >
            {t("product.addToCart")}
          </button>
        </div>
        )}

        <h2 className="mt-12 text-2xl font-extrabold text-brand-ink">
          {cmsSpecs?.title || t("product.specsTitle")}
        </h2>
        <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,220px)_1fr]">
          {cmsSpecs
            ? cmsSpecs.items.map((row, index) => (
                <div key={row.label + index} className="contents">
                  <dt className="text-sm text-brand-ink/50">{row.label}:</dt>
                  <dd className="text-sm text-brand-ink">{row.value}</dd>
                </div>
              ))
            : SPECS.map((spec) => (
                <div key={spec} className="contents">
                  <dt className="text-sm text-brand-ink/50">
                    {t(`product.specs.${spec}.label`)}:
                  </dt>
                  <dd className="text-sm text-brand-ink">{specValue(spec)}</dd>
                </div>
              ))}
        </dl>
      </div>
    </Container>
  );
}
