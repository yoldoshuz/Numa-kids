import { useTranslations } from "next-intl";

import { ArticleCard } from "@/components/shared/article-card";
import { Container } from "@/components/shared/container";
import { ARTICLES } from "@/lib/data";

export function ArticlesSection() {
  const t = useTranslations("articlesSection");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h2 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-16">
          {ARTICLES.slice(0, 2).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}
