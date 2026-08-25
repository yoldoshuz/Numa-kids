import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import type { Product } from "@/types";

export function ProductPurpose({ product }: { product: Product }) {
  const t = useTranslations();
  const name = t(`products.${product.slug}.shortName`);
  // Per product. This grid used to read one shared list, so every page in the
  // range answered "why do you need it" with the same six generic lines.
  const purposes = t.raw(`products.${product.slug}.purposes`) as {
    title: string;
    text: string;
  }[];

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      <Sparkles />
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {t("product.purposeTitle", { name })}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-brand-ink/60">
          {t(`products.${product.slug}.purposeIntro`)}
        </p>

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
