"use client";

import { useCallback, useSyncExternalStore } from "react";

export const ALL_FILTER = "all";

const CHANGE_EVENT = "numa-kids:query-change";

function subscribe(listener: () => void) {
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
