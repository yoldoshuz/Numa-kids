import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — bolalar uchun vitaminlar`,
    short_name: SITE_NAME,
    description:
      "Ilmiy asoslangan bolalar vitaminlari: kalsiy D3, multivitaminlar, probiotiklar va Omega-3.",
    start_url: "/uz",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#fd5a90",
    lang: "uz",
    categories: ["health", "shopping", "lifestyle"],
    // Square renders of the logo. The wordmark is 600x171 — declaring it as
    // 512x512, as this list used to, leaves an installed app with a
    // browser-generated icon instead.
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
