"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "numa-kids:cart";
const EVENT = "numa-kids:cart-change";

export interface CartLine {
  slug: string;
  quantity: number;
}

/** Stable reference so `getServerSnapshot` never triggers a render loop. */
const EMPTY: CartLine[] = [];

const listeners = new Set<() => void>();
let snapshot: CartLine[] = EMPTY;
let snapshotRaw = "";

function read(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  // Cache by raw string so `getSnapshot` stays referentially stable.
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    try {
      const parsed: unknown = JSON.parse(raw);
      snapshot = Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
    } catch {
      snapshot = EMPTY;
    }
  }
  return snapshot;
}

function write(lines: CartLine[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Cart placeholder persisted in `localStorage`. The API mirrors what the
 * backend will expose later, so only this file changes when it lands.
 */
export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);

  const add = useCallback((slug: string, quantity = 1) => {
    const current = read();
    const existing = current.find((line) => line.slug === slug);
    const next = existing
      ? current.map((line) =>
          line.slug === slug
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      : [...current, { slug, quantity }];
    write(next);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((line) => line.slug !== slug));
  }, []);

  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return { lines, count, add, remove };
}
