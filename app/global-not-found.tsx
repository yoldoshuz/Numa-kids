import type { Metadata } from "next";
import Link from "next/link";
import { Onest } from "next/font/google";

import { SITE_NAME, SITE_URL } from "@/lib/constants";

import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `404 — ${SITE_NAME}`,
  description: "Страница не найдена / Page not found",
  robots: { index: false, follow: false },
};

/**
 * Rendered for URLs that match no route at all. It bypasses the locale layout,
 * so styles, fonts and copy are inlined here and shown bilingually.
 */
export default function GlobalNotFound() {
  return (
    <html lang="ru" className={`${onest.variable} h-full`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="text-6xl font-extrabold text-brand-pink">404</p>
        <h1 className="text-2xl font-extrabold text-brand-ink">
          Страница не найдена · Page not found
        </h1>
        <p className="max-w-md text-brand-ink/60">
          Проверьте адрес или вернитесь на главную. · Check the address or go
          back to the home page.
        </p>
        <Link
          href="/ru"
          className="mt-2 rounded-full bg-brand-pink px-8 py-3.5 text-sm font-bold text-white"
        >
          На главную · Home
        </Link>
      </body>
    </html>
  );
}
