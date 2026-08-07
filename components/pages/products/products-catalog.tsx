"use client";

import { useTranslations } from "next-intl";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";

import { Container } from "@/components/shared/container";
import { FilterPills } from "@/components/shared/filter-pills";
import { ProductCard } from "@/components/shared/product-card";
import { ALL_FILTER, useQueryFilter } from "@/hooks";
import { PRODUCT_CATEGORIES } from "@/lib/data";
import type { Product } from "@/types";

export function ProductsCatalog({
  products: catalogue,
}: {
  products: Product[];
}) {
  const t = useTranslations();
  const [category, setCategory] = useQueryFilter(
    "category",
    PRODUCT_CATEGORIES,
  );

  const options = useMemo(
    () => [
      { value: ALL_FILTER, label: t("productsPage.all") },
      ...PRODUCT_CATEGORIES.map((value) => ({
        value,
        label: t(`productCategories.${value}`),
      })),
    ],
    [t],
  );

  const products = useMemo(
    () =>
      category === ALL_FILTER
        ? catalogue
        : catalogue.filter((product) => product.category === category),
    [category, catalogue],
  );

  /*
   * Filtering shortens the page, and the browser clamps the scroll offset to
   * the new document height — which reads as the page jumping upwards out from
   * under the shopper. Remembering where the pills sat and correcting by the
   * delta afterwards keeps them visually still.
   */
  const pillsRef = useRef<HTMLDivElement>(null);
  const anchor = useRef<number | null>(null);

  const handleChange = useCallback(
    (next: string) => {
      anchor.current = pillsRef.current?.getBoundingClientRect().top ?? null;
      setCategory(next);
    },
    [setCategory],
  );

  useLayoutEffect(() => {
    if (anchor.current === null || !pillsRef.current) return;
    const delta = pillsRef.current.getBoundingClientRect().top - anchor.current;
    if (delta !== 0) window.scrollBy(0, delta);
    anchor.current = null;
  }, [category]);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div ref={pillsRef}>
          <FilterPills
            options={options}
            value={category}
            onChange={handleChange}
            label={t("productsPage.title")}
          />
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-brand-ink/50">
            {t("productsPage.empty")}
          </p>
        ) : (
          <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-14">
            {products.map((product, index) => (
              <li key={product.slug} className="flex">
                <ProductCard product={product} priority={index < 3} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
