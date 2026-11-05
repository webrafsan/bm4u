import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POSTS } from '@/data/posts';
import TipClient from './TipClient';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { getPostBySlug, getPosts, getProducts } from '@/lib/content';
import { getPostMeta, relatedPostsFor, relatedProductsForPost } from '@/lib/seoContent';
import { absoluteUrl, ogImage, toIsoDate, SITE_NAME, SITE_LOGO } from '@/lib/seo';

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
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const { title, description, keywords } = getPostMeta(post);
  const path = `/tips/${post.slug}`;

  return {
    title: { absolute: title.length <= 52 ? `${title} | ${SITE_NAME}` : title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: 'en_US',
      title,
      description,
      url: path,
      section: post.category,
      publishedTime: toIsoDate(post.date),
      modifiedTime: toIsoDate(post.updatedAt),
      images: [{ url: ogImage({ post: post.slug }), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage({ post: post.slug })],
    },
  };
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts, allProducts] = await Promise.all([getPostBySlug(slug), getPosts(), getProducts()]);
  if (!post) notFound();

  const relatedPosts = relatedPostsFor(`${post.title} ${post.excerpt}`, allPosts, post.slug);
  const relatedProducts = relatedProductsForPost(post, allProducts);
  const { keywords } = getPostMeta(post);
  const words = post.content.join(' ').split(/\s+/).length;

  const url = absoluteUrl(`/tips/${post.slug}`);
  const published = toIsoDate(post.date);
  const modified = toIsoDate(post.updatedAt) ?? published;

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: [absoluteUrl(ogImage({ post: post.slug }))],
            articleSection: post.category,
            keywords: keywords.join(', '),
            wordCount: words,
            inLanguage: 'en',
            datePublished: published,
            dateModified: modified,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            author: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
            publisher: {
              '@type': 'Organization',
              name: SITE_NAME,
              logo: { '@type': 'ImageObject', url: absoluteUrl(SITE_LOGO) },
            },
          },
          breadcrumbLd([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Tips', url: absoluteUrl('/tips') },
            { name: post.title, url },
          ]),
        ]}
      />
      <TipClient post={post} relatedPosts={relatedPosts} relatedProducts={relatedProducts} />
    </>
  );
}
