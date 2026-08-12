import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactChannels } from "@/components/pages/contacts/contact-channels";
import { ContactForm } from "@/components/pages/contacts/contact-form";
import { FaqSection } from "@/components/pages/contacts/faq-section";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { FAQ_ITEMS } from "@/lib/data";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/json-ld";
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
    title: t("contacts.title"),
    description: t("contacts.description"),
    path: "/contacts",
  });
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  return (
    <>
      <PageHero
        title={t("contacts.title")}
        subtitle={t("contacts.subtitle")}
        image="/images/mascots/bonny-alt.png"
        imageAlt={t("hero.mascots.surfing")}
      />

      <section className="py-12 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,470px)_1fr] lg:gap-14">
          <ContactChannels />
          <ContactForm />
        </Container>
      </section>

      <FaqSection />

      <JsonLd
        data={[
          breadcrumbJsonLd(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("contacts.title"), path: "/contacts" },
            ],
            locale,
          ),
          faqJsonLd(
            FAQ_ITEMS.map((item) => ({
              question: t(`contacts.faq.${item.id}.question`),
              answer: t(`contacts.faq.${item.id}.answer`),
            })),
          ),
        ]}
      />
    </>
  );
}
