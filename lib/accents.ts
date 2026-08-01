import type { Accent } from "@/types";

/**
 * Single source of truth for the four product colour ways used across cards,
 * badges, buttons and the details page.
 */
export const ACCENT: Record<
  Accent,
  {
    card: string;
    text: string;
    action: string;
    actionHover: string;
    badge: string;
    badgeText: string;
    ring: string;
    dot: string;
  }
> = {
  pink: {
    card: "bg-pink-card",
    text: "text-pink-ink",
    action: "bg-pink-action",
    actionHover: "hover:bg-pink-badge",
    badge: "bg-pink-badge",
    badgeText: "text-white",
    ring: "ring-pink-action",
    dot: "bg-pink-badge",
  },
  blue: {
    card: "bg-blue-card",
    text: "text-blue-ink",
    action: "bg-blue-action",
    actionHover: "hover:bg-blue-badge",
    badge: "bg-blue-badge",
    badgeText: "text-white",
    ring: "ring-blue-action",
    dot: "bg-blue-badge",
  },
  green: {
    card: "bg-green-card",
    text: "text-green-ink",
    action: "bg-green-action",
    actionHover: "hover:bg-green-ink",
    badge: "bg-green-badge",
    badgeText: "text-white",
    ring: "ring-green-action",
    dot: "bg-green-badge",
  },
  orange: {
    card: "bg-orange-card",
    text: "text-orange-ink",
    action: "bg-orange-action",
    actionHover: "hover:bg-orange-ink",
    badge: "bg-orange-badge",
    badgeText: "text-white",
    ring: "ring-orange-action",
    dot: "bg-orange-badge",
  },
};
