import Image from "next/image";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { ISO_22000_CERTIFICATE } from "@/lib/constants";
import { CERTIFICATES } from "@/lib/data";

/** The only mark we hold the document for — see `ISO_22000_CERTIFICATE`. */
const DOCUMENTED_ID = "iso";

export function CertificatesSection() {
  const t = useTranslations("certificates");
  // The footer names this document already; reusing its label keeps one string
  // for one PDF instead of two translations that can drift apart.
  const tFooter = useTranslations("footer");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-brand-ink uppercase sm:text-[2rem]">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-brand-ink/60">
          {t("subtitle")}
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CERTIFICATES.map((certificate) => {
            /*
             * Only the mark we hold the PDF for is clickable. The card keeps
             * exactly the same height either way — the affordance is a 14px
             * glyph beside the title, not another line — so one card gaining a
             * link does not stretch the other four to match it.
             */
            const documented = certificate.id === DOCUMENTED_ID;
            const Card = documented ? "a" : "div";
            return (
              <li key={certificate.id} className="h-full">
                <Card
                  {...(documented
                    ? {
                        href: ISO_22000_CERTIFICATE,
                        target: "_blank",
                        rel: "noreferrer noopener",
                      }
                    : {})}
                  className="flex h-full flex-col items-center rounded-2xl bg-surface-cream px-5 py-8 text-center ring-1 ring-border transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                >
                  <Image
                    src={certificate.image}
                    alt={t(`items.${certificate.id}.title`)}
                    width={100}
                    height={100}
                    sizes="100px"
                    className="size-[92px] object-contain"
                  />
                  <h3 className="mt-5 flex items-center gap-1.5 text-sm font-extrabold tracking-wide text-brand-ink">
                    {t(`items.${certificate.id}.title`)}
                    {documented && (
                      <>
                        <FileText className="size-3.5 shrink-0 text-brand-pink" aria-hidden />
                        <span className="sr-only">{tFooter("certificate")}</span>
                      </>
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-brand-ink/70">
                    {t(`items.${certificate.id}.subtitle`)}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-brand-ink/45">
                    {t(`items.${certificate.id}.text`)}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
