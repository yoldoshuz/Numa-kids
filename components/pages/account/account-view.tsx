"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Loader2,
  LogOut,
  Package,
  Pencil,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { useAuth, useCart } from "@/hooks";
import {
  getMyOrder,
  getMyOrders,
  getProfile,
  getPurchases,
  updateProfile,
  type Purchase,
} from "@/lib/api/account";
import { formatPrice } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const PANEL =
  "rounded-[1.75rem] bg-white p-5 shadow-[0_16px_40px_rgba(23,28,51,0.06)] sm:p-7";

const STATUS_TONE: Record<string, string> = {
  new: "bg-blue-card text-blue-ink",
  processing: "bg-orange-card text-orange-ink",
  completed: "bg-green-card text-green-ink",
  cancelled: "bg-pink-card text-pink-ink",
};

export function AccountView() {
  const t = useTranslations("account");
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-brand-pink" />
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-cream pb-14 sm:pb-20">
      <ProfileHeader />
      <Container className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">
        <CartPanel />
        <OrdersPanel />
        <PurchasesPanel />
      </Container>
    </div>
  );
}

/* ── header ──────────────────────────────────────────────────────────────── */

function ProfileHeader() {
  const t = useTranslations("account");
  const { user, setUser, signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["account", "profile"],
    queryFn: getProfile,
    initialData: user ?? undefined,
  });

  const save = useMutation({
    mutationFn: () =>
      updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() }),
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.setQueryData(["account", "profile"], updated);
      setEditing(false);
    },
  });

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  const initials = [profile?.firstName?.[0], profile?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const field =
    "h-12 w-full rounded-xl bg-white px-3 text-sm text-brand-ink ring-1 ring-brand-pink-tint outline-none focus:ring-2 focus:ring-brand-pink";

  return (
    <section className="bg-surface-peach/70 pt-8 pb-6 sm:pt-12">
      <Container>
        <div className="flex flex-wrap items-center gap-4">
          <span
            aria-hidden
            className="grid size-16 shrink-0 place-items-center rounded-full bg-brand-pink text-xl font-extrabold text-white sm:size-20 sm:text-2xl"
          >
            {initials || "?"}
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl leading-tight font-extrabold break-words text-brand-ink sm:text-3xl">
              {fullName || t("title")}
            </h1>
            {/* The number identifies the account and cannot be edited. */}
            <p className="mt-1 font-mono text-sm text-brand-ink/55">{profile?.phone}</p>
          </div>

          {/* Own line on a phone: beside the name it squeezed it to an ellipsis
              and ran the number under the buttons. */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setFirstName(profile?.firstName ?? "");
                  setLastName(profile?.lastName ?? "");
                  setEditing(true);
                }}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-bold text-brand-ink transition-colors hover:text-brand-pink"
              >
                <Pencil className="size-3.5" />
                {t("edit")}
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/");
              }}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-brand-ink/60 transition-colors hover:text-brand-ink"
            >
              <LogOut className="size-4" />
              {t("signOut")}
            </button>
          </div>
        </div>

        {editing && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
            className="mt-5 grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:p-5"
          >
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder={t("firstName")}
              className={field}
            />
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder={t("lastName")}
              className={field}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={save.isPending || firstName.trim().length < 2}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-pink px-5 text-sm font-bold text-white hover:bg-brand-magenta disabled:opacity-60 sm:flex-none"
              >
                {save.isPending && <Loader2 className="size-4 animate-spin" />}
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-12 rounded-xl px-4 text-sm font-medium text-brand-ink/60"
              >
                {t("cancel")}
              </button>
            </div>
            {save.isError && (
              <p role="alert" className="text-sm text-brand-pink-deep sm:col-span-3">
                {t("errors.network")}
              </p>
            )}
          </form>
        )}
      </Container>
    </section>
  );
}

/* ── shared bits ─────────────────────────────────────────────────────────── */

function PanelHead({
  icon,
  title,
  count,
  hint,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-ink">
          <span className="grid size-9 place-items-center rounded-xl bg-surface-peach text-brand-pink">
            {icon}
          </span>
          {title}
          {count !== undefined && count > 0 && (
            <span className="rounded-full bg-brand-pink-tint px-2 py-0.5 text-xs font-bold text-pink-ink">
              {count}
            </span>
          )}
        </h2>
        {hint && <p className="mt-1.5 text-sm text-brand-ink/55">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon,
  text,
  action,
}: {
  icon: React.ReactNode;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl bg-surface-cream px-4 py-8 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-white text-brand-ink/40">
        {icon}
      </span>
      <p className="text-sm text-brand-ink/60">{text}</p>
      {action}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const t = useTranslations("account");
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[0.6875rem] font-bold",
        STATUS_TONE[status] ?? "bg-surface-cream text-brand-ink/60",
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}

/** Which shop a row came from — one account covers all of them. */
function StoreTag({ store }: { store?: string }) {
  const t = useTranslations("account");
  if (!store) return null;
  return (
    <span className="rounded-full bg-surface-cream px-2.5 py-1 text-[0.6875rem] font-medium text-brand-ink/60">
      {t(`stores.${store}`)}
    </span>
  );
}

/* ── basket ──────────────────────────────────────────────────────────────── */

/**
 * The basket lives in the account rather than on a page of its own: once
 * someone is signed in, what they are about to buy and what they have bought
 * read better as one screen. `/cart` still works — it just stops being where
 * the header points.
 */
function CartPanel() {
  const t = useTranslations("account");
  const tProducts = useTranslations("products");
  const { items, count, subtotal, ready, hasUnavailable } = useCart();

  return (
    <section className={PANEL}>
      <PanelHead
        icon={<ShoppingCart className="size-4" />}
        title={t("cart")}
        count={ready ? count : undefined}
        action={
          ready && count > 0 ? (
            <Link
              href="/checkout"
              className="inline-flex h-12 items-center rounded-2xl bg-brand-pink px-6 text-sm font-bold text-white transition-colors hover:bg-brand-magenta"
            >
              {t("checkout")}
            </Link>
          ) : undefined
        }
      />

      {!ready ? (
        <Loader2 className="mt-5 size-5 animate-spin text-brand-pink" />
      ) : count === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-4" />}
          text={t("emptyCart")}
          action={
            <Link
              href="/products"
              className="text-sm font-bold text-brand-pink hover:underline"
            >
              {t("toCatalogue")}
            </Link>
          }
        />
      ) : (
        <>
          <ul className="mt-5 flex flex-col divide-y divide-brand-pink-tint">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-3 py-3 first:pt-0">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-surface-cream">
                  <Image
                    src={item.product.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-brand-ink">
                    {tProducts(`${item.slug}.name`)}
                  </span>
                  <span className="block text-xs text-brand-ink/55">
                    {formatPrice(item.product.price)} × {item.quantity}
                  </span>
                </span>
                <span className="whitespace-nowrap text-sm font-bold text-brand-ink">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-peach px-4 py-3">
            <span className="text-sm font-bold text-brand-ink">{t("total")}</span>
            <span className="text-xl font-extrabold text-brand-ink">
              {formatPrice(subtotal)}
            </span>
          </div>

          {hasUnavailable && (
            <p className="mt-3 text-sm text-brand-pink-deep">{t("cartUnavailable")}</p>
          )}
        </>
      )}
    </section>
  );
}

/* ── orders ──────────────────────────────────────────────────────────────── */

function OrdersPanel() {
  const t = useTranslations("account");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["account", "orders", page],
    queryFn: () => getMyOrders({ page, limit: 10 }),
  });

  return (
    <section className={PANEL}>
      <PanelHead
        icon={<Package className="size-4" />}
        title={t("orders")}
        count={data?.total}
      />

      {isPending ? (
        <Loader2 className="mt-5 size-5 animate-spin text-brand-pink" />
      ) : isError ? (
        <p className="mt-5 text-sm text-brand-pink-deep">{t("errors.network")}</p>
      ) : !data?.orders.length ? (
        <EmptyState icon={<Package className="size-4" />} text={t("noOrders")} />
      ) : (
        <>
          <ul className="mt-5 flex flex-col gap-2.5">
            {data.orders.map((order) => {
              const open = openId === order.id;
              return (
                <li
                  key={order.id}
                  className={cn(
                    "rounded-2xl transition-colors",
                    open ? "bg-surface-cream" : "ring-1 ring-brand-pink-tint",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : order.id)}
                    aria-expanded={open}
                    className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-mono text-sm font-bold text-brand-ink">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-brand-ink/55">
                        {new Date(order.createdAt).toLocaleDateString(locale)}
                      </span>
                    </span>
                    {/* Wraps: four items in a fixed row pushed the total off a
                        375px screen. */}
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <StoreTag store={order.store} />
                      <StatusPill status={order.status} />
                      <span className="text-base font-extrabold whitespace-nowrap text-brand-ink">
                        {formatPrice(Number(order.totalAmount))}
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-brand-ink/40 transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </span>
                  </button>
                  {open && <OrderLines id={order.id} />}
                </li>
              );
            })}
          </ul>

          {data.pages > 1 && (
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="h-11 rounded-xl px-4 text-sm font-bold ring-1 ring-brand-pink-tint disabled:opacity-40"
              >
                {t("prev")}
              </button>
              <span className="text-sm text-brand-ink/55">
                {data.page} / {data.pages}
              </span>
              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => setPage((current) => current + 1)}
                className="h-11 rounded-xl px-4 text-sm font-bold ring-1 ring-brand-pink-tint disabled:opacity-40"
              >
                {t("next")}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** The full order, fetched only when its row is opened. */
function OrderLines({ id }: { id: string }) {
  const t = useTranslations("account");
  const locale = useLocale();
  const { data, isPending, isError } = useQuery({
    queryKey: ["account", "order", id],
    queryFn: () => getMyOrder(id),
  });

  if (isPending) {
    return (
      <div className="px-4 pb-4">
        <Loader2 className="size-4 animate-spin text-brand-pink" />
      </div>
    );
  }
  if (isError) {
    return <p className="px-4 pb-4 text-sm text-brand-pink-deep">{t("errors.network")}</p>;
  }

  return (
    <ul className="mx-4 mb-4 flex flex-col gap-2 border-t border-brand-pink-tint pt-3">
      {data.items.map((item) => (
        <li key={item.productId} className="flex justify-between gap-3 text-sm">
          <span className="text-brand-ink/60">
            {item.productName[locale as keyof typeof item.productName] ??
              item.productName.ru}
            <span className="text-brand-ink/40"> × {item.quantity}</span>
          </span>
          <span className="font-bold whitespace-nowrap text-brand-ink">
            {formatPrice(Number(item.subtotal))}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── purchase history ────────────────────────────────────────────────────── */

function PurchasesPanel() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { data, isPending, isError } = useQuery({
    queryKey: ["account", "purchases"],
    queryFn: getPurchases,
  });

  return (
    <section className={PANEL}>
      <PanelHead
        icon={<ReceiptText className="size-4" />}
        title={t("purchases")}
        hint={t("purchasesHint")}
      />

      {isPending ? (
        <Loader2 className="mt-5 size-5 animate-spin text-brand-pink" />
      ) : isError ? (
        <p className="mt-5 text-sm text-brand-pink-deep">{t("errors.network")}</p>
      ) : !data?.purchases.length ? (
        <EmptyState icon={<ReceiptText className="size-4" />} text={t("noPurchases")} />
      ) : (
        // Already newest-first from the API; re-sorting could only disagree.
        <ol className="mt-5 flex flex-col border-l border-brand-pink-tint pl-4">
          {data.purchases.map((purchase) => (
            <PurchaseRow
              key={`${purchase.source}-${purchase.id}`}
              purchase={purchase}
              locale={locale}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function PurchaseRow({ purchase, locale }: { purchase: Purchase; locale: string }) {
  const t = useTranslations("account");
  const fromCrm = purchase.source === "crm";

  return (
    <li className="relative py-4 first:pt-0 last:pb-0">
      <span
        aria-hidden
        className={cn(
          "absolute -left-[1.3125rem] top-5 size-2.5 rounded-full ring-4 ring-white first:top-1.5",
          fromCrm ? "bg-brand-ink/25" : "bg-brand-pink",
        )}
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold break-words text-brand-ink">
            {fromCrm
              ? (purchase.title ?? t("managerPurchase"))
              : `#${purchase.id.slice(0, 8)}`}
          </p>
          <p className="mt-0.5 text-xs text-brand-ink/55">
            {new Date(purchase.date).toLocaleDateString(locale)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {fromCrm ? (
            <span className="rounded-full px-2.5 py-1 text-[0.6875rem] font-medium text-brand-ink/60 ring-1 ring-brand-pink-tint">
              {t("viaManager")}
            </span>
          ) : (
            <>
              <StoreTag store={purchase.store} />
              {purchase.status && <StatusPill status={purchase.status} />}
            </>
          )}
          {/* `amount` is already in sums — nothing to divide here. */}
          <span className="text-base font-extrabold whitespace-nowrap text-brand-ink">
            {formatPrice(purchase.amount)}
          </span>
        </div>
      </div>

      {purchase.items.length > 0 && (
        <ul className="mt-2.5 flex flex-col gap-1 rounded-xl bg-surface-cream px-3 py-2">
          {purchase.items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex justify-between gap-3 text-[0.8125rem]"
            >
              <span className="text-brand-ink/60">
                {item.name}
                <span className="text-brand-ink/40"> × {item.quantity}</span>
              </span>
              <span className="whitespace-nowrap text-brand-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
