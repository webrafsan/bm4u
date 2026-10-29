'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { POSTS } from '@/data/posts';
import { BlogPost } from '@/types';

export default function TipsPage() {
  const [postsList, setPostsList] = useState<BlogPost[]>(POSTS);

  useEffect(() => {
    async function loadDynamicPosts() {
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setPostsList(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic posts:', err);
      }
    }
    loadDynamicPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-4">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Advertiser Knowledge Base</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Meta Ads <span className="text-gradient">Tips & Guides</span>
            </h1>
            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Master Business Manager operations, scale campaigns safely, add backup administrators, and prevent unnecessary restrictions.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {postsList.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="badge-calon text-[10px] py-0.5 px-2">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/tips/${post.slug}`}>
                    <h2 className="font-heading font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors mb-3 leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  
                  <Link
                    href={`/tips/${post.slug}`}
                    className="font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
