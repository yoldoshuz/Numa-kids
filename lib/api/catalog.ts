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

const img = (url: string | null | undefined) => resolveMediaUrl(url);
const imgs = (urls: (string | null | undefined)[] | undefined) =>
  (urls ?? []).map(img).filter(Boolean);

const isCategory = (value: unknown): value is ProductCategory =>
  typeof value === "string" && (PRODUCT_CATEGORIES as readonly string[]).includes(value);

/**
 * The photos uploaded through the admin, the one marked main first and the rest
 * in their sort order.
 *
 * These outrank `attributes.images` on purpose. `attributes` is seed data that
 * no admin screen writes to, so as long as it won, a moderator could replace a
 * product's whole photo set and watch the storefront ignore every one of them.
 */
function uploadedShots(api: ApiProduct): string[] {
  return [...(api.media ?? [])]
    .filter((m) => m.type !== "video")
    .sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.sortOrder - b.sortOrder)
    .map((m) => img(m.url))
    .filter(Boolean);
}

/**
 * Folds an API product onto the storefront's `Product`.
 *
 * Precedence for every field is live record → seeded `attributes` → the bundled
 * static entry, so whatever a moderator can edit is what the page shows and the
 * rest still has something to fall back on.
 */
function toProduct(api: ApiProduct, index: number): Product {
  const attrs = api.attributes ?? {};
  const images = attrs.images ?? {};
  const base = staticProduct(api.slug);
  const shots = uploadedShots(api);
  const card = shots[0] || img(images.card) || base?.image || "";
  const gallery = shots.length
    ? shots
    : images.gallery
      ? imgs(images.gallery)
      : (base?.gallery ?? []);

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
    banner: shots.length
      ? shots
      : images.banner
        ? imgs(images.banner)
        : (base?.banner ?? [card]),
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

/**
 * The products an article recommends, with the editor's note for the lead one.
 *
 * An article that explains which vitamins matter and then stops is a dead end —
 * the parent has to go back to the catalogue and work out which jar was meant.
 * The list is curated per article in the admin CMS, so what it offers is always
 * what the text is about.
 *
 * Resolved against the storefront's own catalogue rather than the junction's
 * trimmed payload, so these cards carry the same imagery and copy as everywhere
 * else. Empty when the API is unreachable, so the strip is conditional rather
 * than a hole in the layout.
 */
export async function getArticleProducts(
  slug: string,
): Promise<{ products: Product[]; note: string | null }> {
  const api = await tryFetch(() => getBlogPostBySlug(slug));
  const rows = [...(api?.products ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!rows.length) return { products: [], note: null };

  const catalogue = await getProducts();
  const bySlug = new Map(catalogue.map((product) => [product.slug, product]));

  return {
    products: rows
      .map((row) => bySlug.get(row.product?.slug ?? ""))
      .filter((product): product is Product => product !== undefined),
    note: rows.find((row) => row.note)?.note ?? null,
  };
}
