import type {
  PaymentCreateInput,
  PaymentCreateResult,
  PaymentProvider,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "./types";

/**
 * Stripe Checkout adapter stub.
 * Wire with:
 *   PAYMENT_PROVIDER=stripe
 *   STRIPE_SECRET_KEY=sk_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   NEXT_PUBLIC_APP_URL=https://your-app.example
 */
export const stripePaymentProvider: PaymentProvider = {
  id: "stripe",
  label: "Stripe",
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY تنظیم نشده است. برای اتصال واقعی به راهنما مراجعه کنید.",
      );
    }
    // Placeholder: real integration would call Stripe Checkout Sessions API.
    // Kept as an explicit plug-in point so swapping is a config change.
    throw new Error(
      "Stripe adapter آماده اتصال است اما Session هنوز پیاده‌سازی نشده؛ ابتدا کلید را ست کنید و منطق Checkout Session را در این فایل کامل کنید.",
    );
  },
  async verifyPayment(
    input: PaymentVerifyInput,
  ): Promise<PaymentVerifyResult> {
    return {
      success: false,
      paymentId: input.paymentId,
      message: "Stripe verify هنوز پیکربندی نشده است",
    };
  },
};
