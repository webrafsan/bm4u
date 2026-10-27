'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  buyNow: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoaded: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bm4u_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('bm4u_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isLoaded]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1, openDrawer: boolean = true) => {
    const qty = Math.max(1, quantity);
    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty,
        };
      } else {
        updated = [...prev, { product, quantity: qty }];
      }
      try {
        localStorage.setItem('bm4u_cart', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast(`Added ${product.title.slice(0, 28)}... to cart`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  }, [showToast]);

  const buyNow = useCallback((product: Product, quantity: number = 1) => {
    const qty = Math.max(1, quantity);
    setIsCartOpen(false);
    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty,
        };
      } else {
        updated = [...prev, { product, quantity: qty }];
      }
      try {
        localStorage.setItem('bm4u_cart', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      try {
        localStorage.setItem('bm4u_cart', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Item removed from cart');
  }, [showToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => {
      const updated = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      try {
        localStorage.setItem('bm4u_cart', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem('bm4u_cart');
    } catch {}
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isLoaded,
        toastMessage,
        showToast,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-white border border-amber-300 text-slate-900 px-4 py-3 rounded-2xl shadow-xl animate-fade-in text-xs font-semibold">
          <span className="flex h-2 w-2 rounded-full bg-[#FBAD18] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
