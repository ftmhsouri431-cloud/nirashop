import type {
  PaymentCreateInput,
  PaymentCreateResult,
  PaymentProvider,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "./types";
import { signMockPaymentToken, verifyMockPaymentToken } from "./mock-token";

/** Sandbox gateway that proves checkout without a real PSP. */
export const mockPaymentProvider: PaymentProvider = {
  id: "mock",
  label: "پرداخت آزمایشی",
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const paymentId = `mock_${input.orderId}_${Date.now().toString(36)}`;
    const okToken = signMockPaymentToken(input.orderId, paymentId, "ok");
    const failToken = signMockPaymentToken(input.orderId, paymentId, "fail");
    const url = new URL(input.callbackUrl);
    url.searchParams.set("orderId", input.orderId);
    url.searchParams.set("paymentId", paymentId);
    url.searchParams.set("provider", "mock");
    url.searchParams.set("okToken", okToken);
    url.searchParams.set("failToken", failToken);
    return {
      paymentId,
      redirectUrl: `/checkout/pay?${url.searchParams.toString()}`,
      provider: "mock",
    };
  },
  async verifyPayment(
    input: PaymentVerifyInput,
  ): Promise<PaymentVerifyResult> {
    const outcome = String(input.returnParams?.outcome || "");
    const token = input.returnParams?.token;
    if (
      !verifyMockPaymentToken(input.orderId, input.paymentId, outcome, token)
    ) {
      return {
        success: false,
        paymentId: input.paymentId,
        message: "توکن تأیید پرداخت نامعتبر است",
      };
    }
    if (outcome === "ok") {
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
