import { createHmac, timingSafeEqual } from "node:crypto";
import { resolveSigningSecret } from "@/lib/runtime-secret";

function paymentSecret(): string {
  const dedicated = process.env.PAYMENT_VERIFY_SECRET?.trim();
  if (dedicated) return dedicated;
  return resolveSigningSecret("ADMIN_SESSION_SECRET", "session-secret");
}

export type MockOutcome = "ok" | "fail";

export function signMockPaymentToken(
  orderId: string,
  paymentId: string,
  outcome: MockOutcome,
): string {
  return createHmac("sha256", paymentSecret())
    .update(`${orderId}:${paymentId}:${outcome}`)
    .digest("hex");
}

export function verifyMockPaymentToken(
  orderId: string,
  paymentId: string,
  outcome: string,
  token: string | undefined,
): boolean {
  if (outcome !== "ok" && outcome !== "fail") return false;
  if (!token || !paymentId || !orderId) return false;
  const expected = signMockPaymentToken(
    orderId,
    paymentId,
    outcome as MockOutcome,
  );
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
