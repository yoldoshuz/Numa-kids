import type { AppLocale } from "@/lib/i18n/routing";

export type Locale = AppLocale;

/** Colour system shared by product cards, badges and CTA buttons. */
export type Accent = "pink" | "blue" | "green" | "orange";

export type ProductCategory =
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

export interface TeamCard {
  id: string;
  image: string;
  /** Vertical offset in the staggered hero row, in pixels at desktop size. */
  offset: number;
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
  id: "email" | "phone" | "address" | "hours";
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
  href: string;
}
