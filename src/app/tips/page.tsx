import type { Metadata } from 'next';
import { connection } from 'next/server';
import { BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getPostsCollection } from '@/lib/db';
import { POSTS } from '@/data/posts';
import { BlogPost } from '@/types';
import { TipsListClient } from './TipsListClient';

export const instant = false;

export const metadata: Metadata = {
  title: 'Meta Ads Tips, BM Guides & Scale Strategies | BM Shop Blog',
  description: 'Expert Facebook & TikTok advertising guides. Master BM2500 scaling, backup admin security, 2-line vs 3-line reinstated accounts, and safe 7-day warmup strategies.',
  keywords: [
    'Facebook Business Manager Tips',
    'Meta Ads Guides',
    'BM2500 Scale Guide',
    'How to add backup admin Facebook BM',
    '2-line vs 3-line reinstated accounts',
    'BM5 Business Manager',
    'Facebook ad account warmup strategy',
    'Media Buying Tips',
    'Agency Ad Accounts'
  ],
  alternates: {
    canonical: 'https://bm4u.net/tips',
  },
  openGraph: {
    title: 'Meta Ads Tips, BM Guides & Scale Strategies | BM Shop Blog',
    description: 'Expert Facebook & TikTok advertising guides. Master BM2500 scaling, backup admin security, 2-line vs 3-line reinstated accounts, and safe 7-day warmup strategies.',
    url: 'https://bm4u.net/tips',
    siteName: 'BM Shop',
    images: [
      {
        url: 'https://bm4u.net/tips/facebook-bm2500-guide.svg',
        width: 1200,
        height: 630,
        alt: 'BM Shop Meta Ads Tips & Business Manager Knowledge Base',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Ads Tips, BM Guides & Scale Strategies | BM Shop Blog',
    description: 'Master Facebook Business Manager operations, scale campaigns safely, and prevent ad restrictions.',
    images: ['https://bm4u.net/tips/facebook-bm2500-guide.svg'],
  },
};

async function getLivePosts(): Promise<BlogPost[]> {
  try {
    const postsCol = await getPostsCollection();
    const dbPosts = await postsCol.find({}).sort({ publishedTime: -1, createdAt: -1 }).toArray();

    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(p => ({
        slug: p.slug,
        title: p.title,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        date: p.date,
        publishedTime: p.publishedTime,
        modifiedTime: p.modifiedTime,
        readTime: p.readTime,
        excerpt: p.excerpt,
        content: Array.isArray(p.content) ? p.content : [p.content].filter(Boolean),
        category: p.category || 'Guides',
        image: p.image || '/tips/facebook-bm2500-guide.svg',
        imageAlt: p.imageAlt || p.title,
        tags: Array.isArray(p.tags) ? p.tags : [],
        author: p.author || { name: 'BM4U Asset Team', role: 'Senior Media Buying Architect' },
        relatedProductSlug: p.relatedProductSlug,
      }));
    }
  } catch (err) {
    console.error('Error querying posts from MongoDB:', err);
  }
  return POSTS;
}

export default async function TipsPage() {
  await connection();
  const posts = await getLivePosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Meta Ads Tips & Guides - BM Shop Knowledge Base',
    description: 'Master Business Manager operations, scale campaigns safely, add backup administrators, and prevent unnecessary restrictions.',
    url: 'https://bm4u.net/tips',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://bm4u.net/tips/${post.slug}`,
        name: post.title,
        image: `https://bm4u.net${post.image || '/tips/facebook-bm2500-guide.svg'}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col">
      {/* Schema.org CollectionPage / ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-calon text-xs mb-4">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Advertiser Knowledge Base &amp; Live CMS Guides</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Meta Ads <span className="text-gradient">Tips &amp; Blueprint Guides</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Step-by-step technical blueprints written for professional media buyers, agencies, and e-commerce brands. Scale ad budgets securely, configure backup administrators, and master asset resilience.
            </p>
          </div>

          {/* Dynamic Interactive Client Search & Tag Filter Grid */}
          <TipsListClient posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
