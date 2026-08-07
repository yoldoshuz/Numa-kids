"use client";

import { useEffect, useState } from "react";

/**
 * Advances a counter on an interval, pausing while the tab is hidden and
 * standing still entirely for visitors who ask for reduced motion.
 *
 * Returned as a raw tick rather than an index so callers can decide what
 * rotating means for them — which slot a card occupies, which slide is shown.
 */
export function useRotation(intervalMs: number, enabled = true): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let timer: number | undefined;

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => setTick((value) => value + 1), intervalMs);
    };

    // A background tab would otherwise queue up a burst of rotations that all
    // land at once when the visitor comes back.
    const onVisibility = () => {
      if (document.hidden) window.clearInterval(timer);
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled]);

  return tick;
}
