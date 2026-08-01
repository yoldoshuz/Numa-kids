"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { Container } from "@/components/shared/container";
import { FilterPills } from "@/components/shared/filter-pills";
import { ProductCard } from "@/components/shared/product-card";
import { ALL_FILTER, useQueryFilter } from "@/hooks/use-query-filter";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/data";

export function ProductsCatalog() {
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
        ? PRODUCTS
        : PRODUCTS.filter((product) => product.category === category),
    [category],
  );

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <FilterPills
          options={options}
          value={category}
          onChange={setCategory}
          label={t("productsPage.title")}
        />

        {products.length === 0 ? (
          <p className="mt-16 text-center text-brand-ink/50">
            {t("productsPage.empty")}
          </p>
        ) : (
          <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-14">
            {products.map((product, index) => (
              <li key={product.slug} className="flex">
                <ProductCard
                  product={product}
                  index={(index % 3) + 1}
                  priority={index < 3}
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
