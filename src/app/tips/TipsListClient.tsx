'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Calendar, Clock, ArrowRight, Search, Tag, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types';

interface TipsListClientProps {
  posts: BlogPost[];
}

function TipsListContent({ posts }: TipsListClientProps) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get('tag') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  useEffect(() => {
    if (initialTag && initialTag !== 'All') {
      setSelectedTag(initialTag);
    }
  }, [initialTag]);

  // Compute all available tags dynamically from live posts in database
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => {
          if (t && t.trim()) set.add(t.trim());
        });
      }
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postTags = Array.isArray(post.tags) ? post.tags : [];
      const matchesTag = 
        selectedTag === 'All' || 
        postTags.some(t => t.toLowerCase() === selectedTag.toLowerCase()) || 
        post.category?.toLowerCase() === selectedTag.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        postTags.some(t => t.toLowerCase().includes(q));

      return matchesTag && matchesSearch;
    });
  }, [posts, selectedTag, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search Bar & Dynamic Tag Filter Controls */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, tags, keywords (e.g. BM2500, 2FA, Warmup, Limit)..."
            className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBAD18] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dynamic Tag Pills Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 justify-center">
            <Tag className="w-3.5 h-3.5 text-[#FBAD18]" />
            <span>Filter by Topic &amp; Tags ({availableTags.length - 1} categories):</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {availableTags.map((tag) => {
              const isActive = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FBAD18] text-slate-900 shadow-sm scale-105 font-bold'
                      : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tag === 'All' ? '⚡ All Articles' : `#${tag}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <span>
          Showing <strong className="text-slate-900 font-bold">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'guide' : 'guides'}
          {selectedTag !== 'All' && <span> in <strong className="text-[#D97706]">#{selectedTag}</strong></span>}
          {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
        </span>

        {(selectedTag !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedTag('All');
              setSearchQuery('');
            }}
            className="text-[#D97706] hover:text-[#B45309] font-semibold underline underline-offset-2 cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">No matching guides found</h3>
          <p className="text-xs text-slate-500 mb-6">
            Try adjusting your search keywords or select another tag to explore more articles.
          </p>
          <button
            onClick={() => {
              setSelectedTag('All');
              setSearchQuery('');
            }}
            className="btn-action btn-primary text-xs py-2 px-5 font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const authorName = post.author?.name || 'BM4U Asset Team';
            const bannerImage = post.image || '/tips/facebook-bm2500-guide.svg';
            const postTags = Array.isArray(post.tags) ? post.tags : [];

            return (
              <article
                key={post.slug}
                className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200 shadow-sm hover:border-[#FBAD18]/60 hover:shadow-xl transition-all duration-300 group"
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                <div>
                  {/* Featured Image Banner */}
                  <Link href={`/tips/${post.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <Image
                      src={bannerImage}
                      alt={post.imageAlt || post.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge-calon text-[11px] py-1 px-2.5 font-bold backdrop-blur-md shadow-xs">
                        {post.category || 'Guides'}
                      </span>
                    </div>
                  </Link>

                  {/* Content Area */}
                  <div className="p-6">
                    {/* Meta stats */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <time dateTime={post.publishedTime || ''}>{post.date}</time>
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {post.readTime || '4 min read'}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/tips/${post.slug}`}>
                      <h2
                        itemProp="headline"
                        className="font-heading text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-3 leading-snug"
                      >
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p
                      itemProp="description"
                      className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4"
                    >
                      {post.excerpt}
                    </p>

                    {/* Tags Pill Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {postTags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-[#FBAD18]/20 hover:text-slate-900 font-medium transition-colors cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                      {postTags.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{postTags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500 text-[11px]">
                    <span>By </span>
                    <strong className="text-slate-800 font-semibold">{authorName}</strong>
                  </div>

                  <Link
                    href={`/tips/${post.slug}`}
                    className="text-amber-600 hover:text-amber-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1.5"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* SEO Bottom Callout Block */}
      <div className="mt-16 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-slate-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBAD18]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBAD18]/20 text-[#FBAD18] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BM Shop Scaling Knowledge Hub</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Ready to deploy high-limit advertising assets?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Explore our verified inventory of BM2500 Business Managers, 3-Line Reinstated profiles, and multi-ad account BM5 packages with 24-hour replacement guarantee.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="btn-action btn-primary text-xs py-3 px-6 font-bold flex items-center gap-2 shadow-lg"
            >
              <span>Explore BM Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://t.me/bybm4u"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-white font-semibold py-3 px-4 rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
            >
              Contact Telegram Support (@bybm4u)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TipsListClient({ posts }: TipsListClientProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading guides &amp; blueprints...</div>}>
      <TipsListContent posts={posts} />
    </Suspense>
  );
}
