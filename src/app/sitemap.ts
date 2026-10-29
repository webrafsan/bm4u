import { MetadataRoute } from 'next';
import { getPostsCollection, getProductsCollection } from '@/lib/db';
import { POSTS } from '@/data/posts';
import { PRODUCTS } from '@/data/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bm4u.net';

  // Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fb-2fa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/live-uid-checker`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/replace-rules`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Dynamic Blog Posts (/tips/[slug]) from MongoDB
  let postSlugs: { slug: string; lastModified: Date }[] = [];
  try {
    const postsCol = await getPostsCollection();
    const dbPosts = await postsCol.find({}, { projection: { slug: 1, modifiedTime: 1, publishedTime: 1 } }).toArray();
    if (dbPosts.length > 0) {
      postSlugs = dbPosts.map(p => ({
        slug: p.slug,
        lastModified: new Date(p.modifiedTime || p.publishedTime || new Date()),
      }));
    }
  } catch {
    // ignore
  }

  if (postSlugs.length === 0) {
    postSlugs = POSTS.map(p => ({
      slug: p.slug,
      lastModified: new Date(p.modifiedTime || p.publishedTime || new Date()),
    }));
  }

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((p) => ({
    url: `${baseUrl}/tips/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Products (/product/[slug]) from MongoDB
  let productSlugs: { slug: string }[] = [];
  try {
    const productsCol = await getProductsCollection();
    const dbProducts = await productsCol.find({}, { projection: { slug: 1 } }).toArray();
    if (dbProducts.length > 0) {
      productSlugs = dbProducts.map(p => ({ slug: p.slug }));
    }
  } catch {
    // ignore
  }

  if (productSlugs.length === 0) {
    productSlugs = PRODUCTS.map(p => ({ slug: p.slug }));
  }

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...postRoutes, ...productRoutes];
}
