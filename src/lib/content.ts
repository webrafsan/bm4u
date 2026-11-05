import { cacheLife, cacheTag } from 'next/cache';
import { PRODUCTS } from '@/data/products';
import { POSTS } from '@/data/posts';
import { SLUG_MAP } from '@/lib/slugs';
import type { Product, BlogPost } from '@/types';

export type SiteSettings = Record<string, string | number | boolean | object | undefined>;

// Server-side readers for products, posts and settings. MongoDB is the source of truth
// (the admin CMS writes there); the static data files are the fallback when the DB is
// empty or unreachable. Next re-throws errors from a cached scope even if the caller
// catches them, so each loader handles its own failure and returns null. A failed read
// gets a few-minutes cache life so the fallback is retried soon instead of sticking for hours.

// Short enough to retry soon, long enough (expire >= 5 min, stale >= 30 s) that Next still
// includes the fallback in the prerender instead of turning the page into a dynamic hole.
const RETRY_SOON = { stale: 60, revalidate: 300, expire: 600 };

// Mongo documents carry an ObjectId in _id, which can't cross the server/client boundary.
function plain<T>(docs: unknown): T {
  return JSON.parse(JSON.stringify(docs));
}

async function loadProducts(): Promise<Product[] | null> {
  'use cache';
  cacheTag('products');
  try {
    const result = await (async () => {
      const { getProductsCollection } = await import('./db');
      const col = await getProductsCollection();
      const docs = await col.find({}, { projection: { _id: 0 } }).toArray();
      return plain<Product[]>(docs);
    })();
    cacheLife('hours');
    return result;
  } catch {
    cacheLife(RETRY_SOON);
    return null;
  }
}

async function loadPosts(): Promise<BlogPost[] | null> {
  'use cache';
  cacheTag('posts');
  try {
    const result = await (async () => {
      const { getPostsCollection } = await import('./db');
      const col = await getPostsCollection();
      const docs = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
      return plain<BlogPost[]>(docs);
    })();
    cacheLife('hours');
    return result;
  } catch {
    cacheLife(RETRY_SOON);
    return null;
  }
}

async function loadSettings(): Promise<SiteSettings | null> {
  'use cache';
  cacheTag('settings');
  try {
    const result = await (async () => {
      const { getSettingsCollection } = await import('./db');
      const col = await getSettingsCollection();
      const doc = await col.findOne({ key: 'site_config' }, { projection: { _id: 0 } });
      return doc ? plain<SiteSettings>(doc) : null;
    })();
    cacheLife('hours');
    return result;
  } catch {
    cacheLife(RETRY_SOON);
    return null;
  }
}

// Products saved before the slug clean-up still carry the old slug in MongoDB.
function normaliseSlug(product: Product): Product {
  const entry = SLUG_MAP[product.id];
  return entry && product.slug === entry.old ? { ...product, slug: entry.current } : product;
}

export async function getProducts(): Promise<Product[]> {
  const products = await loadProducts();
  return (products && products.length > 0 ? products : PRODUCTS).map(normaliseSlug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.slug === slug || p.id === slug);
}

// The BM2500 guide originally shared its title with the BM2500 product page, so the two pages
// competed for the same query. Posts already stored in the DB with the old title get the new one.
const LEGACY_POST_TITLES: Record<string, { from: string; to: string }> = {
  'buy-facebook-bm2500-premium-meta-business-manager': {
    from: 'Buy Facebook BM2500 – Premium Meta Business Manager',
    to: 'BM2500 Guide: How to Receive and Secure a $2,500 Limit Business Manager',
  },
};

function applyPostFixes(post: BlogPost): BlogPost {
  const fix = LEGACY_POST_TITLES[post.slug];
  return fix && post.title === fix.from ? { ...post, title: fix.to } : post;
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await loadPosts();
  return (posts && posts.length > 0 ? posts : POSTS).map(applyPostFixes);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.slug === slug);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return loadSettings();
}
