import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { hasSlots } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductPurpose({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations();
  const name = t(`products.${product.slug}.shortName`);

  /*
   * The admin's "Для чего нужен" block when it has one, the bundled copy
   * otherwise. Per product either way — this grid used to read one shared
   * list, so every page in the range answered "why do you need it" with the
   * same six generic lines.
   */
  const cms = content?.benefits;
  const purposes =
    cms?.items ?? (t.raw(`products.${product.slug}.purposes`) as { title: string; text: string }[]);

  const heading = cms?.title || t("product.purposeTitle", { name });
  const intro = cms?.subtitle || t(`products.${product.slug}.purposeIntro`);

  /*
   * Two photographs belong to this block and the section never showed either.
   *
   * `benefits_1`/`benefits_2` have been fillable in the admin from the start,
   * and Rikki has had `benefits_2` uploaded for as long as the slots have
   * existed — it simply had nowhere to appear, which is also why nobody filled
   * the rest. One or both may be empty; the grid takes however many there are
   * and the section is text-only when there are none.
   */
  const shots = hasSlots(product.images, "benefits_1", "benefits_2");
  const paired = hasSlots(product.images, "benefits_1") && hasSlots(product.images, "benefits_2");

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      <Sparkles />
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {heading}
        </h2>
        {intro && (
          <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-brand-ink/60">
            {intro}
          </p>
        )}

        {shots && (
          <div
            className={cn(
              "mt-10 grid gap-5",
              paired ? "sm:grid-cols-2" : "mx-auto max-w-2xl",
            )}
          >
            <SlotImage
              images={product.images}
              slot="benefits_1"
              alt={heading}
              sizes={paired ? "(max-width: 640px) 100vw, 45vw" : "(max-width: 768px) 100vw, 680px"}
              className="rounded-3xl bg-white ring-1 ring-border"
              imageClassName="p-4"
            />
            <SlotImage
              images={product.images}
              slot="benefits_2"
              alt={heading}
              sizes={paired ? "(max-width: 640px) 100vw, 45vw" : "(max-width: 768px) 100vw, 680px"}
              className="rounded-3xl bg-white ring-1 ring-border"
              imageClassName="p-4"
            />
          </div>
        )}

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-x-10">
          {purposes.map((purpose) => (
            <li
              key={purpose.title}
              className="rounded-2xl bg-white px-6 py-6 shadow-[0_2px_14px_rgba(23,28,51,0.07)] ring-1 ring-border transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(23,28,51,0.1)]"
            >
              <h3 className="text-base font-bold text-brand-ink">
                {purpose.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/55">
                {purpose.text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
