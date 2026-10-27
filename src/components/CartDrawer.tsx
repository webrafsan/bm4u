'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div className="cart-drawer-panel pointer-events-auto w-screen max-w-md bg-white border-l border-[#CBD5E1] shadow-2xl flex flex-col text-[#0F172A]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] bg-[#EDF0F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D97706]" />
              <h2 className="font-heading text-lg font-bold text-[#0F172A]">Your Cart</h2>
              <span className="badge-calon text-xs py-0.5 px-2">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/30 flex items-center justify-center mb-4 text-[#D97706]">
                  <ShoppingBag className="w-8 h-8 opacity-80" />
                </div>
                <h3 className="font-heading font-bold text-[#0F172A] text-lg mb-1">Your cart is empty</h3>
                <p className="text-sm text-[#64748B] max-w-xs mb-6">
                  Browse our high-limit Meta Business Managers, verified accounts, and ad assets.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-action btn-primary text-xs py-2.5 px-6 rounded-xl font-bold"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] hover:border-[#FBAD18] transition-all flex flex-col gap-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {product.country && (
                          <span className="text-[10px] uppercase font-bold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded-md border border-[#FBAD18]/30">
                            {product.country}
                          </span>
                        )}
                        {product.lines && product.lines !== 'n/a' && (
                          <span className="text-[10px] font-semibold text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-[#CBD5E1]">
                            {product.lines}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A] line-clamp-2">
                        {product.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-[#94A3B8] hover:text-[#DC2626] p-1 transition-colors cursor-pointer"
                      title="Remove"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#CBD5E1]">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#CBD5E1] rounded-xl bg-white shadow-xs">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 hover:text-[#D97706] text-[#475569] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#0F172A] font-mono select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:text-[#D97706] text-[#475569] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-heading font-extrabold text-base text-[#0F172A]">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#64748B] block font-medium">
                        (${product.price.toFixed(2)} each)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E2E8F0] bg-[#EDF0F2] space-y-4">
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal</span>
                  <span className="text-[#0F172A] font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Delivery Method</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Instant Electronic Delivery
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0F172A] pt-2 border-t border-[#CBD5E1]">
                  <span>Total (USD)</span>
                  <span className="text-xl font-heading text-[#0F172A] font-black">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-action btn-primary w-full text-center py-3.5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={clearCart}
                  className="text-xs text-[#64748B] hover:text-[#DC2626] text-center py-1 transition-colors cursor-pointer font-medium"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
