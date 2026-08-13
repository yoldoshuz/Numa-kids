"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";

import { BrandSwitcher } from "@/components/layout/brand-switcher";
import { CartButton } from "@/components/layout/cart-button";
import { LoginButton } from "@/components/layout/login-button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Container } from "@/components/shared/container";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/lib/constants";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

function subscribeToScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
}

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Scroll position is browser state, so it is subscribed to rather than
  // mirrored into React state from an effect.
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/90 backdrop-blur-md transition-shadow",
        scrolled && "shadow-[0_1px_0_0_rgba(23,28,51,0.08)]",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4 sm:h-24">
        <BrandSwitcher />

        <nav
          aria-label={t("common.menu")}
          className="hidden items-center gap-8 lg:flex xl:gap-12"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative text-base text-brand-ink/80 transition hover:text-brand-pink",
                isActive(item.href) &&
                  "font-semibold text-brand-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand-pink",
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 [&>*]:h-11 sm:gap-2">
          {/* Worded further along for wider screens; this is the phone one. */}
          <LoginButton compact className="sm:hidden" />
          <CartButton />
          <LocaleSwitcher className="hidden sm:flex" />
          <LoginButton />
          <Link
            href="/consultation"
            className="hidden h-11 items-center rounded-full bg-brand-yellow px-5 text-sm font-medium text-brand-ink transition hover:brightness-105 sm:inline-flex"
          >
            {t("common.consultation")}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label={t("common.menu")}
                  className="grid h-11 w-11 place-items-center rounded-full bg-surface-sand text-brand-ink lg:hidden"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-[85vw] max-w-sm p-0"
            >
              <SheetHeader className="flex-row items-center justify-between border-b border-border p-6">
                <SheetTitle className="text-lg font-bold">
                  {t("common.menu")}
                </SheetTitle>
                <SheetClose
                  aria-label={t("common.close")}
                  className="grid size-9 place-items-center rounded-full bg-surface-sand text-brand-ink"
                >
                  <X className="size-4" />
                </SheetClose>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-4">
                {NAV_ITEMS.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-xl px-4 py-3.5 text-base transition hover:bg-surface-sand",
                          isActive(item.href) &&
                            "bg-brand-pink-tint font-semibold text-brand-pink-deep",
                        )}
                      />
                    }
                  >
                    {t(`nav.${item.key}`)}
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-border p-6">
                <LocaleSwitcher className="w-full justify-between" />
                <SheetClose
                  render={
                    <Link
                      href="/consultation"
                      className="rounded-xl bg-brand-yellow px-5 py-3.5 text-center text-sm font-semibold text-brand-ink"
                    />
                  }
                >
                  {t("common.consultation")}
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
