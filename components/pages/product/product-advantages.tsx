"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { CarouselControls } from "@/components/shared/carousel-controls";
import { Container } from "@/components/shared/container";
import { useCarousel } from "@/hooks";
import { PRODUCT_ADVANTAGES } from "@/lib/data";
import type { Product } from "@/types";

export function ProductAdvantages({ product }: { product: Product }) {
  const t = useTranslations();
  const { ref, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel<HTMLUListElement>();
  const name = t(`products.${product.slug}.shortName`);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {t("product.advantagesTitle", { name })}
        </h2>

        <div className="relative mt-10">
          <ul
            ref={ref}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {product.banner.map((image) => (
              <li key={image} className="w-full shrink-0 snap-center">
                <div className="relative aspect-[16/6] overflow-hidden rounded-3xl sm:aspect-[16/5]">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>

          <CarouselControls
            onPrev={scrollPrev}
            onNext={scrollNext}
            canPrev={canScrollPrev}
            canNext={canScrollNext}
            variant="floating"
            className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between sm:flex [&>button]:pointer-events-auto"
          />
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-x-8">
          {PRODUCT_ADVANTAGES.map((advantage) => (
            <li
              key={advantage}
              className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 ring-1 ring-border"
            >
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-pink-soft text-white"
              >
                <Check className="size-4" />
              </span>
              <span className="text-sm text-brand-ink/80">
                {t(`product.advantages.${advantage}`)}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
