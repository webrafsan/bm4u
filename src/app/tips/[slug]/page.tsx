import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POSTS } from '@/data/posts';
import { BlogPost } from '@/types';
import TipClient from './TipClient';

function getPost(slug: string): BlogPost | null {
  return POSTS.find(p => p.slug === slug) || null;
}

function getRelatedPosts(currentPost: BlogPost): BlogPost[] {
  return POSTS
    .filter(p => p.slug !== currentPost.slug)
    .sort((a, b) => {
      const aShared = (a.tags || []).filter(t => (currentPost.tags || []).includes(t)).length;
      const bShared = (b.tags || []).filter(t => (currentPost.tags || []).includes(t)).length;
      return bShared - aShared;
    })
    .slice(0, 3);
}

export function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: 'Guide Not Found | BM 4 U Tips',
      description: 'The requested Meta advertising guide does not exist.',
    };
  }

  const title = post.metaTitle || `${post.title} | BM 4 U Tips`;
  const description = post.metaDescription || post.excerpt;
  const canonicalUrl = `https://bm4u.net/tips/${post.slug}`;
  const imageUrl = post.image?.startsWith('http') 
    ? post.image 
    : `https://bm4u.net${post.image || '/tips/facebook-bm2500-guide.svg'}`;

  const authorName = post.author?.name || 'BM4U Asset Team';

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: authorName }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'BM 4 U',
      type: 'article',
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: [authorName],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);
  const authorName = post.author?.name || 'BM4U Asset Team';
  const authorRole = post.author?.role || 'Senior Media Buying Architect';
  const postTags = Array.isArray(post.tags) ? post.tags : [];
  const imageUrl = post.image?.startsWith('http') 
    ? post.image 
    : `https://bm4u.net${post.image || '/tips/facebook-bm2500-guide.svg'}`;

  // Schema.org BlogPosting & BreadcrumbList
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bm4u.net/tips/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: post.publishedTime || '2026-09-01T00:00:00Z',
    dateModified: post.modifiedTime || '2026-09-01T00:00:00Z',
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BM 4 U',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bm4u.net/logo-100.webp',
      },
    },
    keywords: postTags.join(', '),
    articleSection: post.category || 'Guides',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://bm4u.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tips & Guides',
        item: 'https://bm4u.net/tips',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://bm4u.net/tips/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TipClient slug={slug} post={post} relatedPosts={relatedPosts} />
    </>
  );
}
