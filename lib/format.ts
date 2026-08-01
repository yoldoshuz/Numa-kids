import type { AppLocale } from "@/lib/i18n/routing";

const NUMBER_LOCALE: Record<AppLocale, string> = {
  ru: "ru-RU",
  en: "en-US",
  uz: "uz-Latn-UZ",
};

/**
 * 250000 -> "250 000" with a non-breaking space. The design groups thousands
 * with a space in every language, so the grouping is fixed here instead of
 * following the locale — en-US and uz-Latn-UZ would render "250,000".
 */
export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })
    .format(value)
    .replace(/\s/g, " ");
}

export function formatDate(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(NUMBER_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
