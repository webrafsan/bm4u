'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-5xl">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#CBD5E1]">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Shopping Cart
              </h1>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Review your selected Meta advertising assets before checking out.
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-[#DC2626] hover:underline font-bold cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="card-glass rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4 bg-white border border-[#CBD5E1] shadow-xs">
              <div className="h-16 w-16 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/40 flex items-center justify-center text-[#D97706] mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#0F172A]">
                Your cart is currently empty
              </h3>
              <p className="text-xs text-[#64748B]">
                Explore our catalog of Business Managers, verified accounts, and ad assets.
              </p>
              <Link href="/shop" className="btn-action btn-primary text-xs py-3 px-8 inline-block rounded-xl font-bold">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="card-glass rounded-2xl p-5 border border-[#CBD5E1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow-xs"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {product.country && (
                          <span className="badge-calon text-[10px] py-0.5 px-2">
                            {product.country}
                          </span>
                        )}
                        {product.lines && product.lines !== 'n/a' && (
                          <span className="text-[10px] font-bold text-[#0F172A] bg-[#FBAD18] px-2 py-0.5 rounded-md shadow-xs">
                            {product.lines}
                          </span>
                        )}
                      </div>
                      <Link href={`/product/${product.slug}`} className="hover:text-[#D97706] transition-colors block">
                        <h4 className="font-heading text-sm font-bold text-[#0F172A]">
                          {product.title}
                        </h4>
                      </Link>
                      <span className="text-xs text-[#D97706] font-bold font-mono">
                        ${product.price.toFixed(2)} each
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#CBD5E1] rounded-xl bg-[#EDF0F2]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 text-[#475569] hover:text-[#0F172A] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#0F172A] font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-2 text-[#475569] hover:text-[#0F172A] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="font-heading font-black text-base text-[#0F172A]">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-[#475569] hover:text-[#0F172A] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="card-glass rounded-3xl p-6 border border-[#CBD5E1] space-y-6 sticky top-28 bg-white shadow-xs">
                  <h3 className="font-heading text-lg font-bold text-[#0F172A]">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs text-[#64748B] pb-4 border-b border-[#CBD5E1] font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#0F172A] font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Instant Delivery</span>
                      <span className="text-[#10B981] font-bold">FREE (Instant)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Replacement Warranty</span>
                      <span className="text-[#D97706] font-bold">24H Covered</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="font-heading text-sm font-bold text-[#0F172A]">Total USD</span>
                    <span className="font-heading text-2xl font-black text-[#0F172A]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-action btn-primary w-full text-center py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="p-3.5 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] flex items-center gap-2.5 text-[11px] text-[#475569]">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Secure checkout with instant digital credential dispatch.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
