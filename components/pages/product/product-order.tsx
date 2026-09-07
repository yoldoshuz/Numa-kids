import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { CONTACTS } from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";

export function ProductOrder() {
  const t = useTranslations("product");

  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-brand-pink-soft px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {t("orderTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/90">
            {t("orderText")}
          </p>

          <Link
            href="/consultation"
            className="mt-8 inline-flex rounded-xl bg-white px-16 py-4 text-lg font-bold text-brand-ink transition hover:brightness-95 active:translate-y-px"
          >
            {t("orderButton")}
          </Link>

          <a
            href={CONTACTS.phoneHref}
            className="mt-6 block text-lg font-medium text-white/95 hover:underline"
          >
            {CONTACTS.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
