import { defineRouting } from "next-intl/routing";

export const locales = ["ru", "en", "uz"] as const;
export const defaultLocale = "ru" satisfies (typeof locales)[number];

export type AppLocale = (typeof locales)[number];

/**
 * Locale prefix is always visible (`/ru/...`, `/en/...`) so every page has one
 * canonical URL per language — required for clean `hreflang` and indexing.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});
