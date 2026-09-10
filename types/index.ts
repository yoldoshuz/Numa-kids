import type { ApiProductBlock } from "@/lib/api/types";
import type { ProductImages } from "@/lib/product-images";
import type { AppLocale } from "@/lib/i18n/routing";

export type Locale = AppLocale;

/** Colour system shared by product cards, badges and CTA buttons. */
export type Accent = "pink" | "blue" | "green" | "orange";

export type ProductCategory =
  | "antiparasitic"
  | "vitamin-d3"
  | "iodine"
  | "omega-3"
  | "multi"
  | "probiotics";

export interface Product {
  /**
   * Backend UUID. Present only on products resolved from the API — the server
   * cart addresses items by id, so its absence is what tells the cart to fall
   * back to its local, offline mode.
   */
  id?: string;
  /** Units left in stock; `undefined` when serving the static catalogue. */
  stock?: number;
  slug: string;
  category: ProductCategory;
  accent: Accent;
  /** Packshot with a transparent background. */
  image: string;

  price: number;
  strains: number;
  isTop: boolean;
  /** Slot numbers printed on the "tag" below every card in the design. */
  order: number;
  /**
   * The product page's editable sections, authored in the admin — visible ones
   * only, in the order they should render.
   *
   * Only the by-slug response carries them, so this is present on a product
   * page and absent everywhere else. Absent (or empty) means the page falls
   * back to the copy bundled in `messages/`.
   */
  blocks?: ApiProductBlock[];
  /**
   * Every place a photograph can go on this product's page, keyed by the name
   * of the place.
   *
   * This is the whole of the page's photography. Each section asks for the slot
   * that carries its own name — `benefits` reads `benefits_1`/`benefits_2`,
   * `metrics` reads `metrics_1` — and an empty slot means that section renders
   * without a picture. There is no borrowing from the gallery and no bundled
   * placeholder: both put a photograph of something the customer is not buying
   * onto the page.
   *
   * `image` above stays alongside it because the catalogue lists do not carry
   * this map — a grid of cards needs one photo each, not fifteen.
   */
  images?: ProductImages;
}

export type ArticleTopic =
  | "immunity"
  | "gut-health"
  | "nutrition"
  | "vitamins";

export interface Article {
  slug: string;
  topic: ArticleTopic;
  image: string;
  readingTime: number;
  publishedAt: string;
  accent: Extract<Accent, "blue" | "green">;
}

/** One arch in the hero gallery: a mascot poster that opens its product. */
export interface HeroSlide {
  /** Product the arch links to. Copy is read from `products.<slug>`. */
  slug: string;
  /** Mascot poster, filling the arch. */
  image: string;
  /**
   * The poster's own colour, sampled off the artwork.
   *
   * The whole first screen is washed in it — the section behind the gallery and
   * the halo under the front arch — so the hero takes on the mood of whichever
   * mascot is showing rather than sitting on one fixed brand tint.
   */
  tint: string;
}

export interface Certificate {
  id: string;
  image: string;
}

export interface Review {
  id: string;
  avatar: string;
  tone: "yellow" | "pink" | "orange";
}

/**
 * A review as the section renders it, already in the reader's language.
 *
 * Resolved on the server so the client component never has to know whether the
 * text came from the CMS or from the bundled fallback.
 */
export interface ReviewCard {
  id: string;
  name: string;
  text: string;
  rating: number | null;
  videoUrl: string | null;
  avatar: string;
  tone: "yellow" | "pink" | "orange";
}

export interface ContactChannel {
  id: "email" | "phone" | "telegram" | "instagram" | "address" | "hours";
  tint: string;
  href?: string;
}

export interface FaqItem {
  id: string;
  tint: string;
}

export interface NavItem {
  href: string;
  key: string;
}

export interface SiblingSite {
  id: string;
  /** Brand name — identical in every locale, so it is not a translation key. */
  label: string;
  href: string;
  /** Path under `public/brands/`. */
  logo: string;
}
