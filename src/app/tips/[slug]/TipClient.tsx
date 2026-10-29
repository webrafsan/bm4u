'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Send, 
  Tag as TagIcon, 
  Share2, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Bookmark, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { BlogPost } from '@/types';
import { PRODUCTS } from '@/data/products';

interface TipClientProps {
  slug: string;
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function TipClient({ slug, post, relatedPosts }: TipClientProps) {
  const [copied, setCopied] = useState(false);

  // Author & Image fallbacks
  const authorName = post.author?.name || 'BM4U Asset Team';
  const authorRole = post.author?.role || 'Senior Media Buying Architect';
  const bannerImage = post.image || '/tips/facebook-bm2500-guide.svg';
  const bannerAlt = post.imageAlt || post.title;
  const postTags = Array.isArray(post.tags) ? post.tags : [];
  const postContent = Array.isArray(post.content) ? post.content : [post.content].filter(Boolean);

  // Find related product if linked
  const relatedProduct = post.relatedProductSlug 
    ? PRODUCTS.find(p => p.slug === post.relatedProductSlug || p.id === post.relatedProductSlug)
    : PRODUCTS.find(p => p.category === 'business-manager' || p.category === 'verified-bm') || null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTelegram = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <article className="mx-auto max-w-4xl" itemScope itemType="https://schema.org/BlogPosting">
          
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto pb-1">
            <Link href="/" className="hover:text-slate-900 transition-colors whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/tips" className="hover:text-slate-900 transition-colors whitespace-nowrap">Tips &amp; Guides</Link>
            <span>/</span>
            <span className="text-amber-600 truncate font-medium">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-5 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-calon text-xs py-1 px-3.5 font-bold shadow-xs">
                {post.category || 'Guides'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{post.readTime || '4 min read'}</span>
              </div>
              <span className="text-xs text-slate-400">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <time dateTime={post.publishedTime || ''}>{post.date}</time>
              </div>
            </div>

            <h1
              itemProp="headline"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight"
            >
              {post.title}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>

            {/* Author & Share Bar */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FBAD18] to-[#D97706] flex items-center justify-center text-slate-950 font-bold text-sm shadow-xs">
                  {authorName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900" itemProp="author">
                    {authorName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {authorRole}
                  </div>
                </div>
              </div>

              {/* Share and Tags quick actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareTelegram}
                  className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0088cc] hover:border-slate-300 transition-all shadow-xs cursor-pointer"
                  title="Share on Telegram"
                >
                  <Send className="w-3.5 h-3.5 text-[#0088cc]" />
                  <span className="font-semibold">Telegram</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
                  title="Copy link to clipboard"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold">Share Guide</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image Hero Banner */}
          <div className="mb-10 rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-950 relative aspect-[16/9] w-full">
            <Image
              src={bannerImage}
              alt={bannerAlt}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Key Takeaways Callout */}
          <div className="mb-10 bg-amber-500/10 border-l-4 border-[#FBAD18] rounded-2xl p-6 sm:p-7 text-slate-800">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>Key Takeaways &amp; Quick Summary</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Core Benefit:</strong> {post.excerpt}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Security Focus:</strong> Protect assets with 2FA, anti-detect browser cookies, and secondary admin assignments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Scale Protocol:</strong> Warm up payment thresholds gradually to avoid heuristic checkpoint flags.</span>
              </li>
            </ul>
          </div>

          {/* Main Article Body */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
            {postContent.map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2
                    key={idx}
                    className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 pt-6 pb-1 border-b border-slate-100 flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4 text-[#FBAD18]" />
                    <span>{paragraph.replace('### ', '')}</span>
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 pl-2">
                    <span className="text-[#FBAD18] font-bold text-lg leading-none">•</span>
                    <span>{paragraph.replace('- ', '')}</span>
                  </div>
                );
              }
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm sm:text-base text-slate-700 pl-4 font-medium leading-relaxed">
                    {paragraph}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Related Product Callout Box */}
          {relatedProduct && (
            <div className="mt-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBAD18]/20 text-[#FBAD18] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Asset Recommended for this Strategy</span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-white">
                  {relatedProduct.title}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Instant delivery with 24-hour guarantee, clean cookies, and pre-warmed spending limits ready for scaling.
                </p>
                <div className="text-lg font-black text-[#FBAD18] pt-1">
                  ${relatedProduct.price} <span className="text-xs text-slate-400 font-normal">USD</span>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/product/${relatedProduct.slug}`}
                  className="btn-action btn-primary text-xs py-3 px-6 font-bold flex items-center gap-2 shadow-lg"
                >
                  <span>View Product</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Dynamic Tags Section */}
          {postTags.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                <TagIcon className="w-3.5 h-3.5 text-[#FBAD18]" />
                <span>Article Topics &amp; Search Keywords:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {postTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tips?tag=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FBAD18]/20 text-slate-700 hover:text-slate-900 font-medium transition-colors border border-slate-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Box */}
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FBAD18] to-[#D97706] flex items-center justify-center text-slate-950 font-black text-xl shrink-0 shadow-md">
              BM
            </div>
            <div className="space-y-1">
              <h4 className="font-heading text-base font-bold text-slate-900">
                Written by {authorName}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The BM Shop engineering and media buying team tests thousands of Meta ad accounts, Business Managers, and payment gateways annually to deliver battle-tested scaling blueprints.
              </p>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <section className="mt-14 pt-10 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-slate-900">
                    Related Advertising Guides
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Continue learning with more blueprints on Meta asset security and scaling.
                  </p>
                </div>

                <Link
                  href="/tips"
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                >
                  <span>View all tips</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => {
                  const relBanner = related.image || '/tips/facebook-bm2500-guide.svg';
                  return (
                    <article
                      key={related.slug}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:border-[#FBAD18] hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <Link href={`/tips/${related.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                          <Image
                            src={relBanner}
                            alt={related.imageAlt || related.title}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 badge-calon text-[10px] py-0.5 px-2">
                            {related.category || 'Guides'}
                          </span>
                        </Link>

                        <div className="p-4">
                          <Link href={`/tips/${related.slug}`}>
                            <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2">
                              {related.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {related.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{related.readTime || '4 min read'}</span>
                        <Link
                          href={`/tips/${related.slug}`}
                          className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Navigation Actions Footer */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <Link
              href="/tips"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all tips &amp; guides</span>
            </Link>

            <a
              href="https://t.me/bybm4u"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action btn-primary text-xs py-2.5 px-6 flex items-center gap-2 font-bold shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask an Advertising Specialist on Telegram</span>
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
