import type {
  Article,
  Certificate,
  ContactChannel,
  FaqItem,
  Product,
  ProductCategory,
  Review,
  HeroSlide,
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
    gallery: ["/images/products/rikki.png"],
    banner: ["/images/products/rikki.png"],
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
    strains: 90,
    isTop: true,
    order: 2,
  },
  {
    slug: "jekky",
    category: "probiotics",
    accent: "green",
    image: "/images/products/jekky.png",
    gallery: ["/images/products/jekky.png"],
    banner: ["/images/products/jekky.png"],
    price: 390_000,
    strains: 90,
    isTop: true,
    order: 3,
  },
  {
    slug: "genny",
    category: "omega-3",
    accent: "orange",
    image: "/images/products/genny.png",
    gallery: ["/images/products/genny.png"],
    banner: ["/images/products/genny.png"],
    price: 390_000,
    strains: 90,
    isTop: true,
    order: 4,
  },
  {
    slug: "funny",
    category: "multi",
    accent: "blue",
    image: "/images/products/funny.png",
    gallery: ["/images/products/funny.png"],
    banner: ["/images/products/funny.png"],
    price: 390_000,
    strains: 90,
    isTop: true,
    order: 5,
  },
  {
    slug: "endomarine",
    category: "iodine",
    accent: "blue",
    image: "/images/products/endomarine.png",
    gallery: ["/images/products/endomarine.png"],
    banner: ["/images/products/endomarine.png"],
    price: 480_000,
    strains: 0,
    isTop: true,
    order: 6,
  },
];

// Vitamin C and magnesium are not in the range; iodine (Endomarine) is.
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "antiparasitic",
  "vitamin-d3",
  "iodine",
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
/**
 * The hero gallery, front arch first at load.
 *
 * The file names are the colours of the old five-team row and say nothing about
 * who is on them — every mascot carries its product's initial instead, which is
 * what these pairings are read off: R on the surfboard, B on the cape clasp, J
 * on the headband, F on the collar, G on the cap. Order puts Bonny in the
 * middle so the first paint matches the approved layout.
 *
 * `tint` is the average colour of each poster, saturated a little so it still
 * reads once it is spread across a whole screen.
 */
export const HERO_SLIDES: HeroSlide[] = [
  { slug: "rikki", image: "/images/teams/green.jpg", tint: "#2fb389" },
  { slug: "genny", image: "/images/teams/orange.jpg", tint: "#3aa3e8" },
  { slug: "bonny", image: "/images/teams/yellow.jpg", tint: "#8e4fd1" },
  { slug: "jekky", image: "/images/teams/purple.jpg", tint: "#7a49c4" },
  { slug: "funny", image: "/images/teams/red.jpg", tint: "#e2374a" },
  // Endomarine has no mascot poster of its own yet — this is the product's own
  // underwater shot, carried over from the Nutrition catalogue and cropped to
  // the same portrait as the rest.
  { slug: "endomarine", image: "/images/teams/endomarine.jpg", tint: "#3f8f93" },
];

export const CERTIFICATES: Certificate[] = [
  { id: "euro-leaf", image: "/images/certificates/euro-leaf.png" },
  { id: "halal", image: "/images/certificates/halal.png" },
  { id: "usda", image: "/images/certificates/usda.png" },
  { id: "iso", image: "/images/certificates/iso.png" },
  { id: "gmp", image: "/images/certificates/gmp.png" },
];

/**
 * Fallback reviews, shown when the CMS cannot be reached.
 *
 * Six avatars for six reviews: the set only has three files, so they repeat.
 */
export const REVIEWS: Review[] = [
  { id: "gulnora", avatar: "/images/reviews/avatar-1.jpg", tone: "yellow" },
  { id: "nigora", avatar: "/images/reviews/avatar-2.jpg", tone: "pink" },
  { id: "dilnoza", avatar: "/images/reviews/avatar-3.jpg", tone: "orange" },
  { id: "shahnoza", avatar: "/images/reviews/avatar-1.jpg", tone: "pink" },
  { id: "malika", avatar: "/images/reviews/avatar-2.jpg", tone: "orange" },
  { id: "zilola", avatar: "/images/reviews/avatar-3.jpg", tone: "yellow" },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  { id: "email", tint: "bg-tint-rose" },
  { id: "phone", tint: "bg-tint-sky" },
  // Added after the tester found the site listing no messenger at all, while
  // every other NUMA storefront pointed people at a Telegram that did not exist.
  { id: "telegram", tint: "bg-tint-frost" },
  { id: "instagram", tint: "bg-tint-lilac" },
  { id: "address", tint: "bg-tint-mint" },
  { id: "hours", tint: "bg-tint-butter" },
];

export const FAQ_ITEMS: FaqItem[] = [
  { id: "production", tint: "bg-tint-lilac" },
  { id: "delivery", tint: "bg-tint-cream" },
  { id: "returns", tint: "bg-tint-mint" },
  { id: "choose", tint: "bg-tint-frost" },
];

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

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

/**
 * The clips on the home page, from youtube.com/@numakids.
 *
 * Titles are the videos' own and stay in Uzbek in every language — they are
 * what the channel published, not copy this site writes, so translating them
 * would mean promising a Russian-language clip that does not exist. That is
 * also why they live here rather than in `messages/`.
 *
 * The first entry is the one the section opens with.
 */
export const HOME_VIDEOS: { id: string; title: string }[] = [
  { id: "URPUqQKICaI", title: "ANTIGELMINT BOX — Gijjalardan butunlay qutulish imkoniyati!" },
  { id: "VIyVL9ELEZE", title: "Bolalar tanasidagi yashirin xavf!" },
  { id: "2MlEX1qUTJI", title: "Nega farzandingiz gijjalardan xalos bo'la olmayapti?" },
  { id: "O2ZxWG7JUF4", title: "Gijjalar qayta yuqmasligi uchun nima qilish kerak?" },
  { id: "-kbcRlKMsY8", title: "Nega farzandingiz o'sishda tengdoshlaridan orqada qolyapti?" },
  { id: "5bDpJExdnSg", title: "Bolalardagi ishtahasizlik sabablari" },
  { id: "foObWfjmbhU", title: "Bolalar go'sht, baliq, tuxum yeyishdan bosh tortishining sababi" },
  { id: "KxhFpLLzeLE", title: "Bolalardagi «ortiqcha vazn» sabablari" },
  { id: "CjpKncmyDC8", title: "Bolalardagi enurezga sabab omillar" },
  { id: "BDrdpDXB2tQ", title: "Farzandingiz «R» harfini aytolmaydimi?" },
];
