import Image from "next/image";
import { useTranslations } from "next-intl";

import { Marquee } from "@/components/layout/marquee";
import { Newsletter } from "@/components/layout/newsletter";
import { Container } from "@/components/shared/container";
import {
  CONTACTS,
  FOOTER_CATALOG,
  FOOTER_INFO,
  ISO_22000_CERTIFICATE,
  SITE_NAME,
  SOCIALS,
} from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <>
      <Marquee />
      <Newsletter />

      <footer className="bg-brand-yellow-deep text-brand-ink">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" aria-label={SITE_NAME} className="inline-flex">
                <Image
                  src="/images/logo.png"
                  alt={SITE_NAME}
                  width={344}
                  height={98}
                  sizes="180px"
                  className="h-12 w-auto"
                />
              </Link>
              <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-brand-ink/70">
                {t("footer.tagline")}
              </p>
              <ul className="mt-6 flex flex-wrap gap-5">
                {SOCIALS.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-brand-ink transition hover:text-brand-pink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-labelledby="footer-catalog">
              <h2
                id="footer-catalog"
                className="text-sm font-bold tracking-wide uppercase"
              >
                {t("footer.catalogTitle")}
              </h2>
              <ul className="mt-5 space-y-3">
                {FOOTER_CATALOG.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-ink/75 transition hover:text-brand-pink"
                    >
                      {t(`footer.catalog.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-info">
              <h2
                id="footer-info"
                className="text-sm font-bold tracking-wide uppercase"
              >
                {t("footer.infoTitle")}
              </h2>
              <ul className="mt-5 space-y-3">
                {FOOTER_INFO.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-ink/75 transition hover:text-brand-pink"
                    >
                      {t(`footer.info.${item.key}`)}
                    </Link>
                  </li>
                ))}
                {/*
                  A plain `<a>`, not the locale-aware `Link`: this is a file in
                  `public/`, and prefixing it with `/ru` would 404.
                */}
                <li>
                  <a
                    href={ISO_22000_CERTIFICATE}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-brand-ink/75 transition hover:text-brand-pink"
                  >
                    {t("footer.certificate")}
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase">
                {t("footer.contactsTitle")}
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-brand-ink/75">
                <li>
                  <a
                    href={`mailto:${CONTACTS.email}`}
                    className="transition hover:text-brand-pink"
                  >
                    {CONTACTS.email}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACTS.phoneHref}
                    className="transition hover:text-brand-pink"
                  >
                    {CONTACTS.phone}
                  </a>
                </li>
                <li className="pt-3 text-brand-ink/60">{t("footer.available")}</li>
              </ul>
            </div>
          </div>
        </Container>

        <div className="border-t border-brand-ink/10 py-5">
          <Container>
            <p className="text-center text-xs font-semibold text-brand-ink/70">
              {t("footer.rights")}
            </p>
          </Container>
        </div>
      </footer>
    </>
  );
}
