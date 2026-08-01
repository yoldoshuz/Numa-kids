import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";

const ITEMS = ["safe", "natural", "quality"] as const;

export function TrustSection() {
  const t = useTranslations("trust");

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24 md:pt-28 md:pb-32">
      <Sparkles />
      <Container className="text-center">
        <h2 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {t("title")}
          <br />
          <span className="text-brand-magenta">{t("titleAccent")}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-brand-ink/60 sm:text-base">
          {t("subtitle")}
        </p>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
          {ITEMS.map((item) => (
            <li
              key={item}
              className="rounded-2xl bg-white px-6 py-6 text-center shadow-[0_2px_12px_rgba(23,28,51,0.06)] ring-1 ring-border transition hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(23,28,51,0.09)]"
            >
              <h3 className="text-base font-bold text-brand-ink">
                {t(`items.${item}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/55">
                {t(`items.${item}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
