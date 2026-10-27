'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  ShoppingBag,
  Coins
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CryptoPaymentGateway } from '@/components/CryptoPaymentGateway';
import { CRYPTO_WALLETS } from '@/data/cryptoWallets';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || searchParams.get('id');
  const quantityParam = parseInt(searchParams.get('quantity') || '1', 10);
  const { items, clearCart, isLoaded, addToCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    telegram: '',
    paymentMethod: 'crypto',
    selectedCrypto: 'BTC',
    txid: '',
    orderNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validQty = isNaN(quantityParam) || quantityParam < 1 ? 1 : quantityParam;

  // Resolve direct product parameter if present
  const targetProduct = useMemo(() => {
    if (!productId) return null;
    return PRODUCTS.find(p => p.id === productId || p.slug === productId) || null;
  }, [productId]);

  // Sync to cart in background if direct buyNow product is not yet saved
  useEffect(() => {
    if (targetProduct && isLoaded) {
      const alreadyInCart = items.some(item => item.product.id === targetProduct.id);
      if (!alreadyInCart) {
        addToCart(targetProduct, validQty, false);
      }
    }
  }, [targetProduct, validQty, isLoaded, items, addToCart]);

  // Compute active checkout items (fallback to targetProduct if items not yet committed)
  const checkoutItems = useMemo(() => {
    if (items.length > 0) {
      if (targetProduct && !items.some(it => it.product.id === targetProduct.id)) {
        return [...items, { product: targetProduct, quantity: validQty }];
      }
      return items;
    }
    if (targetProduct) {
      return [{ product: targetProduct, quantity: validQty }];
    }
    return [];
  }, [items, targetProduct, validQty]);

  const checkoutSubtotal = useMemo(() => {
    return checkoutItems.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  }, [checkoutItems]);

  if (!isLoaded && checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#FBAD18] border-t-transparent animate-spin mb-4" />
          <p className="text-xs text-[#64748B] font-medium">Preparing your checkout session...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/40 flex items-center justify-center mb-4 text-[#D97706]">
            <ShoppingBag className="w-8 h-8 opacity-80" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-[#64748B] mb-6">Add products to your cart before proceeding to checkout.</p>
          <Link href="/shop" className="btn-action btn-primary text-xs py-3 px-8 rounded-xl inline-flex items-center gap-2 font-bold">
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email.trim() || !formData.telegram.trim()) {
      setFormError('Please enter both your email address and Telegram username for credential delivery.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'BM-' + Math.floor(100000 + Math.random() * 900000);
    const chosenWallet = CRYPTO_WALLETS.find(w => w.symbol === formData.selectedCrypto) || CRYPTO_WALLETS[0];

    const orderData = {
      orderId,
      customer: formData,
      cryptoWallet: chosenWallet,
      txid: formData.txid.trim(),
      items: checkoutItems,
      total: checkoutSubtotal,
      date: new Date().toISOString(),
      status: 'Awaiting Payment Confirmation',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bm4u_orders') || '[]');
      existing.unshift(orderData);
      localStorage.setItem('bm4u_orders', JSON.stringify(existing));
    } catch {
      // ignore
    }

    clearCart();

    setTimeout(() => {
      router.push(`/order-success?orderId=${orderId}`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-5xl">
          
          <div className="mb-10 text-center sm:text-left">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              Instant Order Checkout
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
              Complete your information below to receive access credentials immediately.
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FEE2E2] border border-[#F87171] text-[#991B1B] text-xs flex items-center gap-2.5 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Delivery Information */}
              <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] space-y-5 bg-white shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-[#CBD5E1]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FBAD18] text-[#0F172A] text-xs font-black">1</span>
                  <h3 className="font-heading text-base font-bold text-[#0F172A]">
                    Delivery & Contact Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#FBAD18]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Email Address (For Credentials) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#FBAD18]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Telegram Username or WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="@username or +123456789"
                        value={formData.telegram}
                        onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                        className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#FBAD18]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special instructions or required IP country preference..."
                      value={formData.orderNotes}
                      onChange={e => setFormData({ ...formData, orderNotes: e.target.value })}
                      className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#FBAD18]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section: Exact Cryptocurrency Gateway */}
              <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] space-y-5 bg-white shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-[#CBD5E1]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FBAD18] text-[#0F172A] text-xs font-black">2</span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#D97706]" />
                    <h3 className="font-heading text-base font-bold text-[#0F172A]">
                      Pay with Cryptocurrency (BTC, ETH, USDT, SOL)
                    </h3>
                  </div>
                </div>

                <CryptoPaymentGateway
                  selectedSymbol={formData.selectedCrypto}
                  onSelectSymbol={(sym) => setFormData(prev => ({ ...prev, selectedCrypto: sym }))}
                  txid={formData.txid}
                  onChangeTxid={(val) => setFormData(prev => ({ ...prev, txid: val }))}
                />
              </div>
            </div>

            {/* Right Column: Order Review */}
            <div className="lg:col-span-5">
              <div className="card-glass rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] space-y-6 sticky top-28 bg-white shadow-xs">
                <h3 className="font-heading text-lg font-bold text-[#0F172A] pb-3 border-b border-[#CBD5E1]">
                  Review Your Items ({checkoutItems.length})
                </h3>

                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {checkoutItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#E2E8F0]">
                      <div className="pr-2">
                        <span className="font-bold text-[#0F172A] block truncate max-w-[200px]">
                          {product.title}
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          Qty: {quantity} × ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-heading font-black text-[#0F172A] shrink-0">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-[#CBD5E1] text-xs text-[#64748B] font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#0F172A] font-bold">${checkoutSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Payment</span>
                    <span className="text-[#D97706] font-bold">{formData.selectedCrypto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Guarantee</span>
                    <span className="text-[#10B981] font-bold">24H Verified</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#CBD5E1]">
                    <span className="font-heading text-sm font-bold text-[#0F172A]">Grand Total</span>
                    <span className="font-heading text-2xl font-black text-[#0F172A]">
                      ${checkoutSubtotal.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-action btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Order...' : 'Confirm & Complete Order'}</span>
                </button>

                <div className="p-3.5 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] space-y-1.5 text-[11px] text-[#475569]">
                  <div className="flex items-center gap-2 text-[#10B981] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected by 24H Technical Warranty</span>
                  </div>
                  <p>
                    Credentials will be delivered to your specified Telegram handle immediately following transaction verification.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
          <Navbar />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#FBAD18] border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-[#64748B]">Loading checkout...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
