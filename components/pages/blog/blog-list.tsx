"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { ArticleRow } from "@/components/shared/article-card";
import { Container } from "@/components/shared/container";
import { FilterPills } from "@/components/shared/filter-pills";
import { ALL_FILTER, useQueryFilter } from "@/hooks";
import type { Article } from "@/types";

const TOPICS = ["immunity", "gut-health", "nutrition", "vitamins"] as const;

export function BlogList({ articles: allArticles }: { articles: Article[] }) {
  const t = useTranslations();
  const [topic, setTopic] = useQueryFilter("topic", TOPICS);

  const options = useMemo(
    () => [
      { value: ALL_FILTER, label: t("blogPage.all") },
      ...TOPICS.map((value) => ({
        value,
        label: t(`articleTopics.${value}`),
      })),
    ],
    [t],
  );

  const articles = useMemo(
    () =>
      topic === ALL_FILTER
        ? allArticles
        : allArticles.filter((article) => article.topic === topic),
    [topic, allArticles],
  );

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <FilterPills
          options={options}
          value={topic}
          onChange={setTopic}
          label={t("blogPage.title")}
        />

        {articles.length === 0 ? (
          <p className="mt-16 text-center text-brand-ink/50">
            {t("blogPage.empty")}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 lg:mt-14">
            {articles.map((article) => (
              <ArticleRow key={article.slug} article={article} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
