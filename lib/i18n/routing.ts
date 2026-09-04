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
  /*
   * Uzbek for anyone arriving without a locale in the URL.
   *
   * next-intl defaults `localeDetection` to true, and its resolution order is
   * path, then cookie, then `accept-language`, then the default — so a browser
   * announcing Russian was landing on /ru even though the shop asked for Uzbek
   * by default, and the year-long cookie then pinned it there. Off, the bare
   * "/" always resolves to `defaultLocale`. Switching language still works and
   * still sticks while browsing: `localePrefix: "always"` means every internal
   * link carries its own locale.
   */
  localeDetection: false,
});
