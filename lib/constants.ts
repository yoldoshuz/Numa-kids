import type { NavItem, SiblingSite } from "@/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://numakids.com";

export const SITE_NAME = "NUMA KIDS";

export const CONTACTS = {
  /*
   * Two Telegram destinations, and they are not interchangeable. `telegram` is
   * the brand's public channel — footers, the contact card, structured data,
   * anywhere the site is just saying where to find it. `telegramAdmin` is a
   * person and belongs only behind a button offering to carry on a
   * conversation. Dropping someone from a footer icon into a private chat with
   * an administrator is what split these apart.
   */
  email: "numafamilyuz@gmail.com",
  emailHref: "mailto:numafamilyuz@gmail.com",
  instagram: "@numakids.uz",
  instagramHref: "https://www.instagram.com/numakids.uz",
  telegram: "@numa_kids",
  telegramHref: "https://t.me/numa_kids",
  telegramAdmin: "@Numa_uz_admin",
  telegramAdminHref: "https://t.me/Numa_uz_admin",
  facebookHref: "https://www.facebook.com/share/1ErFh5Xmsd/",
  youtubeHref: "https://www.youtube.com/@numakids",
  phone: "+998 55 513 33 33",
  phoneHref: "tel:+998555133333",
  address: "Ташкент, Яшнабадский район, ул. Элбек, 31",
  addressEn: "Tashkent, Yashnabad district, Elbek street, 31",
  addressUz: "Toshkent, Yashnobod tumani, Elbek koʻchasi, 31",
} as const;

/**
 * Delivery for a single-unit order, UZS; from two units up it is free.
 *
 * The API is the source of truth (`shared/utils/money.ts`) and every online
 * cart shows its figure. This copy only prices the offline fallback, where
 * there is no server to ask — keep the two in step.
 */
export const DELIVERY_FEE = 50_000;

export const FREE_DELIVERY_MIN_QUANTITY = 2;

/** Footer social row. `label` is spelled out — "Youtube" from a capitalised
 * id is wrong, and the network names are not translated in any locale. */
export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: CONTACTS.instagramHref },
  { id: "telegram", label: "Telegram", href: CONTACTS.telegramHref },
  { id: "facebook", label: "Facebook", href: CONTACTS.facebookHref },
  { id: "youtube", label: "YouTube", href: CONTACTS.youtubeHref },
] as const;

export const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/blog", key: "blog" },
  { href: "/contacts", key: "contacts" },
];

export const FOOTER_CATALOG: NavItem[] = [
  { href: "/products", key: "all" },
  { href: "/products?category=antiparasitic", key: "antiparasitic" },
  { href: "/products?category=probiotics", key: "probiotics" },
  { href: "/products?category=omega-3", key: "omega" },
  { href: "/products?category=multi", key: "multi" },
];

export const FOOTER_INFO: NavItem[] = [
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/delivery", key: "delivery" },
  // "Natijalar" — what parents got, which is the reviews block, not a returns page.
  { href: "/#reviews", key: "results" },
  { href: "/contacts#faq", key: "faq" },
];

/** Sibling brands surfaced from the logo dropdown. */
/**
 * The four NUMA properties, surfaced from the logo dropdown.
 *
 * Every site carries the whole list including itself, so the menu reads the
 * same everywhere and a visitor can always see where they currently are. The
 * logos live in each site's own `public/brands/` — copied rather than
 * hot-linked, so a neighbour being down never leaves a hole in this menu.
 *
 * These are the deploy URLs, not the brand domains: numafamily.uz,
 * numanutrition.uz and nabaviytabobat.uz do not resolve yet, and a dropdown of
 * dead links is worse than no dropdown. Swap them the day DNS is cut over.
 */
export const SIBLING_SITES: SiblingSite[] = [
  {
    id: "nutrition",
    label: "NUMA NUTRITION",
    href: "https://numa-nutritition.vercel.app",
    logo: "/brands/nutrition.png",
  },
  {
    id: "kids",
    label: "NUMA KIDS",
    href: "https://numa-kids-olive.vercel.app/ru",
    logo: "/brands/kids.png",
  },
  {
    id: "family",
    label: "NUMA FAMILY",
    href: "https://numa-family.vercel.app/ru",
    logo: "/brands/family.png",
  },
  {
    id: "tabobat",
    label: "NABAVIY TABOBAT",
    href: "https://nabaviy-tabobat.vercel.app",
    logo: "/brands/tabobat.png",
  },
];


export const CURRENCY = "UZS";

/** Postal address in the reader's language. */
export function localizedAddress(locale: string) {
  if (locale === "ru") return CONTACTS.address;
  if (locale === "uz") return CONTACTS.addressUz;
  return CONTACTS.addressEn;
}
