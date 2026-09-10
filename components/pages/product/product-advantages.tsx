import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SlotImage } from "@/components/shared/slot-image";
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

        {/*
          One picture, from the slot named after this block, in the shape it was
          shot in.

          This used to be a carousel over the product's whole photo set — the
          gallery again, because "the widest thing available" was the only rule
          available — inside a 964×301 frame. Rikki's `advantages_1` is a 4:3
          photograph, so the crop kept a horizontal band across its middle and
          the section read as empty. Nothing is shown when the slot is empty:
          the list below is the section, the photograph is its illustration.
        */}
        <SlotImage
          images={product.images}
          slot="advantages_1"
          alt={heading}
          sizes="(max-width: 1024px) 100vw, 900px"
          className="mx-auto mt-10 w-full max-w-3xl rounded-3xl bg-surface-cream"
        />

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
