import { Container } from "@/components/shared/container";
import { DecorDot, DecorStar } from "@/components/shared/sparkles";
import type { ProductContent } from "@/lib/api/blocks";

const TINT = ["bg-tint-rose", "bg-blue-card", "bg-surface-cream", "bg-surface-sand"];

/**
 * Questions and answers about one product, written in the admin.
 *
 * There is no bundled fallback and none is wanted: this section exists only
 * when a moderator has something to answer, so a product with no FAQ block
 * simply does not have the section — which is why the page renders it
 * conditionally rather than with an empty state.
 *
 * Cards rather than an accordion: the questions a parent asks about a jar of
 * vitamins are short, and hiding four two-line answers behind four clicks
 * makes them harder to read, not tidier. The tints cycle through the palette
 * the rest of the storefront is built from, so a question added in the admin
 * lands looking like the page without anyone picking a colour.
 */
export function ProductFaq({ content }: { content?: ProductContent }) {
  const faq = content?.faq;
  if (!faq) return null;

  return (
    <section className="py-14 sm:py-20">
      <Container>
        {faq.title && (
          <h2 className="text-center text-3xl font-extrabold text-brand-ink sm:text-4xl">
            {faq.title}
          </h2>
        )}

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {faq.items.map((item, index) => (
            <li
              key={item.question}
              className={`relative isolate overflow-hidden rounded-2xl px-6 py-7 ${
                TINT[index % TINT.length]
              }`}
            >
              {index % 2 === 0 ? (
                <DecorStar className="absolute -bottom-1 left-4 -z-10 h-7 w-7 text-star-gold" />
              ) : (
                <DecorStar className="absolute top-3 right-4 -z-10 h-7 w-7 text-star-gold" />
              )}
              <DecorDot className="absolute top-6 right-6 -z-10 bg-star-blush" />

              <h3 className="text-base leading-snug font-bold text-brand-ink">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-brand-ink/60">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
