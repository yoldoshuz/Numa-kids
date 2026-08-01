"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Controller for the scroll-snap carousels used by the catalogue, the reviews
 * block and the product gallery. Keeps native scrolling (and therefore touch,
 * trackpad and keyboard support) while exposing prev/next buttons.
 */
export function useCarousel<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const sync = () => {
      const max = node.scrollWidth - node.clientWidth;
      setCanScrollPrev(node.scrollLeft > 4);
      setCanScrollNext(node.scrollLeft < max - 4);
    };

    node.addEventListener("scroll", sync, { passive: true });

    // Fires once on observe, which also seeds the initial button state.
    const observer = new ResizeObserver(sync);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, []);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const node = ref.current;
    if (!node) return;
    const step = node.firstElementChild?.clientWidth ?? node.clientWidth * 0.8;
    node.scrollBy({ left: direction * (step + 24), behavior: "smooth" });
  }, []);

  const scrollPrev = useCallback(() => scrollBy(-1), [scrollBy]);
  const scrollNext = useCallback(() => scrollBy(1), [scrollBy]);

  return { ref, canScrollPrev, canScrollNext, scrollPrev, scrollNext };
}
