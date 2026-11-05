'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { BlogPost, Product } from '@/types';
import { toIsoDate } from '@/lib/seo';
import { TelegramIcon } from '@/components/icons/TelegramIcon';

type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] };

// Posts are stored as a flat array of lines; consecutive list lines are grouped into one list.
function groupBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  for (const line of lines) {
    const last = blocks[blocks.length - 1];
    if (line.startsWith('#### ')) blocks.push({ type: 'h3', text: line.slice(5) });
    else if (line.startsWith('### ')) blocks.push({ type: 'h2', text: line.slice(4) });
    else if (line.startsWith('- ')) {
      if (last?.type === 'ul') last.items.push(line.slice(2));
      else blocks.push({ type: 'ul', items: [line.slice(2)] });
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '');
      if (last?.type === 'ol') last.items.push(text);
      else blocks.push({ type: 'ol', items: [text] });
    } else blocks.push({ type: 'p', text: line });
  }
  return blocks;
}

// Supports **bold** and [label](url) so posts can carry internal links.
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="text-slate-900">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      return href.startsWith('/') ? (
        <Link key={i} href={href} className="text-amber-600 font-semibold hover:underline">{link[1]}</Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">{link[1]}</a>
      );
    }
    return part;
  });
}

export default function TipClient({
  post,
  relatedPosts,
  relatedProducts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
  relatedProducts: Product[];
}) {
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
                <time dateTime={toIsoDate(post.date)?.slice(0, 10)}>{post.date}</time>
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
            {groupBlocks(post.content).map((block, idx) => {
              if (block.type === 'h2') {
                return (
                  <h2 key={idx} className="font-heading text-xl sm:text-2xl font-bold text-slate-900 pt-4">
                    {renderInline(block.text)}
                  </h2>
                );
              }
              if (block.type === 'h3') {
                return (
                  <h3 key={idx} className="font-heading text-lg font-bold text-slate-900 pt-2">
                    {renderInline(block.text)}
                  </h3>
                );
              }
              if (block.type === 'ul') {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                    {block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
                  </ul>
                );
              }
              if (block.type === 'ol') {
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                    {block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                  {renderInline((block as { text: string }).text)}
                </p>
              );
            })}
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">Related products</h2>
              <ul className="space-y-2.5 text-sm">
                {relatedProducts.map(prod => (
                  <li key={prod.id} className="flex items-center justify-between gap-4">
                    <Link href={`/product/${prod.slug}`} className="font-semibold text-amber-600 hover:underline">
                      {prod.title}
                    </Link>
                    <span className="text-slate-500 font-medium shrink-0">${prod.price.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="inline-block mt-4 text-xs font-bold text-slate-600 hover:text-slate-900">
                Browse the full shop →
              </Link>
            </section>
          )}

          {/* Related guides */}
          {relatedPosts.length > 0 && (
            <section className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">More guides</h2>
              <ul className="space-y-2.5 text-sm">
                {relatedPosts.map(rel => (
                  <li key={rel.slug}>
                    <Link href={`/tips/${rel.slug}`} className="font-semibold text-amber-600 hover:underline">
                      {rel.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

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
              <TelegramIcon className="w-3.5 h-3.5" />
              <span>Ask a Question on Telegram</span>
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
