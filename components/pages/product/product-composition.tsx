import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Product3D } from "@/components/shared/product-3d";
import type { ProductContent } from "@/lib/api/blocks";
import type { Product } from "@/types";

const FACT_POSITION = [
  "sm:absolute sm:top-4 sm:left-0",
  "sm:absolute sm:top-16 sm:right-0",
  "sm:absolute sm:bottom-20 sm:left-0",
  "sm:absolute sm:bottom-4 sm:right-0",
];

export function ProductComposition({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations();
  const name = t(`products.${product.slug}.shortName`);
  const cms = content?.about;

  /*
   * The pills are written for the range — a jar of marmalade bears — so a
   * product that is something else has to be able to restate them. Endomarine
   * is a 500 ml syrup and would otherwise have advertised a 400 mg dose. The
   * admin's "описание с цифрами" block restates all four outright.
   */
  const own = (key: string) => (t.has(key) && t(key)) || "";
  const fact = (id: "dosage" | "course" | "natural") => ({
    value:
      own(`products.${product.slug}.facts.${id}.value`) || t(`product.facts.${id}.value`),
    label:
      own(`products.${product.slug}.facts.${id}.label`) || t(`product.facts.${id}.label`),
  });

  /*
   * Four pills, because the composition is a ring with a slot on each diagonal
   * — a fifth would have nowhere to sit. The CMS list is trimmed rather than
   * scrolled: the extra numbers belong in the description beside it.
   */
  const facts = cms?.stats.length
    ? cms.stats.slice(0, 4)
    : [
        fact("dosage"),
        fact("course"),
        fact("natural"),
        {
          value: t(`products.${product.slug}.activeFormula`),
          label: t("product.facts.active.label"),
        },
      ];

  const body = cms?.text || t(`products.${product.slug}.compositionText`);

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          {/* "Rikki — Antiparazit", not "Rikki:" — the dash is what the block
              was signed off with, and a colon reads as a label for the jar
              rather than as the product's own name. A title written in the
              admin stands on its own instead: it is a sentence, not a suffix. */}
          <h2 className="text-3xl leading-tight font-extrabold text-brand-ink sm:text-4xl">
            {cms?.title ? (
              cms.title
            ) : (
              <>
                {name} —
                <br />
                {t(`products.${product.slug}.compositionTitle`)}
              </>
            )}
          </h2>
          <p className="mt-8 max-w-md leading-relaxed text-brand-ink/60">{body}</p>
        </div>

        <div className="relative mx-auto grid w-full max-w-xl gap-4 sm:aspect-square sm:place-items-center sm:gap-0">
          <div
            aria-hidden="true"
            className="absolute inset-8 hidden rounded-full bg-brand-pink-tint sm:block"
          />
          <div
            aria-hidden="true"
            className="absolute inset-4 hidden rounded-full border border-brand-pink-soft/60 sm:block"
          />

          {/*
            Wider than the flat packshot slot it replaces: the jar turns, and a
            box cut to the silhouette of one still frame clips the label as it
            comes round the side.
          */}
          <Product3D
            slug={product.slug}
            alt={name}
            fallback={product.image}
            sizes="(max-width: 640px) 200px, 280px"
            className="relative order-first mx-auto h-60 w-48 sm:order-none sm:h-80 sm:w-64"
          />

          <ul className="grid grid-cols-2 gap-3 sm:contents">
            {facts.map((fact, index) => (
              <li
                key={fact.label || index}
                className={`rounded-2xl bg-brand-pink-soft px-5 py-4 text-center sm:w-44 ${FACT_POSITION[index]}`}
              >
                <p className="text-base font-bold text-white">{fact.value}</p>
                <p className="mt-1 text-xs text-white/90 sm:text-sm">
                  {fact.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
