import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart'],
      },
    ],
    sitemap: 'https://bm4u.net/sitemap.xml',
  };
}
