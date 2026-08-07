"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/hooks";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const t = useTranslations("common");
  const { count, ready } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`${t("cart")}${count ? `: ${count}` : ""}`}
      className={cn(
        "relative grid size-11 place-items-center rounded-full bg-brand-yellow/40 text-brand-ink transition hover:bg-brand-yellow/70",
        className,
      )}
    >
      <ShoppingCart className="size-5" />
      {ready && count > 0 ? (
        <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-brand-pink px-1.5 text-[11px] leading-5 font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
