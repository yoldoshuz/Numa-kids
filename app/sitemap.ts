import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { ARTICLES, PRODUCTS } from "@/lib/data";
import { locales } from "@/lib/i18n/routing";

interface Route {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string;
}

const STATIC_ROUTES: Route[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contacts", priority: 0.6, changeFrequency: "monthly" },
  { path: "/consultation", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Route[] = [
    ...STATIC_ROUTES,
    ...PRODUCTS.map((product) => ({
      path: `/products/${product.slug}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    ...ARTICLES.map((article) => ({
      path: `/blog/${article.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: article.publishedAt,
    })),
  ];

  const now = new Date();

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route.path === "/" ? "" : route.path}`,
      lastModified: route.lastModified ? new Date(route.lastModified) : now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [
            code,
            `${SITE_URL}/${code}${route.path === "/" ? "" : route.path}`,
          ]),
        ),
      },
    })),
  );
}
