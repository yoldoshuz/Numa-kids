"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  className?: string;
  variant?: "floating" | "inline";
}

export function CarouselControls({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  className,
  variant = "inline",
}: CarouselControlsProps) {
  const t = useTranslations("common");

  const base =
    variant === "floating"
      ? "grid size-11 place-items-center rounded-full bg-brand-pink-soft text-white shadow-lg transition hover:bg-brand-pink disabled:opacity-30"
      : "grid size-9 place-items-center rounded-full border border-border bg-white text-brand-ink transition hover:border-brand-pink hover:text-brand-pink disabled:opacity-30";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={t("prev")}
        className={base}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label={t("next")}
        className={base}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
