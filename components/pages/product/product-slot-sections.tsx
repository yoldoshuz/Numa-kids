/**
 * The four sections that are nothing but a photograph.
 *
 * They have no block in the CMS and no copy to speak of — a label shot, a
 * lifestyle frame, a certificate, a wide strip — so each one exists exactly as
 * long as its slot has a file in it and disappears when it does not. Every slot
 * here has been in the admin and fillable for a while; Rikki's certificate has
 * been sitting uploaded and unseen because the page had nowhere to put it.
 */

import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SlotImage } from "@/components/shared/slot-image";
import { hasSlots } from "@/lib/product-images";
import type { Product } from "@/types";

/** Состав / этикетка — the pack read close up, shot square. */
export function ProductLabel({ product }: { product: Product }) {
  const t = useTranslations();
  if (!hasSlots(product.images, "composition_1")) return null;

  const name = t(`products.${product.slug}.shortName`);

  return (
    <section className="py-14 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
            {t("product.slots.compositionTitle")}
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-brand-ink/60">
            {t("product.slots.compositionText", { name })}
          </p>
        </div>
        <SlotImage
          images={product.images}
          slot="composition_1"
          alt={t("product.slots.compositionTitle")}
          sizes="(max-width: 1024px) 100vw, 420px"
          className="rounded-3xl bg-surface-cream"
          imageClassName="p-4"
        />
      </Container>
    </section>
  );
}

/** The lifestyle frame — the product in a kitchen rather than on a plate. */
export function ProductLifestyle({ product }: { product: Product }) {
  const t = useTranslations();
  if (!hasSlots(product.images, "lifestyle_1")) return null;

  const name = t(`products.${product.slug}.shortName`);

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <SlotImage
          images={product.images}
          slot="lifestyle_1"
          alt={t("product.slots.lifestyleTitle", { name })}
          sizes="(max-width: 1280px) 100vw, 1200px"
          fit="cover"
          className="rounded-3xl bg-surface-cream"
        />
      </Container>
    </section>
  );
}

/** Сертификат — upright, so it is readable rather than decorative. */
export function ProductCertificate({ product }: { product: Product }) {
  const t = useTranslations();
  if (!hasSlots(product.images, "certificate_1")) return null;

  return (
    <section className="py-14 sm:py-20">
      <Container className="grid items-center gap-10 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-14">
        <SlotImage
          images={product.images}
          slot="certificate_1"
          alt={t("product.slots.certificateTitle")}
          sizes="(max-width: 640px) 80vw, 300px"
          className="mx-auto w-full max-w-[300px] rounded-2xl bg-white ring-1 ring-border"
          imageClassName="p-3"
        />
        <div>
          <h2 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
            {t("product.slots.certificateTitle")}
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-brand-ink/60">
            {t("product.slots.certificateText")}
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * The wide strip. This is the slot for a 3:1 band — the one place on the page
 * where a letterbox is the photograph's own shape rather than a crop of it.
 */
export function ProductBanner({ product }: { product: Product }) {
  const t = useTranslations();
  if (!hasSlots(product.images, "banner_wide")) return null;

  return (
    <section className="pb-14 sm:pb-20">
      <Container>
        <SlotImage
          images={product.images}
          slot="banner_wide"
          alt={t(`products.${product.slug}.shortName`)}
          sizes="(max-width: 1280px) 100vw, 1200px"
          fit="cover"
          className="rounded-3xl bg-surface-cream"
        />
      </Container>
    </section>
  );
}
