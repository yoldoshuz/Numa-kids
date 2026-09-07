"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const t = useTranslations("contacts");
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Wired to the backend later — the UI confirms receipt optimistically.
    setSent(true);
    event.currentTarget.reset();
  }

  const field =
    "h-14 w-full rounded-xl border-border bg-white px-5 text-sm text-brand-ink placeholder:text-brand-ink/40 focus-visible:border-brand-pink focus-visible:ring-brand-pink/30";

  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-border sm:p-8">
      <h2 className="text-2xl font-extrabold text-brand-ink">
        {t("formTitle")}
      </h2>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="sr-only">{t("form.name")}</span>
          <Input name="name" required placeholder={t("form.name")} className={field} />
        </label>

        <label className="block">
          <span className="sr-only">{t("form.email")}</span>
          <Input
            name="email"
            type="email"
            required
            placeholder={t("form.email")}
            className={field}
          />
        </label>

        <label className="block">
          <span className="sr-only">{t("form.subject")}</span>
          <Input name="subject" placeholder={t("form.subject")} className={field} />
        </label>

        <label className="block">
          <span className="sr-only">{t("form.message")}</span>
          <Textarea
            name="message"
            rows={5}
            required
            placeholder={t("form.message")}
            className="w-full rounded-xl border-border bg-white px-5 py-4 text-sm text-brand-ink placeholder:text-brand-ink/40 focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
          />
        </label>

        <button
          type="submit"
          className="h-14 w-full rounded-xl bg-brand-pink-soft text-base font-bold text-white transition hover:bg-brand-pink active:translate-y-px"
        >
          {t("form.submit")}
        </button>

        {sent && (
          <p
            role="status"
            className="rounded-xl bg-green-card px-4 py-3 text-center text-sm font-medium text-green-ink"
          >
            {t("form.sent")}
          </p>
        )}

        <p className="text-center text-xs text-brand-ink/50">
          {t("form.privacy")}
        </p>
      </form>
    </div>
  );
}
