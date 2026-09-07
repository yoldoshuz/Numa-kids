"use client";

import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function FilterPills({
  options,
  value,
  onChange,
  label,
}: FilterPillsProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "shrink-0 snap-start rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap transition sm:text-base",
              isActive
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/30"
                : "bg-surface-sand text-brand-ink/70 hover:bg-brand-pink-tint hover:text-brand-pink-deep",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
