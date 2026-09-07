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
import type {
  Accent,
  Article,
  ArticleTopic,
  Product,
  ProductCategory,
  ReviewCard,
} from "@/types";
import type { AppLocale } from "@/lib/i18n/routing";

import { isSoldOut } from "@/lib/utils";
import { isApiConfigured } from "./config";
import { resolveMediaUrl } from "./media";
import {
  getBlogFeed,
  getBlogPostBySlug,
  getFeatured,
  getProductBySlug,
  getProductList,
  getReviews,
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
 * The product's place in the catalogue grid.
 *
 * `sortOrder` is the backend's own column, set from the admin's arrows, and it
 * wins whenever it has been set. It starts at 0 for every product, so a
 * catalogue nobody has ordered by hand falls through to `attributes.order`
 * (where the position briefly lived) and then to the bundled catalogue, which
 * is the sequence this storefront shipped with.
 */
function resolveOrder(
  sortOrder: number | undefined,
  attributeOrder: unknown,
  bundled: number | undefined,
  fallback: number,
): number {
  if (typeof sortOrder === "number" && sortOrder > 0) return sortOrder;
  const legacy = Number(attributeOrder);
  if (Number.isFinite(legacy) && legacy > 0) return legacy;
  return bundled ?? fallback;
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
    order: resolveOrder(api.sortOrder, attrs.order, base?.order, index + 1),
    // Only the by-slug response carries these, so on a list they are simply
    // absent — the catalogue has no use for them and they would bloat the
    // response.
    blocks: api.blocks?.length ? [...api.blocks].sort((a, b) => a.position - b.position) : undefined,
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

/**
 * The catalogue in the order the shop wants it shown.
 *
 * The API answers in its own insertion order, which has nothing to do with the
 * merchandising sequence, so `order` — the admin's `sortOrder`, falling back to
 * the bundled catalogue — is what decides the grid. The sort is stable, so
 * products sharing a number keep the order the API sent.
 */
const byOrder = (products: Product[]) => [...products].sort((a, b) => a.order - b.order);

export async function getProducts(): Promise<Product[]> {
  const api = await fetchApiProducts();
  if (!api?.length) return byOrder(PRODUCTS);
  return byOrder(api.map(toProduct));
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

  if (!api?.length) return byOrder(PRODUCTS.filter((p) => p.isTop));
  /*
   * Sold-out products are dropped here rather than badged.
   *
   * The catalogue has to keep listing them — people search for a product by
   * name and need to find it, if only to read that it is gone. A "popular
   * products" shelf is the opposite job: a shortlist the storefront chose, and
   * spending one of its few slots on something nobody can buy is a waste of the
   * best space on the home page. `isFeatured` is set in the admin and never
   * cleared when stock runs out, so the filter belongs on this side.
   */
  return byOrder(api.map(toProduct).filter((product) => !isSoldOut(product)));
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

/**
 * Published reviews, in the reader's language.
 *
 * `null` means "use the bundled copy" — returned both when the CMS cannot be
 * reached and when it answers with nothing. The empty case is deliberate: the
 * reviews are being migrated into the CMS store by store, and until a store is
 * filled in, an empty response would silently delete a section that is on the
 * page today. The moment the admin publishes one review, the CMS wins.
 *
 * Tones and avatars are not CMS fields: they cycle through the palette the
 * section was designed around, so a review added in the admin lands looking
 * like the rest without anyone picking a colour.
 */
const REVIEW_TONES = ["yellow", "pink", "orange"] as const;
const REVIEW_AVATARS = [
  "/images/reviews/avatar-1.jpg",
  "/images/reviews/avatar-2.jpg",
  "/images/reviews/avatar-3.jpg",
];

export async function getReviewCards(locale: AppLocale): Promise<ReviewCard[] | null> {
  const api = await tryFetch(() => getReviews());
  if (!api?.items?.length) return null;

  return api.items.map((review, index) => ({
    id: review.id,
    name: review.authorName ?? review.title[locale] ?? "",
    text: review.description[locale] ?? "",
    rating: review.rating,
    videoUrl: review.videoUrl,
    avatar: REVIEW_AVATARS[index % REVIEW_AVATARS.length],
    tone: REVIEW_TONES[index % REVIEW_TONES.length],
  }));
}
