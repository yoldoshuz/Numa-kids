import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import type { Product } from "@/types";

export function ProductEffects({ product }: { product: Product }) {
  const t = useTranslations();
  const name = t(`products.${product.slug}.shortName`);
  /*
   * Per product, not one shared list. These used to come from a global
   * `PRODUCT_EFFECTS`, so every page in the range printed the same six
   * benefits — Jekky's page described Bonny's bones.
   */
  const effects = t.raw(`products.${product.slug}.effects`) as {
    title: string;
    text: string;
    value: number;
  }[];

  return (
    <section className="pb-8 sm:pb-12">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <ul className="space-y-6">
          {effects.map((effect) => (
            <li
              key={effect.title}
              className="grid items-center gap-x-6 gap-y-2 border-b border-border pb-5 sm:grid-cols-[minmax(0,240px)_1fr_auto]"
            >
              <div>
                <h3 className="text-sm font-extrabold tracking-wide text-brand-ink uppercase">
                  {effect.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-brand-ink/50">
                  {effect.text}
                </p>
              </div>

              <div
                role="meter"
                aria-valuenow={effect.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={effect.title}
                className="h-3.5 w-full overflow-hidden rounded-full bg-blue-card"
              >
                <div
                  style={{ width: `${effect.value}%` }}
                  className="h-full rounded-full bg-brand-pink-soft"
                />
              </div>

              <p className="text-lg font-bold text-brand-pink-soft">
                {effect.value}%
              </p>
            </li>
          ))}
        </ul>

        <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
          <div
            aria-hidden="true"
            className="absolute inset-6 rounded-full bg-brand-pink-tint"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-brand-pink-soft/50"
          />
          <div className="relative h-3/5 w-3/5">
            <Image
              src={product.image}
              alt={name}
              fill
              sizes="320px"
              className="object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.14)]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
