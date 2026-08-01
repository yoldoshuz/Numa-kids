import {
  CONTACTS,
  CURRENCY,
  localizedAddress,
  SITE_NAME,
  SOCIALS,
} from "@/lib/constants";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import type { AppLocale } from "@/lib/i18n/routing";

type JsonLd = Record<string, unknown>;

/** JSON.stringify is not XSS-safe on its own — escape `<` before injecting. */
export function serializeJsonLd(data: JsonLd | JsonLd[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(locale: AppLocale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale)),
    logo: absoluteUrl("/images/logo.png"),
    email: CONTACTS.email,
    telephone: CONTACTS.phone,
    sameAs: SOCIALS.map((social) => social.href),
    address: {
      "@type": "PostalAddress",
      addressCountry: "UZ",
      addressLocality: locale === "ru" ? "Ташкент" : "Toshkent",
      streetAddress: localizedAddress(locale),
    },
  };
}

export function websiteJsonLd(locale: AppLocale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale)),
    inLanguage: locale,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(localizedPath(locale, "/products"))}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: AppLocale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function productJsonLd(
  {
    name,
    description,
    image,
    price,
    slug,
  }: {
    name: string;
    description: string;
    image: string;
    price: number;
    slug: string;
  },
  locale: AppLocale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absoluteUrl(image),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: locale === "ru" ? "Детские витамины" : "Children's vitamins",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(localizedPath(locale, `/products/${slug}`)),
      priceCurrency: CURRENCY,
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${absoluteUrl("/")}#organization` },
    },
  };
}

export function articleJsonLd(
  {
    title,
    description,
    image,
    slug,
    publishedAt,
  }: {
    title: string;
    description: string;
    image: string;
    slug: string;
    publishedAt: string;
  },
  locale: AppLocale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: absoluteUrl(image),
    datePublished: publishedAt,
    dateModified: publishedAt,
    inLanguage: locale,
    mainEntityOfPage: absoluteUrl(localizedPath(locale, `/blog/${slug}`)),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function itemListJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: AppLocale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}
