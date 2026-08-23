import type { ServiceError, ServiceResult } from "@/lib/types";

export const isServer = typeof window === "undefined";

/** Absolute base URL — required for fetch during server rendering. */
export function baseUrl(): string {
  if (!isServer) return "";
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function fail<T>(error: ServiceError): ServiceResult<T> {
  return { ok: false, error };
}

/**
 * Wraps fetch so callers never have to deal with two failure shapes. Network
 * faults and API errors both come back as a typed `ServiceError` with a message
 * worth showing to a customer.
 */
export async function request<T>(
  path: string,
  init?: RequestInit
): Promise<ServiceResult<T>> {
  try {
    const res = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      /* empty or non-JSON body */
    }

    if (!res.ok) {
      const body = payload as { error?: ServiceError } | null;
      return fail(
        body?.error ?? {
          code: res.status >= 500 ? "server" : "validation",
          message:
            res.status >= 500
              ? "Our booking system is not responding right now. Please try again in a moment, or message us on WhatsApp and we'll book you in directly."
              : "That request couldn't be completed. Please check the details and try again.",
        }
      );
    }

    return ok((payload as { data: T }).data);
  } catch {
    return fail({
      code: "network",
      message:
        "We couldn't reach our booking system — check your connection and try again. Your details have been kept.",
    });
  }
}
