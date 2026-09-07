import { ApiError, request } from "./axios";
import { STORE } from "./config";

export interface SupportRequestReceipt {
  id: string;
  status: "new";
  createdAt: string;
}

export const postSupportRequest = (phone: string) =>
  request<SupportRequestReceipt>("post", "/support-requests", { phone }, {
    "X-Store": STORE,
  });

export type SupportRequestFailure = "rateLimit" | "validation" | "network";

export function classifySupportRequestError(error: unknown): SupportRequestFailure {
  const status = error instanceof ApiError ? error.status : 0;
  if (status === 429) return "rateLimit";
  if (status === 400 || status === 422) return "validation";
  return "network";
}
