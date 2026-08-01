"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Container } from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/lib/i18n/navigation";

const FIELD =
  "h-14 w-full rounded-xl border-transparent bg-white px-5 text-base text-brand-ink placeholder:text-brand-ink/35 focus-visible:border-brand-pink focus-visible:ring-brand-pink/30";

export function ConsultationForm() {
  const t = useTranslations("consultation");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const next: typeof errors = {};
    if (name.length < 2) next.name = t("errors.name");
    if (phone.replace(/\D/g, "").length < 9) next.phone = t("errors.phone");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No backend yet: simulate the request so the success state is reachable.
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setOpen(true);
      form.reset();
    }, 400);
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="rounded-[2rem] bg-surface-peach px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <h1 className="text-3xl font-extrabold text-brand-ink sm:text-[2.6rem]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-brand-ink/60 sm:text-lg">
            {t("subtitle")}
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="consult-name"
                  className="block text-base text-brand-ink/80"
                >
                  {t("form.name")}
                  <span className="text-brand-pink" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> ({t("form.required")})</span>
                </label>
                <Input
                  id="consult-name"
                  name="name"
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "consult-name-error" : undefined}
                  placeholder={t("form.namePlaceholder")}
                  className={`${FIELD} mt-2`}
                />
                {errors.name && (
                  <p id="consult-name-error" className="mt-1.5 text-sm text-brand-pink">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="consult-phone"
                  className="block text-base text-brand-ink/80"
                >
                  {t("form.phone")}
                  <span className="text-brand-pink" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> ({t("form.required")})</span>
                </label>
                <Input
                  id="consult-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? "consult-phone-error" : undefined
                  }
                  placeholder={t("form.phonePlaceholder")}
                  className={`${FIELD} mt-2`}
                />
                {errors.phone && (
                  <p
                    id="consult-phone-error"
                    className="mt-1.5 text-sm text-brand-pink"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="consult-subject"
                className="block text-base text-brand-ink/80"
              >
                {t("form.subject")}
              </label>
              <Input
                id="consult-subject"
                name="subject"
                placeholder={t("form.subjectPlaceholder")}
                className={`${FIELD} mt-2`}
              />
            </div>

            <div>
              <label
                htmlFor="consult-message"
                className="block text-base text-brand-ink/80"
              >
                {t("form.message")}
              </label>
              <Textarea
                id="consult-message"
                name="message"
                rows={6}
                placeholder={t("form.messagePlaceholder")}
                className="mt-2 w-full rounded-xl border-transparent bg-white px-5 py-4 text-base text-brand-ink placeholder:text-brand-ink/35 focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
              />
            </div>

            <p className="rounded-xl bg-white px-5 py-4 text-sm text-brand-ink/60">
              {t("form.note")}
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={pending}
                className="h-14 w-full max-w-md rounded-xl bg-brand-pink-soft text-base font-bold text-white transition hover:bg-brand-pink disabled:opacity-70"
              >
                {pending ? t("form.submitting") : t("form.submit")}
              </button>
            </div>
          </form>
        </div>
      </Container>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-xl gap-0 rounded-2xl px-8 py-14 text-center sm:max-w-xl"
        >
          <DialogClose
            aria-label={tCommon("close")}
            className="absolute top-5 right-5 grid size-8 place-items-center rounded-full border border-brand-pink text-brand-pink transition hover:bg-brand-pink-tint"
          >
            <X className="size-4" />
          </DialogClose>

          <DialogTitle className="text-xl font-normal text-brand-ink">
            {t("success.title")}
          </DialogTitle>
          <DialogDescription className="mt-6 text-lg leading-relaxed text-brand-ink/80">
            {t("success.text")}
          </DialogDescription>
          <p className="mt-6 text-lg leading-relaxed text-brand-ink/80">
            {t("success.time")}
          </p>

          <div className="mx-auto mt-10 flex w-full max-w-xs flex-col gap-3">
            <DialogClose
              render={
                <Link
                  href="/"
                  className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
                />
              }
            >
              {t("success.backHome")}
            </DialogClose>
            <DialogClose
              render={
                <Link
                  href="/products"
                  className="rounded-full border border-brand-pink px-6 py-2.5 text-sm font-bold text-brand-pink transition hover:bg-brand-pink-tint"
                />
              }
            >
              {t("success.goToCatalog")}
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
