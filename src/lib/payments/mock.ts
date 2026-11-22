import type {
  PaymentCreateInput,
  PaymentCreateResult,
  PaymentProvider,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "./types";

/** Sandbox gateway that proves checkout without a real PSP. */
export const mockPaymentProvider: PaymentProvider = {
  id: "mock",
  label: "پرداخت آزمایشی",
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const paymentId = `mock_${input.orderId}_${Date.now().toString(36)}`;
    const url = new URL(input.callbackUrl);
    url.searchParams.set("orderId", input.orderId);
    url.searchParams.set("paymentId", paymentId);
    url.searchParams.set("provider", "mock");
    url.searchParams.set("status", "ok");
    return {
      paymentId,
      redirectUrl: `/checkout/pay?${url.searchParams.toString()}`,
      provider: "mock",
    };
  },
  async verifyPayment(
    input: PaymentVerifyInput,
  ): Promise<PaymentVerifyResult> {
    const status = input.returnParams?.status;
    if (status === "ok" || status === "paid") {
      return {
        success: true,
        paymentId: input.paymentId,
        providerRef: input.paymentId,
        message: "پرداخت آزمایشی با موفقیت تأیید شد",
      };
    }
    return {
      success: false,
      paymentId: input.paymentId,
      message: "پرداخت آزمایشی ناموفق بود",
    };
  },
};
