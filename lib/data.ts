import type {
  Article,
  Certificate,
  ContactChannel,
  FaqItem,
  Product,
  ProductCategory,
  Review,
  TeamCard,
} from "@/types";

/**
 * Static catalogue. Only structural data lives here — every string is resolved
 * through `messages/*.json`, so the shop is fully bilingual before the backend
 * is wired in.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "rikki",
    category: "antiparasitic",
    accent: "green",
    image: "/images/products/rikki.png",
    gallery: [
      "/images/products/bonny-shot-1.jpg",
      "/images/products/bonny-shot-2.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-banner.jpg", "/images/products/bonny-hero.jpg"],
    price: 390_000,
    strains: 90,
    isTop: true,
    order: 1,
  },
  {
    slug: "bonny",
    category: "vitamin-d3",
    accent: "pink",
    image: "/images/products/bonny.png",
    gallery: [
      "/images/products/bonny-shot-1.jpg",
      "/images/products/bonny-shot-2.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-banner.jpg", "/images/products/bonny-hero.jpg"],
    price: 390_000,
    strains: 24,
    isTop: true,
    order: 2,
  },
  {
    slug: "jekky",
    category: "probiotics",
    accent: "green",
    image: "/images/products/jekky.png",
    gallery: [
      "/images/products/bonny-shot-1.jpg",
      "/images/products/bonny-shot-2.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-banner.jpg", "/images/products/bonny-hero.jpg"],
    price: 390_000,
    strains: 24,
    isTop: true,
    order: 3,
  },
  {
    slug: "genny",
    category: "omega-3",
    accent: "orange",
    image: "/images/products/genny.png",
    gallery: [
      "/images/products/bonny-shot-2.jpg",
      "/images/products/bonny-shot-1.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-hero.jpg", "/images/products/bonny-banner.jpg"],
    price: 120_000,
    strains: 24,
    isTop: true,
    order: 4,
  },
  {
    slug: "funny",
    category: "multi",
    accent: "blue",
    image: "/images/products/funny.png",
    gallery: [
      "/images/products/bonny-shot-2.jpg",
      "/images/products/bonny-shot-1.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-hero.jpg", "/images/products/bonny-banner.jpg"],
    price: 120_000,
    strains: 24,
    isTop: true,
    order: 5,
  },
  {
    slug: "vitty",
    category: "vitamin-c",
    accent: "pink",
    image: "/images/products/funny.png",
    gallery: [
      "/images/products/bonny-shot-1.jpg",
      "/images/products/bonny-shot-2.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-banner.jpg", "/images/products/bonny-hero.jpg"],
    price: 120_000,
    strains: 24,
    isTop: true,
    order: 6,
  },
  {
    slug: "magny",
    category: "magnesium",
    accent: "blue",
    image: "/images/products/bonny.png",
    gallery: [
      "/images/products/bonny-shot-2.jpg",
      "/images/products/bonny-shot-1.jpg",
      "/images/products/kist.jpg",
    ],
    banner: ["/images/products/bonny-hero.jpg", "/images/products/bonny-banner.jpg"],
    price: 120_000,
    strains: 24,
    isTop: true,
    order: 7,
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "antiparasitic",
  "vitamin-c",
  "vitamin-d3",
  "magnesium",
  "omega-3",
  "multi",
  "probiotics",
];

export const ARTICLES: Article[] = [
  {
    slug: "science-of-immunity",
    topic: "immunity",
    image: "/images/blog/article-1.jpg",
    readingTime: 5,
    publishedAt: "2026-05-18",
    accent: "blue",
  },
  {
    slug: "gut-is-the-second-brain",
    topic: "gut-health",
    image: "/images/blog/article-2.jpg",
    readingTime: 7,
    publishedAt: "2026-04-27",
    accent: "green",
  },
  {
    slug: "focus-and-brain-development",
    topic: "vitamins",
    image: "/images/blog/article-3.jpg",
    readingTime: 5,
    publishedAt: "2026-03-14",
    accent: "blue",
  },
  {
    slug: "healthy-snacks-for-active-kids",
    topic: "nutrition",
    image: "/images/blog/article-4.jpg",
    readingTime: 5,
    publishedAt: "2026-02-09",
    accent: "green",
  },
];

/** Hero arches — staggered exactly like the Figma composition. */
export const TEAM_CARDS: TeamCard[] = [
  { id: "green", image: "/images/teams/green.jpg", offset: 0 },
  { id: "yellow", image: "/images/teams/yellow.jpg", offset: 36 },
  { id: "purple", image: "/images/teams/purple.jpg", offset: 72 },
  { id: "red", image: "/images/teams/red.jpg", offset: 36 },
  { id: "orange", image: "/images/teams/orange.jpg", offset: 0 },
];

export const CERTIFICATES: Certificate[] = [
  { id: "euro-leaf", image: "/images/certificates/euro-leaf.png" },
  { id: "halal", image: "/images/certificates/halal.png" },
  { id: "usda", image: "/images/certificates/usda.png" },
  { id: "iso", image: "/images/certificates/iso.png" },
  { id: "gmp", image: "/images/certificates/gmp.png" },
];

export const REVIEWS: Review[] = [
  { id: "madina", avatar: "/images/reviews/avatar-1.jpg", tone: "yellow" },
  { id: "rasul", avatar: "/images/reviews/avatar-2.jpg", tone: "pink" },
  { id: "zilola", avatar: "/images/reviews/avatar-3.jpg", tone: "orange" },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  { id: "email", tint: "bg-tint-rose" },
  { id: "phone", tint: "bg-tint-sky" },
  { id: "address", tint: "bg-tint-mint" },
  { id: "hours", tint: "bg-tint-butter" },
];

export const FAQ_ITEMS: FaqItem[] = [
  { id: "production", tint: "bg-tint-lilac" },
  { id: "delivery", tint: "bg-tint-cream" },
  { id: "returns", tint: "bg-tint-mint" },
  { id: "choose", tint: "bg-tint-frost" },
];

/** Ids for the product-details "why you need it" grid. */
export const PRODUCT_PURPOSES = [
  "teeth",
  "joints",
  "growth",
  "activity",
  "immunity",
  "energy",
] as const;

/** Ids for the numbered intake timeline. */
export const PRODUCT_INTAKE_STEPS = [
  "dosage",
  "regularity",
  "afterMeal",
  "storage",
] as const;

/** Pills orbiting the packshot in the composition block. */
export const PRODUCT_FACTS = [
  "dosage",
  "course",
  "natural",
  "active",
] as const;

export const PRODUCT_ADVANTAGES = [
  "skin",
  "heart",
  "inflammation",
  "vision",
  "energy",
  "memory",
] as const;

export const PRODUCT_EFFECTS = [
  { id: "bones", value: 95 },
  { id: "growth", value: 90 },
  { id: "calcium", value: 88 },
  { id: "immunity", value: 92 },
  { id: "energy", value: 90 },
  { id: "safety", value: 100 },
] as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}
