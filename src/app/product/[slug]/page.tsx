import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import ProductClient from './ProductClient';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { getProducts, getProductBySlug, getPosts } from '@/lib/content';
import { CATEGORY_PAGES, categoryPathFor } from '@/lib/categories';
import { getProductMeta, getProductContent, relatedPostsFor } from '@/lib/seoContent';
import { ProductSeoContent } from '@/components/seo/ProductSeoContent';
import { absoluteUrl, ogImage, SITE_NAME } from '@/lib/seo';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const { title, description, keywords } = getProductMeta(product);
  const path = `/product/${product.slug}`;

  return {
    title: { absolute: title.length <= 52 ? `${title} | ${SITE_NAME}` : title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      title,
      description,
      url: path,
      images: [{ url: ogImage({ product: product.slug }), width: 1200, height: 630, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage({ product: product.slug })],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts, allPosts] = await Promise.all([getProductBySlug(slug), getProducts(), getPosts()]);
  if (!product) notFound();

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const { faqs } = getProductContent(product);
  const categoryPage = CATEGORY_PAGES.find(c => c.category === product.category);
  const relatedPosts = relatedPostsFor(`${product.title} ${product.limit || ''}`, allPosts);
  const url = absoluteUrl(`/product/${product.slug}`);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            sku: product.id,
            category: product.category,
            image: [absoluteUrl(ogImage({ product: product.slug }))],
            brand: { '@type': 'Brand', name: SITE_NAME },
            url,
            offers: {
              '@type': 'Offer',
              url,
              priceCurrency: 'USD',
              price: product.price,
              availability:
                product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: SITE_NAME },
            },
          },
          breadcrumbLd([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Shop', url: absoluteUrl('/shop') },
            { name: categoryPage?.name ?? 'Category', url: absoluteUrl(categoryPathFor(product.category)) },
            { name: product.title, url },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
      <ProductClient
        product={product}
        relatedProducts={relatedProducts}
        faqs={faqs}
        seoContent={<ProductSeoContent product={product} relatedPosts={relatedPosts} />}
      />
    </>
  );
}
