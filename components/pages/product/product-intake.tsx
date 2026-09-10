import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { PRODUCT_INTAKE_STEPS } from "@/lib/data";
import { hasSlots } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductIntake({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations();
  const name = t(`products.${product.slug}.shortName`);

  /*
   * The timeline is written for the range — "one to two bears a day" — so a
   * product that is not a jar of marmalade has to be able to restate its own
   * steps. Endomarine is a syrup, and inheriting the shared wording had this
   * page telling parents to count out bears from a bottle. The admin's "как
   * принимать" block replaces the whole timeline, however many steps it has:
   * the numbers come from the order, not from the copy.
   */
  const own = (key: string) => (t.has(key) && t(key)) || "";
  const stepText = (step: string, part: "title" | "text") =>
    own(`products.${product.slug}.intake.${step}.${part}`) ||
    t(`product.intake.${step}.${part}`);

  const cms = content?.howToUse;
  const steps =
    cms?.steps ??
    PRODUCT_INTAKE_STEPS.map((step) => ({
      title: stepText(step, "title"),
      text: stepText(step, "text"),
    }));

  const heading = cms?.title || t("product.intakeTitle", { name });
  const subtitle = cms?.subtitle || t("product.intakeSubtitle");

  /* "Важно соблюдать" — a list in the CMS, one paragraph in the bundle. */
  const warnings = content?.warnings;

  /*
   * One photograph, from the slot shot for these instructions.
   *
   * The three frames that used to be here were `gallery_2`, `gallery_1` and
   * `advantages_1` — the slider's own pictures, repeated a screen further down,
   * plus one belonging to another block. When `how_to_use_1` is empty the steps
   * take the full width instead of a column collapsing into a grey box: the
   * instructions are the section, the photo illustrates them.
   */
  const illustrated = hasSlots(product.images, "how_to_use_1");

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      <Sparkles />
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {heading}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-center leading-relaxed text-brand-ink/60">
            {subtitle}
          </p>
        )}

        <div
          className={cn(
            "mt-12 grid gap-10",
            illustrated && "lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14",
          )}
        >
          <ol className="relative space-y-5 border-l-2 border-brand-pink-soft/60 pl-8">
            {steps.map((step, index) => (
              <li key={step.title || index} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-3 -left-[3.25rem] grid size-11 place-items-center rounded-full border-2 border-brand-pink-soft bg-white text-lg font-bold text-brand-ink"
                >
                  {index + 1}
                </span>
                <div className="rounded-2xl bg-brand-pink-soft/55 px-5 py-4">
                  <h3 className="text-sm font-bold text-brand-pink-deep">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink/60">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid content-start gap-5">
            <SlotImage
              images={product.images}
              slot="how_to_use_1"
              alt={heading}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="rounded-2xl bg-surface-cream"
            />

            {/*
              "Важно соблюдать" has no slot of its own — it is a list of rules,
              and the wide photo that used to sit behind it was borrowed from
              whatever the product had going widest. It keeps the brand plate
              instead, which is what the design asks for and what reads on a
              phone.
            */}
            <div className="rounded-2xl bg-brand-pink-soft p-6 sm:p-8">
              <h3 className="text-base font-bold text-white">
                {warnings?.title || t("product.importantTitle")}
              </h3>
              {warnings ? (
                <ul className="mt-3 space-y-1.5">
                  {warnings.items.map((rule) => (
                    <li
                      key={rule}
                      className="text-xs leading-relaxed text-white/90 before:mr-1.5 before:content-['•'] sm:text-sm"
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-white/90 sm:text-sm">
                  {t("product.importantText")}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
