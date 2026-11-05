import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { JsonLd } from '@/components/JsonLd';
import { getProducts, getPosts, getSiteSettings } from '@/lib/content';
import { HomeSeoContent } from '@/components/seo/HomeSeoContent';
import { SITE_FAQS } from '@/lib/seoContent';
import { absoluteUrl, pageSocial, SITE_NAME, SITE_LOGO, SITE_URL } from '@/lib/seo';

const title = 'Buy Facebook Business Manager & Reinstated Ad Accounts | BM 4 U';
const description =
  'Buy Facebook Business Managers, BM2500, reinstated 2-line & 3-line accounts and TikTok Ads accounts. Instant delivery, crypto payment, 24-hour guarantee.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'buy facebook business manager',
    'bm2500',
    'reinstated facebook account',
    '3 line reinstated account',
    'verified business manager',
    'tiktok ads account',
    'facebook ads agency account',
    'meta business manager for sale',
  ],
  alternates: { canonical: '/' },
  ...pageSocial({ title, description, path: '/' }),
};

// Stored by earlier versions of /api/settings; it has no target keyword, so fall back to the
// built-in headline (which does) until an admin writes a custom one.
const LEGACY_HERO_TITLE = 'Scale Your Meta & TikTok Campaigns With High-Limit Business Managers';

export default async function HomePage() {
  const [products, posts, settings] = await Promise.all([
    getProducts(),
    getPosts(),
    getSiteSettings(),
  ]);

  const heroSettings =
    settings && settings.heroTitle === LEGACY_HERO_TITLE ? { ...settings, heroTitle: undefined } : settings;
  const telegram = settings?.telegramLink || 'https://t.me/bybm4u';

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: absoluteUrl(SITE_LOGO),
            sameAs: [telegram],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: settings?.supportEmail || 'support@bm4u.net',
              url: telegram,
              availableLanguage: 'English',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_URL,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: SITE_FAQS.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
      <HomeClient
        initialProducts={products}
        initialSettings={heroSettings}
        posts={posts}
        seoContent={<HomeSeoContent />}
      />
    </>
  );
}
