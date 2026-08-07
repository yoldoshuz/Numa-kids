"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { RainbowWord } from "@/components/shared/rainbow-word";
import { useCarousel } from "@/hooks";
import { Link } from "@/lib/i18n/navigation";
import type { Product } from "@/types";
import { CarouselControls } from "@/components/shared/carousel-controls";

export function CatalogSection({ products }: { products: Product[] }) {
  const t = useTranslations();
  const { ref, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel<HTMLUListElement>();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
              {t("catalog.title")}{" "}
              <RainbowWord>{t("catalog.titleAccent")}</RainbowWord>
            </h2>
            <p className="mt-2 text-sm text-brand-ink/60">
              {t("catalog.subtitle")}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-pink hover:text-brand-pink"
          >
            {t("common.allProducts")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>

      <div className="relative mt-10">
        <Container className="relative">
          <CarouselControls
            variant="floating"
            onPrev={scrollPrev}
            onNext={scrollNext}
            canPrev={canScrollPrev}
            canNext={canScrollNext}
            className="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 justify-between px-0 xl:flex [&>button]:pointer-events-auto"
          />

          <ul
            ref={ref}
            className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product, index) => (
              <li
                key={product.slug}
                className="w-[80vw] max-w-sm shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"
              >
                <ProductCard product={product} priority={index < 3} />
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
