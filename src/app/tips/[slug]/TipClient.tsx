'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { POSTS } from '@/data/posts';

export default function TipClient({ slug }: { slug: string }) {
  const post = POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">Guide Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">The requested guide does not exist.</p>
          <Link href="/tips" className="btn-action btn-primary text-xs py-2.5 px-6 font-bold">
            Back to Tips
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <article className="mx-auto max-w-3xl">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tips" className="hover:text-slate-900 transition-colors">Tips</Link>
            <span>/</span>
            <span className="text-amber-600 truncate font-medium">{post.title}</span>
          </div>

          {/* Meta headers */}
          <div className="space-y-4 mb-10 pb-8 border-b border-slate-200">
            <span className="badge-calon text-xs py-0.5 px-3">
              {post.category}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
            {post.content.map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-heading text-xl sm:text-2xl font-bold text-slate-900 pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={idx} className="list-disc list-inside text-sm text-slate-600">
                    {paragraph.replace('- ', '')}
                  </li>
                );
              }
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <p key={idx} className="text-sm text-slate-600 pl-2">
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <Link
              href="/tips"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all tips</span>
            </Link>

            <a
              href="https://t.me/bybm4u"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action btn-primary text-xs py-2.5 px-6 flex items-center gap-2 font-bold shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask a Question on Telegram</span>
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
