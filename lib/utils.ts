import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { ImageSlotKey } from "@/lib/api/types"
import type { Product } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Whether the catalogue has nothing left to sell of this product.
 *
 * `stock` is only present on products resolved from the API; the bundled static
 * catalogue has no inventory at all, and `undefined` there must not read as
 * zero or the offline storefront would show every product sold out. The admin
 * keeps listing a product with `stock: 0` as "Активный" — active means visible,
 * not orderable, and until this existed the storefront happily took the order.
 */
export function isSoldOut(product: { stock?: number }): boolean {
  return typeof product.stock === "number" && product.stock <= 0
}

/**
 * The picture a moderator placed into a named slot, or the given fallback.
 *
 * Every section below the price used to show the packshot, because the packshot
 * was the only photo the storefront could address — the rest of the uploads were
 * an unordered pile. Now each section can ask for the frame that was shot for
 * it, and keeps showing the packshot until someone uploads one.
 */
export function slotImage(
  product: Pick<Product, "slots">,
  slot: ImageSlotKey,
  fallback: string,
): string {
  return product.slots?.[slot]?.url || fallback
}
