"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { RainbowWord } from "@/components/shared/rainbow-word";
import { useCart } from "@/hooks";
import { ACCENT } from "@/lib/accents";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function CartView() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const { items, count, subtotal, totals, hasUnavailable, setQuantity, remove, ready } =
    useCart();

  // `ready` gates the empty state so the page does not flash "your cart is
  // empty" while the server cart is still loading.
  if (ready && items.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="flex max-w-md flex-col items-center gap-4 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-surface-sand">
            <ShoppingBasket className="size-9 text-brand-ink/40" strokeWidth={1.5} />
          </span>
          <h1 className="text-2xl font-extrabold text-brand-ink sm:text-3xl">
            {t("empty")}
          </h1>
          <p className="text-sm text-brand-ink/55">{t("emptyHint")}</p>
          <Link
            href="/products"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand-pink px-8 text-sm font-semibold text-white transition hover:bg-brand-pink-deep"
          >
            {tCommon("goToCatalog")}
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
          <RainbowWord>{t("title")}</RainbowWord>
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <ul className="flex flex-col gap-4">
            {items.map((item) => {
              const accent = ACCENT[item.product.accent];
              return (
                <li
                  key={item.slug}
                  className="flex items-center gap-4 rounded-3xl bg-white p-4 ring-1 ring-brand-ink/8 sm:gap-5 sm:p-5"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className={cn(
                      "grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl sm:size-24",
                      accent.card,
                    )}
                  >
                    <Image
                      src={item.product.image}
                      alt=""
                      width={96}
                      height={96}
                      sizes="96px"
                      className="h-full w-full object-contain p-2"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className={cn("font-bold hover:underline", accent.text)}
                    >
                      <ProductName slug={item.slug} />
                    </Link>
                    <p className="mt-1 text-sm text-brand-ink/55">
                      {formatPrice(item.product.price)} {tCommon("currency")}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-white",
                          accent.action,
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setQuantity(item.slug, item.quantity - 1)}
                          aria-label={tCommon("decrease")}
                          className="grid size-8 place-items-center rounded-full transition hover:bg-white/20"
                        >
                          <Minus className="size-4" />
                        </button>
                        <output
                          aria-label={tCommon("quantity")}
                          className="min-w-7 text-center text-sm font-bold tabular-nums"
                        >
                          {item.quantity}
                        </output>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.slug, item.quantity + 1)}
                          disabled={item.quantity >= 99}
                          aria-label={tCommon("increase")}
                          className="grid size-8 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-40"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(item.slug)}
                        aria-label={t("remove")}
                        className="grid size-9 place-items-center rounded-full text-brand-ink/40 transition hover:bg-surface-sand hover:text-brand-pink"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 self-start font-bold text-brand-ink">
                    {formatPrice(item.product.price * item.quantity)}{" "}
                    <span className="text-sm font-medium">{tCommon("currency")}</span>
                  </p>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-3xl bg-surface-sand p-6 sm:p-7">
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-brand-ink/60">{t("items", { count })}</dt>
                <dd className="font-semibold text-brand-ink">
                  {formatPrice(subtotal)} {tCommon("currency")}
                </dd>
              </div>
              {/* A single-unit order pays for delivery; from two units up it
                  is free. The server prices it — never recompute here, or the
                  basket and the order disagree. */}
              <div className="flex items-center justify-between">
                <dt className="text-brand-ink/60">{t("delivery")}</dt>
                {totals.deliveryFee > 0 ? (
                  <dd className="font-semibold text-brand-ink">
                    {formatPrice(totals.deliveryFee)} {tCommon("currency")}
                  </dd>
                ) : (
                  <dd className="font-semibold text-brand-green">{t("free")}</dd>
                )}
              </div>
              {totals.deliveryFee > 0 ? (
                <p className="text-xs text-brand-ink/50">{t("freeFrom")}</p>
              ) : null}
              <div className="mt-2 flex items-center justify-between border-t border-brand-ink/10 pt-4">
                <dt className="font-bold text-brand-ink">{t("total")}</dt>
                <dd className="text-xl font-extrabold text-brand-ink">
                  {formatPrice(totals.grandTotal)} {tCommon("currency")}
                </dd>
              </div>
            </dl>

            {totals.unavailableTotal > 0 ? (
              <p className="mt-4 text-sm font-semibold text-red-600">
                {t("unavailableTotal")}: {formatPrice(totals.unavailableTotal)}{" "}
                {tCommon("currency")}
              </p>
            ) : null}

            {/* Checkout rejects these lines anyway; say so here rather than
                letting the customer bounce off a 400 on the next screen. */}
            {hasUnavailable ? (
              <p className="mt-3 text-sm leading-snug text-red-600">{t("unavailableHint")}</p>
            ) : null}

            <Link
              href="/checkout"
              aria-disabled={hasUnavailable}
              onClick={(event) => {
                if (hasUnavailable) event.preventDefault();
              }}
              className={`mt-6 flex h-13 items-center justify-center rounded-full bg-brand-pink px-6 text-sm font-semibold text-white transition${
                hasUnavailable ? " pointer-events-none opacity-50" : " hover:bg-brand-pink-deep"
              }`}
            >
              {t("checkout")}
            </Link>
            <Link
              href="/products"
              className="mt-3 flex h-12 items-center justify-center rounded-full text-sm font-semibold text-brand-ink/60 transition hover:text-brand-pink"
            >
              {t("continue")}
            </Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/** Product names live in the `products.<slug>` namespace, which is per-product. */
function ProductName({ slug }: { slug: string }) {
  const t = useTranslations("products");
  return <>{t(`${slug}.name`)}</>;
}
