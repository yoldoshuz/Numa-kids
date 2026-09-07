"use client";

import { useCallback, useSyncExternalStore } from "react";

export const ALL_FILTER = "all";

const CHANGE_EVENT = "numa-kids:query-change";

/**
 * Makes `history.pushState` / `replaceState` announce themselves.
 *
 * `popstate` covers the back and forward buttons and nothing else — the
 * browser fires no event when a script writes the URL. Next's client-side
 * navigation does exactly that, and it does it *after* committing the new
 * React tree, so a filter mounted by that navigation read the query of the
 * page it came from and never heard about the one it was opened with: the
 * footer's "Omega-3" link landed on the catalogue showing everything until
 * the visitor reloaded by hand.
 *
 * Patched once per document, and only to announce a change the browser has
 * already made — the original method still does the work. The event is
 * queued rather than dispatched inline so the read lands after the commit
 * that triggered it, never during it.
 */
let announced = false;

function announceHistoryWrites() {
  if (announced || typeof window === "undefined") return;
  announced = true;

  for (const name of ["pushState", "replaceState"] as const) {
    const original = window.history[name];
    window.history[name] = function patched(
      this: History,
      ...args: Parameters<History[typeof name]>
    ) {
      const result = original.apply(this, args);
      queueMicrotask(() => window.dispatchEvent(new Event(CHANGE_EVENT)));
      return result;
    };
  }
}

function subscribe(listener: () => void) {
  announceHistoryWrites();
  window.addEventListener("popstate", listener);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function getSearch() {
  return window.location.search;
}

/** The server has no URL query, so the first paint always shows everything. */
function getServerSearch() {
  return "";
}

/**
 * Reads a filter from the URL query without pulling the page into a
 * client-side bailout. The value is subscribed to as external browser state,
 * so the first paint renders the full list and the URL selection is applied
 * right after hydration. Changing the filter rewrites the URL in place, which
 * keeps the selection shareable and bookmarkable.
 */
export function useQueryFilter(param: string, allowed: readonly string[]) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);

  const fromUrl = new URLSearchParams(search).get(param);
  const value = fromUrl && allowed.includes(fromUrl) ? fromUrl : ALL_FILTER;

  const change = useCallback(
    (next: string) => {
      const url = new URL(window.location.href);
      if (next === ALL_FILTER) url.searchParams.delete(param);
      else url.searchParams.set(param, next);
      window.history.replaceState(null, "", url);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [param],
  );

  return [value, change] as const;
}
