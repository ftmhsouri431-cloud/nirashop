export type PaymentCreateInput = {
  orderId: string;
  amount: number;
  description: string;
  customerName: string;
  customerPhone: string;
  callbackUrl: string;
};

export type PaymentCreateResult = {
  paymentId: string;
  /** Where the shopper should go next (gateway page or local mock). */
  redirectUrl: string;
  provider: string;
};

export type PaymentVerifyInput = {
  paymentId: string;
  orderId: string;
  /** Provider-specific return params (Authority, session_id, …). */
  returnParams?: Record<string, string>;
};

export type PaymentVerifyResult = {
  success: boolean;
  paymentId: string;
  providerRef?: string;
  message?: string;
};

export interface PaymentProvider {
  readonly id: string;
  readonly label: string;
  createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult>;
  verifyPayment(input: PaymentVerifyInput): Promise<PaymentVerifyResult>;
}
