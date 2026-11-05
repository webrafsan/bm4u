import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

// Pages that should not be indexed but must stay crawlable (so their noindex tag is seen)
// are handled with page-level metadata. Only admin and API are blocked outright.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
