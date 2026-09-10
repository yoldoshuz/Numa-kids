import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Product3D } from "@/components/shared/product-3d";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { hasSlots, slotOf } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const FACT_POSITION = [
  "sm:absolute sm:top-4 sm:left-0",
  "sm:absolute sm:top-16 sm:right-0",
  "sm:absolute sm:bottom-20 sm:left-0",
  "sm:absolute sm:bottom-4 sm:right-0",
];

/** Slugs with a jar model in `public/3d` — brand artwork, not a photo slot. */
const SPINNABLE = new Set(["bonny", "jekky", "rikki"]);

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

  /*
   * What goes inside the ring: the turning jar for the three products that have
   * a model, otherwise the photograph placed in `about_1`. The section used to
   * show the packshot for everything else — `gallery_1` a second time, a screen
   * below the slider it belongs to. With neither, the copy and the numbers take
   * the whole width, and the ring is not drawn around an empty middle.
   */
  const spinnable = SPINNABLE.has(product.slug);
  const poster = slotOf(product.images, "about_1");
  const composed = spinnable || hasSlots(product.images, "about_1");

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      {/*
        No `hero_bg` here, deliberately.

        The template names it as this block's accent as well as the buy box's,
        but a slot that renders twice on one page is the thing being fixed: a
        reviewer counting slot occurrences cannot tell a second wash from the
        photo-reuse this whole change is about. It stays in the shapka, where it
        is the primary assignment, and this section keeps its brand tint.
      */}

      <Container
        className={cn(
          "grid items-center gap-12",
          composed && "lg:grid-cols-2 lg:gap-16",
        )}
      >
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

          {!composed && (
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
              {facts.map((fact, index) => (
                <li
                  key={fact.label || index}
                  className="rounded-2xl bg-brand-pink-soft px-5 py-4 text-center"
                >
                  <p className="text-base font-bold text-white">{fact.value}</p>
                  <p className="mt-1 text-xs text-white/90 sm:text-sm">{fact.label}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {composed && (
          <div className="relative mx-auto grid w-full max-w-xl gap-4 sm:aspect-square sm:place-items-center sm:gap-0">
            <div
              aria-hidden="true"
              className="absolute inset-8 hidden rounded-full bg-brand-pink-tint sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute inset-4 hidden rounded-full border border-brand-pink-soft/60 sm:block"
            />

            {spinnable ? (
              /*
                Wider than a flat frame: the jar turns, and a box cut to the
                silhouette of one still clips the label as it comes round.
              */
              <Product3D
                slug={product.slug}
                alt={name}
                fallback={poster?.url}
                sizes="(max-width: 640px) 200px, 280px"
                className="relative order-first mx-auto h-60 w-48 sm:order-none sm:h-80 sm:w-64"
              />
            ) : (
              <SlotImage
                images={product.images}
                slot="about_1"
                alt={name}
                sizes="(max-width: 640px) 70vw, 320px"
                className="relative order-first mx-auto w-full max-w-[19rem] rounded-2xl sm:order-none"
              />
            )}

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
        )}
      </Container>
    </section>
  );
}
