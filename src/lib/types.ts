export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ShopSettings = {
  shopName: string;
  tagline: string;
  adminPassword: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type OrderStatus =
  | "در انتظار پرداخت"
  | "پرداخت‌شده"
  | "در حال آماده‌سازی"
  | "ارسال‌شده"
  | "تحویل‌شده"
  | "لغو‌شده";

export type PaymentStatus =
  | "pending"
  | "redirected"
  | "paid"
  | "failed"
  | "cancelled";

export type OrderPayload = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingMethod: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod?: string;
};

export type OrderRecord = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingMethod: string;
  shippingCost: number;
  notes: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentId: string | null;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export const CATEGORIES = [
  "همه",
  "پیراهن",
  "کت و ژاکت",
  "شلوار و دامن",
  "تاپ و بلوز",
  "اکسسوری",
] as const;

export const ORDER_STATUSES: OrderStatus[] = [
  "در انتظار پرداخت",
  "پرداخت‌شده",
  "در حال آماده‌سازی",
  "ارسال‌شده",
  "تحویل‌شده",
  "لغو‌شده",
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2400&q=80";
