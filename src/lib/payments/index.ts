import { mockPaymentProvider } from "./mock";
import { stripePaymentProvider } from "./stripe";
import { zarinpalPaymentProvider } from "./zarinpal";
import type { PaymentProvider } from "./types";

const providers: Record<string, PaymentProvider> = {
  mock: mockPaymentProvider,
  zarinpal: zarinpalPaymentProvider,
  stripe: stripePaymentProvider,
};

export function getPaymentProvider(
  override?: string | null,
): PaymentProvider {
  const id = (
    override ||
    process.env.PAYMENT_PROVIDER ||
    "mock"
  ).toLowerCase();
  return providers[id] ?? mockPaymentProvider;
}

export function listPaymentProviders(): PaymentProvider[] {
  return Object.values(providers);
}

export type {
  PaymentCreateInput,
  PaymentCreateResult,
  PaymentProvider,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "./types";
