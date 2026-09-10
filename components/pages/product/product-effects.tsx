import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { hasSlots } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductEffects({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations();
  const name = t(`products.${product.slug}.shortName`);

  /*
   * The admin's "шкалы эффективности" block when it has one. Per product
   * either way — these used to come from a global `PRODUCT_EFFECTS`, so every
   * page in the range printed the same six benefits and Jekky's page described
   * Bonny's bones.
   */
  const cms = content?.metrics;
  const effects =
    cms?.items.map((item) => ({
      title: item.title,
      text: item.description,
      value: item.percent,
    })) ??
    (t.raw(`products.${product.slug}.effects`) as {
      title: string;
      text: string;
      value: number;
    }[]);

  /*
   * The photo belongs to this block: `metrics_1`, not the packshot the section
   * used to borrow. Without one the bars take the whole width rather than
   * leaving a column of decoration next to nothing — Rikki has had a
   * `metrics_1` uploaded all along and was showing `gallery_1` instead.
   */
  const illustrated = hasSlots(product.images, "metrics_1");

  return (
    <section className="pb-8 sm:pb-12">
      <Container
        className={cn(
          "grid items-center gap-12",
          illustrated && "lg:grid-cols-[1.15fr_1fr]",
        )}
      >
        <div>
          {cms?.title && (
            <h2 className="mb-8 text-3xl font-extrabold text-brand-ink sm:text-4xl">
              {cms.title}
            </h2>
          )}
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
        </div>

        <SlotImage
          images={product.images}
          slot="metrics_1"
          alt={name}
          sizes="(max-width: 1024px) 100vw, 460px"
          className="mx-auto w-full max-w-md rounded-3xl bg-brand-pink-tint"
          imageClassName="p-6"
        />
      </Container>
    </section>
  );
}
