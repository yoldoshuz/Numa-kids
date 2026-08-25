import type { AppLocale } from "@/lib/i18n/routing";

export type Locale = AppLocale;

/** Colour system shared by product cards, badges and CTA buttons. */
export type Accent = "pink" | "blue" | "green" | "orange";

export type ProductCategory =
  | "antiparasitic"
  | "vitamin-c"
  | "vitamin-d3"
  | "magnesium"
  | "omega-3"
  | "multi"
  | "probiotics";

export interface ProductEffect {
  /** i18n key suffix under `product.effects` */
  id: string;
  value: number;
}

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
  /** Lifestyle shots for the details gallery. */
  gallery: string[];
  /** Wide banner used by the advantages carousel. */
  banner: string[];
  price: number;
  strains: number;
  isTop: boolean;
  /** Slot numbers printed on the "tag" below every card in the design. */
  order: number;
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
