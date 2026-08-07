import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { CartProvider, QueryProvider } from "@/hooks";
import { getProducts } from "@/lib/api/catalog";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";

import "../globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fd5a90",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    ...buildMetadata({
      locale,
      title: t("home.title"),
      description: t("home.description"),
      keywords: t("keywords"),
    }),
    title: {
      default: t("home.title"),
      template: `%s | ${SITE_NAME}`,
    },
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: true, address: true, email: true },
    icons: {
      icon: "/favicon.ico",
      apple: "/images/logo.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts the whole subtree into static rendering.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" });

  // The cart addresses items by backend id, so it needs the resolved catalogue.
  const catalog = await getProducts();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${onest.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <NextIntlClientProvider>
          <QueryProvider>
            <CartProvider catalog={catalog}>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand-pink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
              >
                {t("skipToContent")}
              </a>

              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />

              <JsonLd
                data={[
                  organizationJsonLd(locale as AppLocale),
                  websiteJsonLd(locale as AppLocale),
                ]}
              />
            </CartProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
