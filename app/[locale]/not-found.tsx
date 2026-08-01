import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import { Link } from "@/lib/i18n/navigation";

export default function NotFound() {
  const t = useTranslations();

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28">
      <Sparkles />
      <Container className="flex flex-col items-center text-center">
        <Image
          src="/images/mascots/bonny.png"
          alt=""
          width={260}
          height={340}
          className="animate-float h-48 w-auto sm:h-64"
        />
        <p className="mt-8 text-6xl font-extrabold text-brand-pink">404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {t("notFound.title")}
        </h1>
        <p className="mt-4 max-w-md text-brand-ink/60">{t("notFound.text")}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand-pink px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-105"
          >
            {t("common.backHome")}
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-brand-pink px-8 py-3.5 text-sm font-bold text-brand-pink transition hover:bg-brand-pink-tint"
          >
            {t("common.goToCatalog")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
