import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import type { ProductContent } from "@/lib/api/blocks";
import { PRODUCT_INTAKE_STEPS } from "@/lib/data";
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

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
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

          {/*
            These slots are filled from the product's uploaded photos, which are
            as often an upright jar as a wide frame, so each box states its own
            ratio and the picture letterboxes inside it. A cover-crop of a jar
            is a strip of its label blown up past recognition.
          */}
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-[1.85fr_1fr]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-cream">
                <Image
                  src={product.gallery[1] ?? product.gallery[0]}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, 520px"
                  className="object-contain"
                />
              </div>
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-surface-cream sm:block">
                <Image
                  src={product.gallery[0]}
                  alt={name}
                  fill
                  sizes="280px"
                  className="object-contain"
                />
              </div>
            </div>

            {/*
              The banner used to size itself from the file: as a plain
              `w-full h-full` image its height came from the photo's own ratio,
              so an upright jar stretched this panel to several hundred pixels.
              Below `sm` the caption sits under the photo on a solid plate —
              the overlay gradient fades out on its right, which at phone width
              would leave the text lying on the product.
            */}
            <div className="isolate overflow-hidden rounded-2xl sm:relative">
              <div className="relative aspect-[16/10] w-full bg-surface-cream sm:aspect-[1200/415]">
                <Image
                  src={product.banner[0]}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 820px"
                  className="object-contain"
                />
              </div>
              <div className="hidden bg-gradient-to-r from-brand-pink-soft/95 via-brand-pink-soft/70 to-transparent sm:absolute sm:inset-0 sm:block" />
              <div className="flex flex-col justify-center bg-brand-pink-soft p-6 sm:absolute sm:inset-y-0 sm:left-0 sm:max-w-[60%] sm:bg-transparent sm:p-8">
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
        </div>
      </Container>
    </section>
  );
}
