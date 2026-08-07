"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useCart } from "@/hooks";
import { ACCENT } from "@/lib/accents";
import { Container } from "@/components/shared/container";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const SPECS = [
  "volume",
  "form",
  "age",
  "country",
  "shelfLife",
  "storage",
] as const;

export function ProductHero({ product }: { product: Product }) {
  const t = useTranslations();
  const { add } = useCart();
  const accent = ACCENT[product.accent];

  const images = [product.image, ...product.gallery];
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const name = t(`products.${product.slug}.name`);

  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div>
        <div
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-3xl",
            accent.card,
          )}
        >
          <Image
            src={images[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className={cn(
              "object-contain p-8",
              active > 0 && "object-cover p-0",
            )}
          />
        </div>

        <ul
          aria-label={t("product.gallery")}
          className="mt-4 grid grid-cols-3 gap-4"
        >
          {images.slice(0, 3).map((image, index) => (
            <li key={image}>
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
                  className={cn(
                    "object-cover",
                    index === 0 && "object-contain p-3",
                  )}
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

        <h1 className="mt-5 text-4xl font-extrabold text-brand-ink sm:text-5xl">
          {t(`products.${product.slug}.shortName`)}
        </h1>
        <p className={cn("mt-2 text-base", accent.text)}>
          {t(`products.${product.slug}.tagline`)}
        </p>
        <p className="mt-5 max-w-xl leading-relaxed text-brand-ink/60">
          {t(`products.${product.slug}.long`)}
        </p>

        <p className="mt-9 text-3xl font-extrabold text-brand-ink">
          {formatPrice(product.price)}{" "}
          <span className="text-2xl">{t("common.currency")}</span>
        </p>

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

        <h2 className="mt-12 text-2xl font-extrabold text-brand-ink">
          {t("product.specsTitle")}
        </h2>
        <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,220px)_1fr]">
          {SPECS.map((spec) => (
            <div key={spec} className="contents">
              <dt className="text-sm text-brand-ink/50">
                {t(`product.specs.${spec}.label`)}:
              </dt>
              <dd className="text-sm text-brand-ink">
                {t(`product.specs.${spec}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}
