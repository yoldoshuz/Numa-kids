"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { CarouselControls } from "@/components/shared/carousel-controls";
import { Container } from "@/components/shared/container";
import { useCarousel } from "@/hooks";
import type { ProductContent } from "@/lib/api/blocks";
import type { Product } from "@/types";

export function ProductAdvantages({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations();
  const { ref, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel<HTMLUListElement>();
  const name = t(`products.${product.slug}.shortName`);

  const cms = content?.advantages;
  // Per product: the shared list printed the same six lines on every page.
  const advantages =
    cms?.items ?? (t.raw(`products.${product.slug}.advantages`) as string[]);
  /*
   * A product may name this block itself. Rikki's list is the signs that a
   * child needs it, not what the jar does, so "Rikki afzalliklari" was
   * answering a question the list does not ask.
   *
   * The empty check matters: a product created in the admin gets a message
   * sub-tree modelled on the first bundled entry with every string blanked, so
   * the key exists there as "" and would print a heading with no words in it.
   */
  const ownTitle = t.has(`products.${product.slug}.advantagesTitle`)
    ? t(`products.${product.slug}.advantagesTitle`)
    : "";
  const heading = cms?.title || ownTitle || t("product.advantagesTitle", { name });

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {heading}
        </h2>

        <div className="relative mt-10">
          <ul
            ref={ref}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {product.banner.map((image) => (
              <li key={image} className="w-full shrink-0 snap-center">
                {/*
                  The strip takes whatever is in the product's photo set, which
                  is as often an upright jar as a wide banner — contained on the
                  cream plate rather than cropped, since a 16:6 crop of a jar is
                  a band across the middle of its label.
                */}
                <div className="relative aspect-[16/7] overflow-hidden rounded-3xl bg-surface-cream sm:aspect-[16/5]">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="object-contain"
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
          {advantages.map((advantage) => (
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
                {advantage}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
