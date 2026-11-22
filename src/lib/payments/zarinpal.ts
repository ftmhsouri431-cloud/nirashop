import type {
  PaymentCreateInput,
  PaymentCreateResult,
  PaymentProvider,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "./types";

/**
 * Zarinpal adapter stub.
 * Wire with:
 *   PAYMENT_PROVIDER=zarinpal
 *   ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *   ZARINPAL_SANDBOX=true|false
 *   NEXT_PUBLIC_APP_URL=https://your-app.example
 *
 * When credentials are missing, createPayment throws so the shop
 * falls back only if the factory chooses mock.
 */
export const zarinpalPaymentProvider: PaymentProvider = {
  id: "zarinpal",
  label: "زرین‌پال",
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID?.trim();
    if (!merchantId) {
      throw new Error(
        "ZARINPAL_MERCHANT_ID تنظیم نشده است. برای اتصال واقعی به راهنما مراجعه کنید.",
      );
    }
    const sandbox = process.env.ZARINPAL_SANDBOX !== "false";
    const base = sandbox
      ? "https://sandbox.zarinpal.com/pg/v4/payment"
      : "https://api.zarinpal.com/pg/v4/payment";

    const res = await fetch(`${base}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: input.amount,
        callback_url: input.callbackUrl,
        description: input.description,
        metadata: {
          order_id: input.orderId,
          mobile: input.customerPhone,
        },
      }),
    });
    const data = (await res.json()) as {
      data?: { authority?: string; code?: number };
      errors?: unknown;
    };
    const authority = data.data?.authority;
    if (!authority) {
      throw new Error("پاسخ نامعتبر از زرین‌پال");
    }
    const payBase = sandbox
      ? "https://sandbox.zarinpal.com/pg/StartPay"
      : "https://www.zarinpal.com/pg/StartPay";
    return {
      paymentId: authority,
      redirectUrl: `${payBase}/${authority}`,
      provider: "zarinpal",
    };
  },
  async verifyPayment(
    input: PaymentVerifyInput,
  ): Promise<PaymentVerifyResult> {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID?.trim();
    if (!merchantId) {
      return {
        success: false,
        paymentId: input.paymentId,
        message: "ZARINPAL_MERCHANT_ID تنظیم نشده",
      };
    }
    const sandbox = process.env.ZARINPAL_SANDBOX !== "false";
    const base = sandbox
      ? "https://sandbox.zarinpal.com/pg/v4/payment"
      : "https://api.zarinpal.com/pg/v4/payment";
    // Amount must be looked up by caller and passed via returnParams.amount
    const amount = Number(input.returnParams?.amount || 0);
    const res = await fetch(`${base}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount,
        authority: input.paymentId,
      }),
    });
    const data = (await res.json()) as {
      data?: { code?: number; ref_id?: number };
    };
    const code = data.data?.code;
    const ok = code === 100 || code === 101;
    return {
      success: ok,
      paymentId: input.paymentId,
      providerRef: data.data?.ref_id ? String(data.data.ref_id) : undefined,
      message: ok ? "پرداخت تأیید شد" : "تأیید پرداخت ناموفق بود",
    };
  },
};
