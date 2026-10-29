'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag, 
  Sparkles, 
  ChevronDown, 
  X, 
  Filter 
} from 'lucide-react';
import { BlogPost } from '@/types';

interface TipsListClientProps {
  posts: BlogPost[];
}

function TipsListContent({ posts }: TipsListClientProps) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get('tag') || 'All';
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  useEffect(() => {
    if (initialTag && initialTag !== 'All') {
      setSelectedTag(initialTag);
    }
  }, [initialTag]);

  // Compute tag counts and sorted tag list dynamically
  const { availableTags, tagCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => {
          const clean = t.trim();
          if (clean) {
            counts[clean] = (counts[clean] || 0) + 1;
          }
        });
      }
    });

    const sorted = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return { availableTags: sorted, tagCounts: counts };
  }, [posts]);

  // Compute category counts and sorted category list dynamically
  const { availableCategories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      const cat = p.category?.trim() || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const sorted = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return { availableCategories: sorted, categoryCounts: counts };
  }, [posts]);

  // Filter posts by search query, category, and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postTags = Array.isArray(post.tags) ? post.tags : [];

      // Category filter
      if (selectedCategory !== 'All') {
        if (post.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Tag filter
      if (selectedTag !== 'All') {
        const matches = postTags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
        if (!matches) return false;
      }

      // Search match
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const inTitle = post.title?.toLowerCase().includes(q);
        const inExcerpt = post.excerpt?.toLowerCase().includes(q);
        const inTags = postTags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inExcerpt && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [posts, selectedTag, selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSelectedTag('All');
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTag !== 'All' || selectedCategory !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="space-y-10">
      {/* Sleek Filter Controls Bar with Dropdown Selectors */}
      <div className="card-glass rounded-2xl p-4 sm:p-5 border border-[#CBD5E1] bg-white shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, strategies, keywords (e.g. BM2500, 2FA, Warmup, Limit)..."
              className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl pl-11 pr-10 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FBAD18] focus:ring-1 focus:ring-[#FBAD18]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Selectors Group */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* Category Dropdown Selector */}
            <div className="relative w-full sm:w-44">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl pl-4 pr-9 py-3 text-sm text-[#0F172A] font-semibold focus:outline-none focus:border-[#FBAD18] appearance-none cursor-pointer"
              >
                <option value="All">All Categories ({posts.length})</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({categoryCounts[cat] || 0})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706] pointer-events-none" />
            </div>

            {/* Topic / Tag Dropdown Selector */}
            <div className="relative w-full sm:w-60">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full bg-[#EDF0F2] border border-[#CBD5E1] rounded-xl pl-9 pr-9 py-3 text-sm text-[#0F172A] font-semibold focus:outline-none focus:border-[#FBAD18] appearance-none cursor-pointer"
              >
                <option value="All">All Topics &amp; Tags ({availableTags.length})</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    #{tag} ({tagCounts[tag] || 0})
                  </option>
                ))}
              </select>
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706] pointer-events-none" />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Summary Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#D97706]" />
              <span>Active:</span>
            </span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-amber-950 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}

            {selectedTag !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                <span>Tag: #{selectedTag}</span>
                <button
                  onClick={() => setSelectedTag('All')}
                  className="hover:text-amber-950 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                <span>Query: &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-slate-950 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-[#D97706] hover:underline font-bold ml-auto cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <span>
          Showing <strong className="text-slate-900 font-bold">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'guide' : 'guides'}
          {selectedCategory !== 'All' && <span> in <strong className="text-[#D97706]">{selectedCategory}</strong></span>}
          {selectedTag !== 'All' && <span> tagged <strong className="text-[#D97706]">#{selectedTag}</strong></span>}
          {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
        </span>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
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
            Try choosing a different topic from the selector or reset your search keywords.
          </p>
          <button
            onClick={resetFilters}
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

                    {/* Tags Pill Badges - Clicking updates the dropdown selector */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {postTags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                            selectedTag.toLowerCase() === tag.toLowerCase()
                              ? 'bg-[#FBAD18] text-slate-900 font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-[#FBAD18]/20 hover:text-slate-900'
                          }`}
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
