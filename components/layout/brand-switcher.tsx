"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { SIBLING_SITES } from "@/lib/constants";

/**
 * The logo doubles as an entry point to the other NUMA properties
 * (see `figma/logo-dropdown-to-other-sites.png`).
 */
export function BrandSwitcher() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function schedule(next: boolean) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(next), next ? 0 : 150);
  }

  return (
    <div
      ref={wrapper}
      className="relative"
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
    >
      <div className="flex items-center gap-1">
        <BrandLogo priority />
        <button
          type="button"
          aria-label={t("common.otherBrands")}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-7 place-items-center rounded-full text-brand-ink/40 transition hover:bg-brand-pink-tint hover:text-brand-pink"
        >
          <ChevronRight
            className={`size-4 transition-transform ${open ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div
          className="animate-rise absolute top-full left-0 z-50 mt-3 w-72 rounded-2xl bg-brand-pink-soft p-3 shadow-xl"
          role="menu"
        >
          {SIBLING_SITES.map((site) => (
            <a
              key={site.id}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/25"
            >
              <span className="size-9 shrink-0 rounded-lg bg-gradient-to-br from-white/70 to-white/25 ring-1 ring-white/50" />
              <span className="flex-1 text-sm font-bold tracking-wide text-white">
                {t(`brands.${site.id}`)}
              </span>
              <ChevronRight className="size-4 text-white/80" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
