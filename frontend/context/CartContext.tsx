import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ProductType } from '../components/Products/ProductCard';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
  quantity: number;
  sizeValue?: number;
  sizeUnit?: string;
  stockQuantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  addItem: (product: ProductType, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'deedees-cart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: ProductType, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image:
            typeof product.images?.[0] === 'string'
              ? product.images?.[0]
              : product.images?.[0]?.url,
          quantity,
          sizeValue: product.sizeValue,
          sizeUnit: product.sizeUnit,
          stockQuantity: product.stockQuantity,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.discountPrice ?? item.price;
        return sum + price * item.quantity;
      }, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};

