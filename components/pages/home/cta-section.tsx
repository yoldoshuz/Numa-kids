import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import { Link } from "@/lib/i18n/navigation";

export function CtaSection() {
  const t = useTranslations("cta");

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-surface-blush via-brand-pink-tint to-white py-16 sm:py-24">
      <Sparkles />
      <Container className="text-center">
        <h2 className="text-3xl leading-tight font-extrabold text-brand-ink sm:text-[2.6rem]">
          {t("title")}
          <br />
          <span className="text-brand-pink">{t("titleAccent")}</span>
        </h2>

        <p className="mt-6 text-base text-brand-ink/70">{t("delivery")}</p>
        <p className="text-base text-brand-ink/70">{t("guarantee")}</p>

        <Link
          href="/consultation"
          className="mt-9 inline-flex rounded-full bg-brand-pink px-14 py-4 text-lg font-bold text-white shadow-lg shadow-brand-pink/30 transition hover:brightness-105 active:translate-y-px"
        >
          {t("button")}
        </Link>
      </Container>
    </section>
  );
}
