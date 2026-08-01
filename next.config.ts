import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // The root layout lives under `app/[locale]`, so unmatched URLs need a
    // dedicated global 404 that does not depend on the dynamic segment.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
