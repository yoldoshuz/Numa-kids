import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

/**
 * Next.js 16 renamed the `middleware` convention to `proxy`.
 * next-intl handles locale negotiation and the `/` -> `/{locale}` redirect.
 */
export const proxy = createMiddleware(routing);

export const config = {
  // Skip Next.js internals, the API surface and anything with a file extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
