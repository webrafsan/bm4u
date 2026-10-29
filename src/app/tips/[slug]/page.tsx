import type { Metadata } from 'next';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { getPostsCollection } from '@/lib/db';
import { POSTS } from '@/data/posts';
import { BlogPost } from '@/types';
import TipClient from './TipClient';

export const instant = false;

async function getLivePost(slug: string): Promise<BlogPost | null> {
  try {
    const postsCol = await getPostsCollection();
    const dbPost = await postsCol.findOne({ slug });
    if (dbPost) {
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        metaTitle: dbPost.metaTitle,
        metaDescription: dbPost.metaDescription,
        date: dbPost.date,
        publishedTime: dbPost.publishedTime || new Date().toISOString(),
        modifiedTime: dbPost.modifiedTime || new Date().toISOString(),
        readTime: dbPost.readTime || '4 min read',
        excerpt: dbPost.excerpt || '',
        content: Array.isArray(dbPost.content) ? dbPost.content : [dbPost.content].filter(Boolean),
        category: dbPost.category || 'Guides',
        image: dbPost.image || '/tips/facebook-bm2500-guide.svg',
        imageAlt: dbPost.imageAlt || dbPost.title,
        tags: Array.isArray(dbPost.tags) ? dbPost.tags : [],
        author: dbPost.author || { name: 'BM4U Asset Team', role: 'Senior Media Buying Architect' },
        relatedProductSlug: dbPost.relatedProductSlug,
      };
    }
  } catch (err) {
    console.error('Error fetching post by slug from DB:', err);
  }

  const staticPost = POSTS.find(p => p.slug === slug);
  return staticPost || null;
}

async function getRelatedPosts(currentPost: BlogPost): Promise<BlogPost[]> {
  try {
    const postsCol = await getPostsCollection();
    const allDbPosts = await postsCol.find({ slug: { $ne: currentPost.slug } }).limit(20).toArray();

    if (allDbPosts.length > 0) {
      const currentTags = Array.isArray(currentPost.tags) ? currentPost.tags : [];
      return allDbPosts
        .sort((a, b) => {
          const aTags = Array.isArray(a.tags) ? a.tags : [];
          const bTags = Array.isArray(b.tags) ? b.tags : [];
          const aShared = aTags.filter(t => currentTags.includes(t)).length;
          const bShared = bTags.filter(t => currentTags.includes(t)).length;
          return bShared - aShared;
        })
        .slice(0, 3)
        .map(p => ({
          slug: p.slug,
          title: p.title,
          date: p.date,
          readTime: p.readTime || '4 min read',
          excerpt: p.excerpt || '',
          content: Array.isArray(p.content) ? p.content : [],
          category: p.category || 'Guides',
          image: p.image || '/tips/facebook-bm2500-guide.svg',
          imageAlt: p.imageAlt || p.title,
          tags: Array.isArray(p.tags) ? p.tags : [],
          author: p.author || { name: 'BM4U Asset Team', role: 'Senior Media Buying Architect' },
        }));
    }
  } catch (err) {
    console.error('Error fetching related posts:', err);
  }

  // Fallback to static related
  return POSTS
    .filter(p => p.slug !== currentPost.slug)
    .sort((a, b) => {
      const aShared = (a.tags || []).filter(t => (currentPost.tags || []).includes(t)).length;
      const bShared = (b.tags || []).filter(t => (currentPost.tags || []).includes(t)).length;
      return bShared - aShared;
    })
    .slice(0, 3);
}

export async function generateStaticParams() {
  try {
    const postsCol = await getPostsCollection();
    const dbPosts = await postsCol.find({}, { projection: { slug: 1 } }).toArray();
    if (dbPosts.length > 0) {
      return dbPosts.map(p => ({ slug: p.slug }));
    }
  } catch {
    // ignore
  }
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getLivePost(slug);

  if (!post) {
    return {
      title: 'Guide Not Found | BM Shop Tips',
      description: 'The requested Meta advertising guide does not exist.',
    };
  }

  const title = post.metaTitle || `${post.title} | BM Shop Tips`;
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
      siteName: 'BM Shop',
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
  await connection();
  const { slug } = await params;
  const post = await getLivePost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);
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
    datePublished: post.publishedTime || new Date().toISOString(),
    dateModified: post.modifiedTime || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BM Shop',
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
