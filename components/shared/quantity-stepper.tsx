"use client";

import { Minus, Plus } from "lucide-react";

import { ACCENT } from "@/lib/accents";
import { cn } from "@/lib/utils";
import type { Accent } from "@/types";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  accent: Accent;
  /** Stepping below this removes the line, so it defaults to 0, not 1. */
  min?: number;
  max?: number;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  className?: string;
}

/**
 * Replaces the "Buy" button once a product is in the cart. It matches the
 * button's pill shape and height so a card never changes size when the
 * shopper adds something — the grid would otherwise reflow under the cursor.
 */
export function QuantityStepper({
  value,
  onChange,
  accent,
  min = 0,
  max = 99,
  label,
  decreaseLabel,
  increaseLabel,
  className,
}: QuantityStepperProps) {
  const tone = ACCENT[accent];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-white",
        tone.action,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={decreaseLabel}
        className="grid size-9 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <output aria-label={label} className="min-w-7 text-center text-base font-bold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={increaseLabel}
        className="grid size-9 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
