"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { locales, type AppLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

function Flag({ locale }: { locale: AppLocale }) {
  if (locale === "ru") {
    return (
      <svg viewBox="0 0 24 16" aria-hidden="true" className="h-3.5 w-5 rounded-[2px]">
        <rect width="24" height="16" fill="#fff" />
        <rect y="5.33" width="24" height="5.34" fill="#0039A6" />
        <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
      </svg>
    );
  }
  if (locale === "uz") {
    return (
      <svg
        viewBox="0 0 24 16"
        aria-hidden="true"
        className="h-3.5 w-5 rounded-[2px]"
      >
        <rect width="24" height="16" fill="#0099B5" />
        <rect y="5" width="24" height="6" fill="#fff" />
        <rect y="11" width="24" height="5" fill="#1EB53A" />
        <rect y="4.6" width="24" height="0.5" fill="#CE1126" />
        <rect y="10.9" width="24" height="0.5" fill="#CE1126" />
        <circle cx="4.4" cy="2.6" r="1.7" fill="#fff" />
        <circle cx="5.1" cy="2.6" r="1.7" fill="#0099B5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-3.5 w-5 rounded-[2px]">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("locale");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string | null) {
    if (!next || next === locale) return;
    startTransition(() => {
      // `pathname` already has the locale prefix stripped and dynamic segments
      // resolved, so the same path is simply re-prefixed with the new locale.
      router.replace(pathname, { locale: next as AppLocale });
    });
  }

  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger
        aria-label={t("label")}
        className={cn(
          // One radius and height with the rest of the bar; the caret only added width.
          "!h-11 gap-2 rounded-full border-border bg-white px-3 text-sm font-medium text-brand-ink [&>svg:last-child]:hidden",
          isPending && "opacity-60",
          className,
        )}
      >
        <SelectValue>
          {(value: string) => (
            <span className="flex items-center gap-2">
              <Flag locale={(value as AppLocale) ?? locale} />
              {t((value as AppLocale) ?? locale)}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-28">
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            <span className="flex items-center gap-2">
              <Flag locale={code} />
              {t(code)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
