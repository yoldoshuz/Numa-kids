"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Container } from "@/components/shared/container";

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The backend is not wired yet — validate locally and confirm optimistically.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  return (
    <section className="bg-brand-cocoa py-10 text-white sm:py-12">
      <Container className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
        <div className="flex items-center gap-5 text-center lg:text-left">
          <span
            aria-hidden="true"
            className="hidden size-14 shrink-0 place-items-center rounded-xl bg-white/10 sm:grid"
          >
            <Mail className="size-7" />
          </span>
          <p className="text-xl leading-snug font-medium sm:text-2xl">
            {t("title")}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            {t("placeholder")}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus("idle");
            }}
            placeholder={t("placeholder")}
            aria-invalid={status === "error"}
            className="h-13 flex-1 rounded-full border border-white/15 bg-white/10 px-6 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
          />
          <button
            type="submit"
            className="h-13 shrink-0 rounded-full bg-brand-orange px-7 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t("button")}
          </button>
        </form>
      </Container>

      {status !== "idle" && (
        <Container>
          <p
            role="status"
            className={`mt-4 text-sm ${status === "done" ? "text-green-action" : "text-brand-pink-soft"}`}
          >
            {status === "done" ? t("success") : t("error")}
          </p>
        </Container>
      )}
    </section>
  );
}
