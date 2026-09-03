import { defineRouting } from "next-intl/routing";

/**
 * Uzbek first, and first in this list: the shops sell in Uzbekistan, and the
 * order here is the order the language switcher offers.
 */
export const locales = ["uz", "ru", "en"] as const;
export const defaultLocale = "uz" satisfies (typeof locales)[number];

export type AppLocale = (typeof locales)[number];

/**
 * Locale prefix is always visible (`/uz/...`, `/ru/...`) so every page has one
 * canonical URL per language — required for clean `hreflang` and indexing.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});
