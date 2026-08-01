import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { CERTIFICATES } from "@/lib/data";

export function CertificatesSection() {
  const t = useTranslations("certificates");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-brand-ink uppercase sm:text-[2rem]">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-brand-ink/60">
          {t("subtitle")}
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CERTIFICATES.map((certificate) => (
            <li
              key={certificate.id}
              className="flex flex-col items-center rounded-2xl bg-surface-cream px-5 py-8 text-center ring-1 ring-border transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={certificate.image}
                alt={t(`items.${certificate.id}.title`)}
                width={100}
                height={100}
                sizes="100px"
                className="size-[92px] object-contain"
              />
              <h3 className="mt-5 text-sm font-extrabold tracking-wide text-brand-ink">
                {t(`items.${certificate.id}.title`)}
              </h3>
              <p className="mt-2 text-sm text-brand-ink/70">
                {t(`items.${certificate.id}.subtitle`)}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-brand-ink/45">
                {t(`items.${certificate.id}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
