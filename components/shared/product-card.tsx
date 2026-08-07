"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useCart } from "@/hooks";
import { ACCENT } from "@/lib/accents";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  /** Number printed on the tab hanging under the card. */
  index: number;
  priority?: boolean;
}

/**
 * The signature "price tag" card: a tall arch on top and a numbered tab that
 * hangs below the card, exactly as in the Figma catalogue grid.
 */
export function ProductCard({ product, index, priority }: ProductCardProps) {
  const t = useTranslations();
  const { add, setQuantity, lines, ready } = useCart();
  const inCart =
    lines.find((line) => line.slug === product.slug)?.quantity ?? 0;
  const accent = ACCENT[product.accent];
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex w-full flex-col">
      <div
        className={cn(
          "relative flex flex-1 flex-col rounded-t-[4.5rem] rounded-b-3xl px-6 pt-6 pb-7 transition-transform duration-300 group-hover:-translate-y-1 sm:rounded-t-[6rem] sm:px-7",
          accent.card,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          {product.isTop ? (
            <span
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase",
                accent.badge,
                accent.badgeText,
              )}
            >
              {t("productBadges.top")}
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-brand-ink/70">
            {t("productBadges.strains", { count: product.strains })}
          </span>
        </div>

        <Link
          href={href}
          className="mt-4 flex justify-center rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-brand-pink/50"
        >
          <Image
            src={product.image}
            alt={t(`products.${product.slug}.name`)}
            width={200}
            height={280}
            priority={priority}
            sizes="(max-width: 640px) 45vw, 200px"
            className="h-44 w-auto object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105 sm:h-52"
          />
        </Link>

        <h3 className={cn("mt-5 text-xl font-bold sm:text-2xl", accent.text)}>
          <Link
            href={href}
            className="outline-none hover:underline focus-visible:underline"
          >
            {t(`products.${product.slug}.name`)}
          </Link>
        </h3>
        <p className={cn("mt-1.5 text-sm", accent.text)}>
          {t(`products.${product.slug}.tagline`)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink/55">
          {t(`products.${product.slug}.description`)}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className={cn("text-xl font-bold sm:text-2xl", accent.text)}>
            {formatPrice(product.price)}{" "}
            <span className="text-lg">{t("common.currency")}</span>
          </p>
          {ready && inCart > 0 ? (
            <QuantityStepper
              value={inCart}
              onChange={(next) => setQuantity(product.slug, next)}
              accent={product.accent}
              decreaseLabel={t("common.decrease")}
              increaseLabel={t("common.increase")}
              label={t("common.quantity")}
            />
          ) : (
            <button
              type="button"
              onClick={() => add(product.slug)}
              className={cn(
                "rounded-full px-7 py-3 text-base font-semibold text-white transition active:translate-y-px",
                accent.action,
                accent.actionHover,
              )}
            >
              {t("common.buy")}
            </button>
          )}
        </div>
      </div>

      {/* Numbered tab hanging under the card. */}
      <div className="flex justify-center" aria-hidden="true">
        <div
          className={cn(
            "flex h-14 w-24 items-end justify-center rounded-b-[2.5rem] pb-1.5",
            accent.card,
          )}
        >
          <span
            className={cn(
              "grid size-9 place-items-center rounded-full bg-white text-sm font-bold",
              accent.text,
            )}
          >
            {index}
          </span>
        </div>
      </div>
    </article>
  );
}
