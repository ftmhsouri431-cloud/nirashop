export type ShippingMethodId = "post" | "tehran_express";

export type ShippingOption = {
  id: ShippingMethodId;
  label: string;
  description: string;
  basePrice: number;
};

/** Iran-only shipping. Prices in تومان. */
export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "post",
    label: "پست",
    description: "ارسال سراسری با پست — رایگان برای سفارش بالای ۲۰ میلیون تومان",
    basePrice: 250_000,
  },
  {
    id: "tehran_express",
    label: "ارسال فوری تهران",
    description: "تحویل همان‌روز در محدوده تهران",
    basePrice: 700_000,
  },
];

export const FREE_POST_THRESHOLD = 20_000_000;

export function getShippingOption(id: string): ShippingOption | undefined {
  return SHIPPING_OPTIONS.find((o) => o.id === id);
}

export function calcShippingCost(
  methodId: string,
  subtotal: number,
): number {
  const option = getShippingOption(methodId);
  if (!option) return SHIPPING_OPTIONS[0].basePrice;
  if (option.id === "post" && subtotal > FREE_POST_THRESHOLD) {
    return 0;
  }
  return option.basePrice;
}

export function formatShippingLabel(
  methodId: string,
  subtotal: number,
): string {
  const option = getShippingOption(methodId);
  if (!option) return "ارسال";
  const cost = calcShippingCost(methodId, subtotal);
  if (cost === 0) return `${option.label} (رایگان)`;
  return option.label;
}
