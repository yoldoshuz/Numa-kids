import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ConsultationForm } from "@/components/pages/consultation/consultation-form";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return buildMetadata({
    locale,
    title: t("consultation.title"),
    description: t("consultation.description"),
    path: "/consultation",
  });
}

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  return (
    <>
      <ConsultationForm />

      <JsonLd
        data={[
          breadcrumbJsonLd(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("consultation.title"), path: "/consultation" },
            ],
            locale,
          ),
        ]}
      />
    </>
  );
}
