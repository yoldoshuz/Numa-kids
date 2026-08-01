import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { locales, type AppLocale } from "@/lib/i18n/routing";

const OG_LOCALE: Record<AppLocale, string> = {
  ru: "ru_RU",
  en: "en_US",
  uz: "uz_UZ",
};

interface BuildMetadataInput {
  locale: AppLocale;
  title: string;
  description: string;
  /** Path without the locale prefix, e.g. `/products/bonny`. */
  path?: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(locale: AppLocale, path = "/") {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/**
 * Builds a complete, indexable metadata object: canonical URL, hreflang
 * alternates for every locale (plus `x-default`), Open Graph and Twitter cards.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = "/",
  keywords,
  image = "/images/products/bonny-hero.jpg",
  type = "website",
  publishedTime,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const canonical = localizedPath(locale, path);

  const languages = Object.fromEntries(
    locales.map((code) => [code, localizedPath(code, path)]),
  ) as Record<string, string>;
  languages["x-default"] = localizedPath("ru", path);

  return {
    // Titles already carry the brand, so bypass the layout-level template.
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical, languages },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALE[code]),
      url: absoluteUrl(canonical),
      title,
      description,
      images: [{ url: image, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
