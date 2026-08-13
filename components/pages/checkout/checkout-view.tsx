"use client";

import Image from "next/image";
import { CircleCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { Container } from "@/components/shared/container";
import { RainbowWord } from "@/components/shared/rainbow-word";
import { useAuth, useCart, useCheckout } from "@/hooks";
import { enabledPaymentMethods, normalizePhone } from "@/lib/api/checkout";
import type { OfferedPaymentMethod } from "@/lib/api/types";
import { ACCENT } from "@/lib/accents";
import { formatPrice } from "@/lib/format";
import { formatUzPhoneInput, UZ_PHONE_PREFIX } from "@/lib/phone";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const fields = ["name", "surname", "phone", "city", "address"] as const;
type FieldKey = (typeof fields)[number];

const autoComplete: Record<FieldKey, string> = {
  name: "given-name",
  surname: "family-name",
  phone: "tel",
  city: "address-level2",
  address: "street-address",
};

export function CheckoutView() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const tCart = useTranslations("cart");
  const tProducts = useTranslations("products");

  const { items, count, subtotal, ready } = useCart();
  const { user } = useAuth();
  const { phase, errorKey, orderId, busy, setErrorKey, submit } = useCheckout();

  // First offered wins, so the preselected method follows the list rather than
  // a second constant that could drift from it.
  const methods = enabledPaymentMethods();

  /**
   * What the account already knows, so a signed-in customer is not asked to
   * type it again. Empty for a guest, who fills the form as before.
   */
  const prefill: Partial<Record<(typeof fields)[number], string>> = user
    ? {
        name: user.firstName,
        surname: user.lastName ?? "",
        phone: formatUzPhoneInput(user.phone),
      }
    : {};
  const [method, setMethod] = useState<OfferedPaymentMethod>(methods[0] ?? "click");
  const [phoneError, setPhoneError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);
    const phone = normalizePhone(String(form.get("phone") ?? ""));
    if (!phone) {
      setPhoneError(true);
      return;
    }

    setPhoneError(false);
    setErrorKey(null);
    submit({
      method,
      payload: {
        customerName: String(form.get("name") ?? "").trim(),
        customerSurname: String(form.get("surname") ?? "").trim(),
        customerPhone: phone,
        // The API takes a single address line; the city input is folded in.
        customerAddress: [form.get("city"), form.get("address")]
          .map((part) => String(part ?? "").trim())
          .filter(Boolean)
          .join(", "),
        deliveryType: "delivery",
      },
    });
  }

  if (orderId && !errorKey) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="flex max-w-md flex-col items-center gap-4 text-center">
          <CircleCheck className="size-16 text-brand-green" strokeWidth={1.5} />
          <h1 className="text-2xl font-extrabold text-brand-ink sm:text-3xl">
            {t("successTitle")}
          </h1>
          <p className="text-sm leading-relaxed text-brand-ink/55">{t("successText")}</p>
          <p className="text-xs text-brand-ink/45">
            {t("orderNumber")}:{" "}
            <span className="font-mono font-semibold text-brand-ink">
              {orderId.slice(0, 8).toUpperCase()}
            </span>
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand-pink px-8 text-sm font-semibold text-white transition hover:bg-brand-pink-deep"
          >
            {tCommon("backHome")}
          </Link>
        </Container>
      </section>
    );
  }

  if (ready && items.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-extrabold text-brand-ink">{t("emptyRedirect")}</h1>
          <Link
            href="/products"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand-pink px-8 text-sm font-semibold text-white transition hover:bg-brand-pink-deep"
          >
            {tCommon("goToCatalog")}
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
          <RainbowWord>{t("title")}</RainbowWord>
        </h1>

        <form key={user?.id ?? "guest"} onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <fieldset
              disabled={busy}
              className="rounded-3xl bg-white p-6 ring-1 ring-brand-ink/8 sm:p-7"
            >
              <legend className="px-1 text-lg font-extrabold text-brand-ink">
                {t("contactTitle")}
              </legend>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field}
                    className={cn("flex flex-col gap-1.5", field === "address" && "sm:col-span-2")}
                  >
                    <label htmlFor={field} className="text-sm font-semibold text-brand-ink">
                      {t(field)} <span className="text-brand-pink">*</span>
                    </label>
                    <input
                      id={field}
                      name={field}
                      defaultValue={

                        prefill[field] ?? (field === "phone" ? UZ_PHONE_PREFIX : undefined)

                      }
                      required
                      type={field === "phone" ? "tel" : "text"}
                      inputMode={field === "phone" ? "tel" : undefined}
                      autoComplete={autoComplete[field]}
                      placeholder={t(`${field}Placeholder`)}
                      {...(field === "phone"
                        ? {
                            // The field carries the country code and regroups
                            // digits as they are typed, so what the customer
                            // sees is what the API will accept.
                            onInput: (event: FormEvent<HTMLInputElement>) => {
                              event.currentTarget.value = formatUzPhoneInput(
                                event.currentTarget.value,
                              );
                            },
                          }
                        : {})}
                      aria-invalid={field === "phone" && phoneError}
                      className={cn(
                        "h-12 rounded-2xl bg-surface-sand px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-ink/35 focus-visible:ring-2 focus-visible:ring-brand-pink/50",
                        field === "phone" && phoneError && "ring-2 ring-red-400",
                      )}
                    />
                    {field === "phone" && phoneError ? (
                      <span role="alert" className="text-xs font-medium text-red-500">
                        {t("errorPhone")}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-brand-ink/8 sm:p-7">
              <h2 className="text-lg font-extrabold text-brand-ink">{t("deliveryTitle")}</h2>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-sand px-4 py-3">
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-brand-ink">
                    {t("deliveryOption")}
                  </span>
                  <span className="block text-xs text-brand-ink/55">{t("deliveryTime")}</span>
                </span>
                <span className="text-sm font-bold text-brand-green">{tCart("free")}</span>
              </div>
            </div>

            <fieldset
              disabled={busy}
              className="rounded-3xl bg-white p-6 ring-1 ring-brand-ink/8 sm:p-7"
            >
              <legend className="px-1 text-lg font-extrabold text-brand-ink">
                {t("paymentTitle")}
              </legend>

              <div className="mt-4 flex flex-col gap-3">
                {methods.map((option) => {
                  const key = option.charAt(0).toUpperCase() + option.slice(1);
                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 transition",
                        method === option
                          ? "bg-brand-pink-tint ring-2 ring-brand-pink"
                          : "bg-surface-sand hover:bg-brand-pink-tint/60",
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option}
                        checked={method === option}
                        onChange={() => setMethod(option)}
                        className="mt-0.5 size-4 accent-brand-pink"
                      />
                      <span className="leading-tight">
                        <span className="block text-sm font-semibold text-brand-ink">
                          {t(`payment${key}`)}
                        </span>
                        <span className="block text-xs text-brand-ink/55">
                          {t(`payment${key}Hint`)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className="h-fit rounded-3xl bg-surface-sand p-6 sm:p-7">
            <h2 className="text-lg font-extrabold text-brand-ink">{t("orderTitle")}</h2>

            <ul className="mt-5 flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.slug} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl",
                      ACCENT[item.product.accent].card,
                    )}
                  >
                    <Image
                      src={item.product.image}
                      alt=""
                      width={56}
                      height={56}
                      sizes="56px"
                      className="h-full w-full object-contain p-1.5"
                    />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-sm font-semibold text-brand-ink">
                      {tProducts(`${item.slug}.name`)}
                    </span>
                    <span className="block text-xs text-brand-ink/55">
                      {item.quantity} {tCart("pcs")}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-brand-ink">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 flex flex-col gap-3 border-t border-brand-ink/10 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-brand-ink/60">{tCart("items", { count })}</dt>
                <dd className="font-semibold text-brand-ink">
                  {formatPrice(subtotal)} {tCommon("currency")}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-brand-ink/60">{tCart("delivery")}</dt>
                <dd className="font-semibold text-brand-green">{tCart("free")}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-brand-ink/10 pt-3">
                <dt className="font-bold text-brand-ink">{tCart("total")}</dt>
                <dd className="text-xl font-extrabold text-brand-ink">
                  {formatPrice(subtotal)} {tCommon("currency")}
                </dd>
              </div>
            </dl>

            {errorKey ? (
              <p role="alert" className="mt-4 text-sm font-medium text-red-500">
                {t(errorKey)}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 text-sm font-semibold text-white transition hover:bg-brand-pink-deep disabled:cursor-not-allowed disabled:opacity-70"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {phase === "submitting"
                ? t("submitting")
                : phase === "redirecting"
                  ? t("redirecting")
                  : method === "cash"
                    ? t("payCash")
                    : t("pay")}
            </button>
          </aside>
        </form>
      </Container>
    </section>
  );
}
