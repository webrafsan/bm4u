import type { MetadataRoute } from 'next';
import { absoluteUrl, toIsoDate } from '@/lib/seo';
import { getProducts, getPosts } from '@/lib/content';
import { CATEGORY_PAGES } from '@/lib/categories';

const STATIC_PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/tips', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/fb-2fa', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/live-uid-checker', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/replace-rules', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/about-us', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
];

function toDate(value: unknown): Date | undefined {
  const iso = typeof value === 'string' ? toIsoDate(value) : undefined;
  return iso ? new Date(iso) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);

  return [
    ...STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...CATEGORY_PAGES.map(c => ({
      url: absoluteUrl(`/category/${c.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...products.map(p => ({
      url: absoluteUrl(`/product/${p.slug}`),
      lastModified: toDate(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: p.isSpecial || p.isPopular ? 0.9 : 0.8,
    })),
    ...posts.map(p => ({
      url: absoluteUrl(`/tips/${p.slug}`),
      lastModified: toDate(p.updatedAt) ?? toDate(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
