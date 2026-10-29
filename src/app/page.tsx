'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Zap, 
  Send, 
  ShoppingBag, 
  KeyRound, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { HeroVisual } from '@/components/HeroVisual';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { POSTS } from '@/data/posts';

export default function HomePage() {
  const router = useRouter();
  const { buyNow, addToCart } = useCart();
  const [selectedCat, setSelectedCat] = useState('all');
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [postsList, setPostsList] = useState(POSTS);

  // Dynamic MongoDB Atlas data synchronization
  React.useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setProductsList(d.data);
        }
      })
      .catch(() => {});

    fetch('/api/posts')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setPostsList(d.data);
        }
      })
      .catch(() => {});
  }, []);

  const featuredSpecial = productsList.find(p => p.id === 'bm-2500') || productsList[0];

  const displayedProducts = selectedCat === 'all'
    ? productsList.slice(0, 8)
    : productsList.filter(p => p.category === selectedCat).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 bg-cosmic relative overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle top warm radiance */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#FBAD18]/15 via-[#FBAD18]/5 to-transparent blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-6 text-left space-y-6">
                
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 badge-calon text-xs py-1.5 px-4">
                  <span className="flex h-2 w-2 rounded-full bg-[#FBAD18] animate-pulse" />
                  <span>Premium Meta & TikTok Advertising Assets</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1]">
                  Scale Your Meta Ads <br />
                  <span className="text-gradient">Without Restrictions</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#475569] text-base sm:text-lg max-w-xl leading-relaxed font-normal">
                  Buy high-spend Facebook Business Managers (BM2500, BM5), 2-line & 3-line reinstated advertising profiles, and verified assets with <strong className="text-[#0F172A] font-bold">24-hour guarantee</strong> and instant delivery.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/shop"
                    className="btn-action btn-primary py-4 px-8 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore Shop Catalog</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/fb-2fa"
                    className="btn-action btn-ghost py-4 px-7 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-[#D97706]" />
                    <span>Free 2FA Authenticator</span>
                  </Link>
                </div>

                {/* Quick Trust Highlights */}
                <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#0F172A] font-semibold">Instant Dispatch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                    <span className="text-[#0F172A] font-semibold">24/7 Telegram Desk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#0F172A] font-semibold">24h Replacement Guarantee</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Visual Animation */}
              <div className="lg:col-span-6 flex items-center justify-center w-full">
                <HeroVisual />
              </div>

            </div>

            {/* Trust Metrics Bar */}
            <div className="mt-14 pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto border-t border-[#CBD5E1] text-left">
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs space-y-1">
                <span className="font-heading text-2xl font-black text-[#0F172A] block">2+ Years</span>
                <span className="text-xs text-[#64748B] font-medium">Industry Experience</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs space-y-1">
                <span className="font-heading text-2xl font-black text-[#D97706] block">24-Hour</span>
                <span className="text-xs text-[#64748B] font-medium">Technical Guarantee</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs space-y-1">
                <span className="font-heading text-2xl font-black text-[#0F172A] block">50+ Countries</span>
                <span className="text-xs text-[#64748B] font-medium">Global Account Stock</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs space-y-1">
                <span className="font-heading text-2xl font-black text-[#10B981] block">Instant</span>
                <span className="text-xs text-[#64748B] font-medium">Electronic Delivery</span>
              </div>
            </div>

          </div>
        </section>

        {/* SPECIAL HIGH-LIMIT BANNER (BM2500) */}
        {featuredSpecial && (
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="card-glass rounded-3xl p-8 sm:p-12 border border-[#CBD5E1] relative overflow-hidden bg-white shadow-md">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="badge-calon text-xs py-1 px-3">
                        <TrendingUp className="w-3.5 h-3.5" /> High-Limit Tier
                      </span>
                      <span className="text-xs font-black text-[#0F172A] bg-[#FBAD18] px-2.5 py-0.5 rounded-lg shadow-xs">
                        $2,500 Daily Limit
                      </span>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight">
                      Buy Facebook BM2500 – Premium Meta Business Manager
                    </h2>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      Scale your advertising without artificial budget caps. Fully doc-verified Business Manager capable of spending $2,500 daily from day one.
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-[#0F172A] font-semibold">
                      <span className="flex items-center gap-1.5 bg-[#EDF0F2] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 3 Ad Accounts Ready
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#EDF0F2] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Pixel Shareable
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#EDF0F2] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 24H Replacement Guarantee
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#EDF0F2] p-8 rounded-2xl border border-[#CBD5E1] flex flex-col items-center text-center w-full lg:w-72 shrink-0 shadow-xs">
                    <span className="text-xs text-[#94A3B8] line-through font-mono">
                      ${featuredSpecial.originalPrice?.toLocaleString()} USD
                    </span>
                    <span className="font-heading text-3xl sm:text-4xl font-black text-[#0F172A] mb-1">
                      ${featuredSpecial.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium mb-6">Immediate Delivery</span>

                    <div className="w-full flex flex-col gap-2.5">
                      <button
                        onClick={() => {
                          addToCart(featuredSpecial, 1, true);
                        }}
                        className="btn-action btn-ghost w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#D97706]" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => {
                          buyNow(featuredSpecial, 1);
                          router.push(`/checkout?productId=${featuredSpecial.id}`);
                        }}
                        className="btn-action btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FREE WEB TOOLS SHOWCASE */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="badge-calon text-xs py-1 px-3 mb-3 inline-block">
                Free Utilities
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Built-in Advertiser Tools
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
                Zero-delay browser utilities to manage Facebook 2FA keys and verify account UIDs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 2FA Tool Card */}
              <div className="card-glass rounded-3xl p-8 border border-[#CBD5E1] space-y-5 hover:border-[#FBAD18] transition-all bg-white shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/40 flex items-center justify-center text-[#D97706]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#0F172A] mb-1.5">
                    FB 2FA Authenticator
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Generate instant 6-digit TOTP login codes from your Base32 secret keys with live 30-second countdown and 1-click clipboard copy. 100% private in-browser Web Crypto.
                  </p>
                </div>
                <Link
                  href="/fb-2fa"
                  className="btn-action btn-primary text-xs py-3 px-6 inline-flex items-center gap-2 font-bold"
                >
                  <span>Open 2FA Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Live UID Checker Card */}
              <div className="card-glass rounded-3xl p-8 border border-[#CBD5E1] space-y-5 hover:border-[#FBAD18] transition-all bg-white shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-[#ECFDF5] border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#0F172A] mb-1.5">
                    Live Facebook UID Checker
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Check if Facebook account UIDs are active (LIVE) or checkpointed (DIE) before importing into anti-detect profiles. Supports single and bulk verification.
                  </p>
                </div>
                <Link
                  href="/live-uid-checker"
                  className="btn-action btn-ghost text-xs py-3 px-6 inline-flex items-center gap-2 font-bold"
                >
                  <span>Open Live UID Checker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT CATALOG SHOWCASE */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="badge-calon text-xs py-1 px-3 mb-2 inline-block">
                  Live Stock
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Available Ad Assets
                </h2>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.slice(0, 5).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCat === cat.id
                        ? 'bg-[#FBAD18] text-[#0F172A] shadow-sm'
                        : 'bg-white text-[#475569] border border-[#CBD5E1] hover:text-[#0F172A]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/shop" className="btn-action btn-ghost text-xs py-3 px-8 inline-flex items-center gap-2 font-bold">
                <span>View All 70+ Products in Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US & GUARANTEE */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#CBD5E1]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Why Media Buyers Trust BM4U
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
                Engineered for advertisers who demand stability, fast delivery, and fair replacement policies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="card-glass rounded-2xl p-6 border border-[#CBD5E1] space-y-3 bg-white shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] border border-[#FBAD18]/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#0F172A]">24H Replacement Guarantee</h3>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">
                  If an account UID returns dead upon delivery or credentials have technical errors, our Telegram desk replaces it within 24 hours.
                </p>
              </div>

              <div className="card-glass rounded-2xl p-6 border border-[#CBD5E1] space-y-3 bg-white shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] border border-[#10B981]/30">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#0F172A]">Pre-Tested & Live Ads</h3>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">
                  Every 2-line and 3-line account is confirmed for identity restoration and live advertising rights before listing in our store.
                </p>
              </div>

              <div className="card-glass rounded-2xl p-6 border border-[#CBD5E1] space-y-3 bg-white shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] border border-[#FBAD18]/40">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#0F172A]">Direct Telegram Support</h3>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">
                  No automated ticket robots. Speak directly to human advertising specialists on Telegram (@bybm4u) 7 days a week.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KNOWLEDGE BASE / TIPS PREVIEW */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#CBD5E1]">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="badge-calon text-xs py-1 px-3 mb-2 inline-block">
                  Knowledge Base
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Latest Advertising Tips
                </h2>
              </div>
              <Link href="/tips" className="text-xs text-[#D97706] hover:underline font-bold hidden sm:inline">
                View all articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {postsList.slice(0, 3).map(post => {
                const banner = post.image || '/tips/facebook-bm2500-guide.svg';
                const pTags = Array.isArray(post.tags) ? post.tags : [];
                const author = post.author?.name || 'BM4U Asset Team';
                return (
                  <article
                    key={post.slug}
                    className="rounded-3xl overflow-hidden border border-[#CBD5E1] flex flex-col justify-between hover:border-[#FBAD18] hover:shadow-lg transition-all duration-300 bg-white shadow-xs group"
                  >
                    <div>
                      <Link href={`/tips/${post.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                        <Image
                          src={banner}
                          alt={post.imageAlt || post.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="badge-calon text-[10px] py-0.5 px-2 font-bold backdrop-blur-md">
                            {post.category || 'Guides'}
                          </span>
                        </div>
                      </Link>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime || '4 min read'}</span>
                        </div>

                        <Link href={`/tips/${post.slug}`}>
                          <h3 className="font-heading text-base font-bold text-[#0F172A] group-hover:text-[#D97706] transition-colors mb-2 line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pTags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">By {author}</span>
                      <Link
                        href={`/tips/${post.slug}`}
                        className="text-xs text-[#D97706] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* TELEGRAM CTA BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="card-glass rounded-3xl p-8 sm:p-12 border border-[#CBD5E1] text-center space-y-6 relative overflow-hidden bg-white shadow-md">
              <div className="h-14 w-14 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/40 flex items-center justify-center text-[#D97706] mx-auto">
                <Send className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Still Need Assistance or Custom Stock?
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto font-medium">
                  Message our team directly on Telegram for bulk agency discounts, custom country requirements, or payment questions.
                </p>
              </div>

              <a
                href="https://t.me/bybm4u"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action btn-primary py-4 px-10 text-sm font-bold inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Contact Us on Telegram</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
