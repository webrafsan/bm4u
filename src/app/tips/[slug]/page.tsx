import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POSTS } from '@/data/posts';
import TipClient from './TipClient';

export function generateStaticParams() {
  return POSTS.map(p => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Guide Not Found | BM4U Tips',
      description: 'The requested Meta advertising guide does not exist.',
    };
  }

  const title = post.metaTitle || `${post.title} | BM4U Tips`;
  const description = post.metaDescription || post.excerpt;
  const canonicalUrl = `https://bm4u.net/tips/${post.slug}`;
  const imageUrl = `https://bm4u.net${post.image}`;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'BM4U.net',
      type: 'article',
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
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
  const post = POSTS.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find related posts by shared tags or category
  const relatedPosts = POSTS
    .filter(p => p.slug !== post.slug)
    .sort((a, b) => {
      const aShared = a.tags.filter(t => post.tags.includes(t)).length;
      const bShared = b.tags.filter(t => post.tags.includes(t)).length;
      return bShared - aShared;
    })
    .slice(0, 3);

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
    image: [`https://bm4u.net${post.image}`],
    datePublished: post.publishedTime,
    dateModified: post.modifiedTime,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BM4U',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bm4u.net/logo.png',
      },
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
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
        name: 'Tips',
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
