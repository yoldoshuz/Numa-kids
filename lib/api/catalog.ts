/**
 * The storefront's catalogue, resolved from the API with the bundled static
 * catalogue as a fallback.
 *
 * Every exported function answers with the storefront's own domain types, so
 * page components are identical in both modes. When the backend is unreachable
 * — unconfigured, down, slow, or serving garbage — the static data in
 * `lib/data.ts` takes over and the shop keeps working, minus live stock.
 */

import { ARTICLES, PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/data";
import type { Accent, Article, ArticleTopic, Product, ProductCategory } from "@/types";

import { isApiConfigured } from "./config";
import { resolveMediaUrl } from "./media";
import {
  getBlogFeed,
  getBlogPostBySlug,
  getFeatured,
  getProductBySlug,
  getProductList,
} from "./endpoints";
import type { ApiBlogPost, ApiProduct } from "./types";

/* ── mapping ─────────────────────────────────────────────────────────────── */

const staticProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
const staticArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

const mainMediaUrl = (api: ApiProduct): string | undefined =>
  (api.media ?? []).find((m) => m.isMain)?.url ?? (api.media ?? [])[0]?.url;

const img = (url: string | null | undefined) => resolveMediaUrl(url);
const imgs = (urls: (string | null | undefined)[] | undefined) =>
  (urls ?? []).map(img).filter(Boolean);

const isCategory = (value: unknown): value is ProductCategory =>
  typeof value === "string" && (PRODUCT_CATEGORIES as readonly string[]).includes(value);

/**
 * Folds an API product onto the storefront's `Product`.
 *
 * The seeded catalogue carries the storefront's own imagery and facets in
 * `attributes`, so this is normally a straight read. The static entry is
 * consulted only for fields a CMS-authored product would not have — which is
 * what keeps a hand-created product renderable instead of blank.
 */
function toProduct(api: ApiProduct, index: number): Product {
  const attrs = api.attributes ?? {};
  const images = attrs.images ?? {};
  const base = staticProduct(api.slug);
  const card = img(images.card ?? mainMediaUrl(api)) || base?.image || "";
  const gallery = images.gallery
    ? imgs(images.gallery)
    : (base?.gallery ?? imgs((api.media ?? []).map((m) => m.url)));

  return {
    id: api.id,
    stock: api.stock,
    slug: api.slug,
    category:
      (isCategory(attrs.category) && attrs.category) ||
      (isCategory(api.category?.slug) && api.category.slug) ||
      base?.category ||
      "multi",
    accent: (attrs.accent as Accent) ?? base?.accent ?? "blue",
    image: card,
    gallery: gallery.length ? gallery : [card],
    banner: images.banner ? imgs(images.banner) : (base?.banner ?? [card]),
    price: Number(api.discountPrice ?? api.price),
    strains: attrs.strains ?? base?.strains ?? 0,
    isTop: attrs.isTop ?? api.isFeatured,
    order: attrs.order ?? base?.order ?? index + 1,
  };
}

function toArticle(api: ApiBlogPost): Article {
  const base = staticArticle(api.slug);
  return {
    slug: api.slug,
    topic: (api.tags?.[0] ?? base?.topic ?? "vitamins") as ArticleTopic,
    image: img(api.coverImageUrl) || base?.image || "",
    readingTime: api.readTimeMinutes ?? base?.readingTime ?? 5,
    publishedAt: (api.publishedAt ?? base?.publishedAt ?? "").slice(0, 10),
    accent: base?.accent ?? "blue",
  };
}

/* ── fetchers ────────────────────────────────────────────────────────────── */

/** Resolves to `null` on any failure, which is the caller's cue to fall back. */
async function tryFetch<T>(run: () => Promise<T>): Promise<T | null> {
  if (!isApiConfigured()) return null;
  try {
    return await run();
  } catch {
    return null;
  }
}

/** Raw API products — used by the i18n content overlay, which needs `attributes`. */
export async function fetchApiProducts(): Promise<ApiProduct[] | null> {
  return tryFetch(async () => (await getProductList()).products ?? []);
}

export async function fetchApiBlogPosts(): Promise<ApiBlogPost[] | null> {
  return tryFetch(async () => {
    const data = await getBlogFeed();
    return Array.isArray(data) ? data : (data.posts ?? []);
  });
}

/* ── public surface ──────────────────────────────────────────────────────── */

export async function getProducts(): Promise<Product[]> {
  const api = await fetchApiProducts();
  if (!api?.length) return PRODUCTS;
  return api.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const api = await tryFetch(() => getProductBySlug(slug));
  return api ? toProduct(api, 0) : staticProduct(slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const api = await tryFetch(async () => {
    const data = await getFeatured();
    return Array.isArray(data) ? data : (data.rows ?? []);
  });

  if (!api?.length) return PRODUCTS.filter((p) => p.isTop);
  return api.map(toProduct);
}

export async function getArticles(): Promise<Article[]> {
  const api = await fetchApiBlogPosts();
  if (!api?.length) return ARTICLES;
  return api.map(toArticle).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const api = await tryFetch(() => getBlogPostBySlug(slug));
  return api ? toArticle(api) : staticArticle(slug);
}
