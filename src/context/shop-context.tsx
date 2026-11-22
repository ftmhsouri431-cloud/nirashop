"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type ShopContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  ready: boolean;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQty: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartTotal: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "nira_cart_v1";
const WISH_KEY = "nira_wish_v1";

export function cartKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}__${item.size}__${item.color}`;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setCart(JSON.parse(c) as CartItem[]);
      if (w) setWishlist(JSON.parse(w) as string[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      setCart((prev) => {
        const key = cartKey(item);
        const idx = prev.findIndex((p) => cartKey(p) === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + qty,
          };
          return next;
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    [],
  );

  const updateQty = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((p) =>
          cartKey(p) === key ? { ...p, quantity: Math.max(0, quantity) } : p,
        )
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((p) => cartKey(p) !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const cartCount = useMemo(
    () => cart.reduce((n, i) => n + i.quantity, 0),
    [cart],
  );
  const cartTotal = useMemo(
    () => cart.reduce((n, i) => n + i.price * i.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      ready,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartTotal,
    }),
    [
      cart,
      wishlist,
      cartCount,
      ready,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartTotal,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export function productToCartItem(
  product: Product,
  size: string,
  color: string,
): Omit<CartItem, "quantity"> {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0] || "",
    size,
    color,
  };
}
