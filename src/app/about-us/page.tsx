import type { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us - Trusted Meta & TikTok Ad Account Supplier',
  description: 'Learn who is behind BM 4 U, how we source Business Managers and ad accounts, and how our 24-hour guarantee and Telegram support desk work.',
  alternates: { canonical: '/about-us' },
  ...pageSocial({ title: 'About Us - Trusted Meta & TikTok Ad Account Supplier', description: 'Learn who is behind BM 4 U, how we source Business Managers and ad accounts, and how our 24-hour guarantee and Telegram support desk work.', path: '/about-us', image: ogImage({ page: 'about-us' }) }),
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'About Us', url: absoluteUrl('/about-us') },
        ])}
      />
      <AboutUsClient />
    </>
  );
}
