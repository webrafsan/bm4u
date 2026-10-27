'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  ShieldCheck, 
  ShoppingBag, 
  Send, 
  Minus, 
  Plus, 
  Zap, 
  Globe, 
  Clock 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'rules' | 'faq'>('specs');
  const [formatCopied, setFormatCopied] = useState(false);

  const product = PRODUCTS.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-[#0F172A] mb-2">Product Not Found</h1>
          <p className="text-sm text-[#64748B] mb-6">The requested product does not exist or has been updated.</p>
          <Link href="/shop" className="btn-action btn-primary text-xs py-2.5 px-6 rounded-xl font-bold">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleBuyNow = () => {
    buyNow(product, quantity);
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  const copyFormat = async () => {
    try {
      await navigator.clipboard.writeText(product.format);
      setFormatCopied(true);
      setTimeout(() => setFormatCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  const telegramOrderUrl = `https://t.me/bybm4u?text=${encodeURIComponent(
    `Hello BM4U Support, I would like to buy: ${product.title} (Quantity: ${quantity}, Price: $${product.price * quantity})`
  )}`;

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-6xl">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-8 font-medium">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#0F172A] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#D97706] font-bold truncate max-w-xs">{product.title}</span>
          </div>

          {/* Product Overview Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            
            {/* Left Column: Visual Specs Showcase */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-glass rounded-3xl p-8 border border-[#CBD5E1] shadow-md relative overflow-hidden flex flex-col justify-between min-h-[360px] bg-white">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FBAD18]/15 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      {product.country && (
                        <span className="badge-calon text-xs py-1 px-3">
                          <Globe className="w-3.5 h-3.5" />
                          {product.country}
                        </span>
                      )}
                      {product.lines && product.lines !== 'n/a' && (
                        <span className="text-xs font-bold text-[#0F172A] bg-[#FBAD18] px-2.5 py-0.5 rounded-lg shadow-xs">
                          {product.lines}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                      </span>
                      <span>{product.stock} In Stock</span>
                    </div>
                  </div>

                  <div className="my-8 text-center">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#64748B] font-bold block mb-2">
                      Asset Identifier: #{product.id.toUpperCase()}
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                      {product.limit || product.title}
                    </h2>
                  </div>
                </div>

                {/* Delivery format preview card */}
                <div className="bg-[#EDF0F2] border border-[#CBD5E1] rounded-2xl p-4 mt-auto">
                  <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5 font-medium">
                    <span className="font-bold text-[#0F172A]">Delivery Data Format:</span>
                    <button
                      onClick={copyFormat}
                      className="text-[#D97706] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {formatCopied ? 'Copied!' : 'Copy format'}
                    </button>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1] font-mono text-[11px] text-[#0F172A] font-bold break-all select-all">
                    {product.format}
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#CBD5E1] space-y-3 shadow-xs">
                <div className="flex items-center gap-3 text-xs text-[#0F172A] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>24-Hour Technical Replacement Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#0F172A] font-medium">
                  <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Instant Delivery to Email & Telegram</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#0F172A] font-medium">
                  <Send className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Priority 1-on-1 Support via Telegram</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Purchase Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight mb-3">
                  {product.title}
                </h1>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              {/* Price Row */}
              <div className="p-6 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#64748B] font-bold block mb-1">
                    Price per Account / Unit
                  </span>
                  <div className="flex items-baseline gap-2">
                    {product.originalPrice && (
                      <span className="text-base text-[#94A3B8] line-through font-mono">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="font-heading text-3xl sm:text-4xl font-black text-[#0F172A]">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#64748B] font-bold">USD</span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#64748B] font-bold">Quantity:</span>
                  <div className="flex items-center border border-[#CBD5E1] rounded-xl bg-[#EDF0F2]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-[#0F172A] font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="btn-action btn-ghost py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D97706]" />
                    <span>Add to Cart (${(product.price * quantity).toFixed(2)})</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="btn-action btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Direct Telegram Order Option */}
                <a
                  href={telegramOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#FBAD18] text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Order Directly via Telegram</span>
                </a>
              </div>

              {/* Feature Checklist */}
              <div className="p-6 rounded-2xl bg-white border border-[#CBD5E1] space-y-2.5 shadow-xs">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">
                  Included In This Package
                </h4>
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#334155] font-medium">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabbed In-Depth Information */}
          <div className="card-glass rounded-3xl p-6 sm:p-10 border border-[#CBD5E1] mb-16 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-[#CBD5E1] pb-4 mb-6">
              <button
                onClick={() => setActiveTab('specs')}
                className={`font-heading text-sm font-bold pb-2 transition-all relative cursor-pointer ${
                  activeTab === 'specs'
                    ? 'text-[#0F172A] border-b-2 border-[#FBAD18]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Specifications & Delivery
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`font-heading text-sm font-bold pb-2 transition-all relative cursor-pointer ${
                  activeTab === 'rules'
                    ? 'text-[#0F172A] border-b-2 border-[#FBAD18]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                24H Replacement Guarantee
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`font-heading text-sm font-bold pb-2 transition-all relative cursor-pointer ${
                  activeTab === 'faq'
                    ? 'text-[#0F172A] border-b-2 border-[#FBAD18]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                FAQ & Best Practices
              </button>
            </div>

            {/* TAB CONTENT: SPECS */}
            {activeTab === 'specs' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  Upon successful order placement, your account credentials or Business Manager invitation links are prepared and transmitted immediately.
                </p>
                <div className="p-4 rounded-xl bg-[#EDF0F2] border border-[#CBD5E1] space-y-2">
                  <h5 className="font-bold text-[#0F172A]">Recommended Login Procedure:</h5>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-[#334155] font-medium">
                    <li>First, run the account UID through our <Link href="/live-uid-checker" className="text-[#D97706] underline font-bold">Live UID Checker</Link> to ensure green active status.</li>
                    <li>Always use high-quality residential proxies matching the profile&apos;s specified country footprint.</li>
                    <li>Import cookies into anti-detect browsers such as AdsPower, Dolphin{'{anty}'}, or Multilogin.</li>
                    <li>If a 2FA prompt appears, generate your real-time 6-digit code via our <Link href="/fb-2fa" className="text-[#D97706] underline font-bold">2FA Authenticator</Link>.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB CONTENT: RULES */}
            {activeTab === 'rules' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  All products carry our standard <strong className="text-[#0F172A]">24-Hour Guarantee</strong> from the moment of delivery.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#334155] font-medium">
                  <li>Eligible for replacement if delivered account is dead upon delivery (verified via UID checker before login changes).</li>
                  <li>Eligible if credentials or 2FA secret are invalid upon initial test.</li>
                  <li>Not eligible if account is banned due to customer creative policy violations, spamming, or changing passwords without following proper warm-up steps.</li>
                </ul>
                <div className="pt-2">
                  <Link href="/replace-rules" className="text-[#D97706] hover:underline text-xs flex items-center gap-1 font-bold">
                    Read complete Replacement Rules & Policy →
                  </Link>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#475569]">
                <div className="space-y-1">
                  <h5 className="font-bold text-[#0F172A]">Can I change the password and email?</h5>
                  <p className="text-xs">
                    Yes, for 3-line password changeable accounts. However, we recommend warming up the browser session for 24 hours before updating primary credentials to prevent triggering sudden security checks.
                  </p>
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-[#0F172A]">What payment methods are supported?</h5>
                  <p className="text-xs">
                    We accept Cryptocurrency (BTC, ETH, USDT, SOL) with automatic offline QR & TXID verification.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  Related Advertising Assets
                </h3>
                <Link href="/shop" className="text-xs font-bold text-[#D97706] hover:underline">
                  View all products →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(rel => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
