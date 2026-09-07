"use client";

import { ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth, useCart } from "@/hooks";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * One control in the header, not two.
 *
 * A visitor without an account has nothing to go to but the basket, so that is
 * what the button is. Once someone is signed in the basket stops being a
 * destination of its own — it lives inside the account alongside their orders —
 * and the button becomes the way in there. The badge follows the basket either
 * way, so the count is never hidden by being signed in.
 */
export function CartButton({ className }: { className?: string }) {
  const t = useTranslations("common");
  const tAccount = useTranslations("account");
  const { count, ready } = useCart();
  const { status } = useAuth();

  const signedIn = status === "authenticated";

  return (
    <Link
      href={signedIn ? "/account" : "/cart"}
      aria-label={signedIn ? tAccount("account") : `${t("cart")}${count ? `: ${count}` : ""}`}
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-full bg-brand-yellow/40 text-brand-ink transition hover:bg-brand-yellow/70",
        className,
      )}
    >
      {signedIn ? <User className="size-5" /> : <ShoppingCart className="size-5" />}
      {ready && count > 0 ? (
        <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-brand-pink px-1.5 text-[11px] leading-5 font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
