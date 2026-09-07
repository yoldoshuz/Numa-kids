import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { DecorDot, DecorStar } from "@/components/shared/sparkles";
import { FAQ_ITEMS } from "@/lib/data";

export function FaqSection() {
  const t = useTranslations("contacts");

  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-[2.6rem]">
          {t("faqTitle")}
        </h2>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAQ_ITEMS.map((item, index) => (
            <li
              key={item.id}
              className={`relative isolate overflow-hidden rounded-2xl px-6 py-8 ${item.tint}`}
            >
              {index % 2 === 0 ? (
                <DecorStar className="absolute -bottom-1 left-4 -z-10 h-7 w-7 text-star-gold" />
              ) : (
                <DecorStar className="absolute top-3 right-4 -z-10 h-7 w-7 text-star-gold" />
              )}
              <DecorDot className="absolute top-6 right-6 -z-10 bg-star-blush" />

              <h3 className="text-center text-base leading-snug font-bold text-brand-ink">
                {t(`faq.${item.id}.question`)}
              </h3>
              <p className="mt-5 text-center text-sm leading-relaxed text-brand-ink/60">
                {t(`faq.${item.id}.answer`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
