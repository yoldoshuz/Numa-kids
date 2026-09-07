"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Container } from "@/components/shared/container";

/** Uzbek mobile numbers carry nine national digits after the +998 code. */
const UZ_PHONE_DIGITS = 9;

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The backend is not wired yet — validate locally and confirm optimistically.
    if (phone.length !== UZ_PHONE_DIGITS) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setPhone("");
  }

  return (
    <section className="bg-brand-cocoa py-10 text-white sm:py-12">
      <Container className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
        <div className="flex items-center gap-5 text-center lg:text-left">
          <span
            aria-hidden="true"
            className="hidden size-14 shrink-0 place-items-center rounded-xl bg-white/10 sm:grid"
          >
            <Phone className="size-7" />
          </span>
          <p className="text-xl leading-snug font-medium sm:text-2xl">
            {t("title")}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-phone" className="sr-only">
            {t("label")}
          </label>
          {/*
            The field is a notch taller on a phone (`h-14`) than on the desktop
            row it shares with the button (`sm:h-13`): the touch target was the
            complaint on mobile, where it stacks full-width above the button.
            A fixed "+998" chip pins the country code so only the nine national
            digits are typed — that is the Uzbek mobile format.
          */}
          <div className="flex h-14 w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 pr-6 pl-5 focus-within:border-white/40 sm:h-13 sm:flex-1">
            <span className="text-sm font-medium text-white/70 select-none">
              +998
            </span>
            <input
              id="newsletter-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              value={phone}
              onChange={(event) => {
                // Keep digits only and cap at the nine national digits, so the
                // value is always a clean number regardless of how it is typed.
                setPhone(event.target.value.replace(/\D/g, "").slice(0, UZ_PHONE_DIGITS));
                setStatus("idle");
              }}
              placeholder={t("placeholder")}
              aria-invalid={status === "error"}
              className="h-full w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-14 shrink-0 rounded-full bg-brand-orange px-7 text-sm font-semibold text-white transition hover:brightness-110 sm:h-13"
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
