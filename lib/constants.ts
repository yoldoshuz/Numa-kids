import type { NavItem, SiblingSite } from "@/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://numakids.com";

export const SITE_NAME = "NUMA KIDS";

export const CONTACTS = {
  email: "info@numakids.com",
  phone: "+998 71 203-22-32",
  phoneHref: "tel:+998712032232",
  address: "123456, г. Ташкент, ул. Здоровья, 15, офис 301",
  addressEn: "123456, Tashkent, Zdorovya st. 15, office 301",
  addressUz: "123456, Toshkent sh., Salomatlik ko'chasi, 15-uy, 301-ofis",
} as const;

export const SOCIALS = [
  { id: "facebook", href: "https://facebook.com/numakids" },
  { id: "instagram", href: "https://instagram.com/numakids" },
  { id: "tiktok", href: "https://tiktok.com/@numakids" },
] as const;

export const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/blog", key: "blog" },
  { href: "/contacts", key: "contacts" },
];

export const FOOTER_CATALOG: NavItem[] = [
  { href: "/products", key: "all" },
  { href: "/products?category=vitamin-c", key: "vitaminC" },
  { href: "/products?category=probiotics", key: "probiotics" },
  { href: "/products?category=omega-3", key: "omega" },
  { href: "/products?category=multi", key: "multi" },
];

export const FOOTER_INFO: NavItem[] = [
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/delivery", key: "delivery" },
  { href: "/returns", key: "returns" },
  { href: "/contacts#faq", key: "faq" },
];

/** Sibling brands surfaced from the logo dropdown. */
export const SIBLING_SITES: SiblingSite[] = [
  { id: "family", href: "https://numafamily.com" },
  { id: "catering", href: "https://numacatering.com" },
  { id: "tabobat", href: "https://nabaviytabobat.uz" },
];

export const CURRENCY = "UZS";

/** Postal address in the reader's language. */
export function localizedAddress(locale: string) {
  if (locale === "ru") return CONTACTS.address;
  if (locale === "uz") return CONTACTS.addressUz;
  return CONTACTS.addressEn;
}
