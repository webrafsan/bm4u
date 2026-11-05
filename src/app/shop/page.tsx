import type { Metadata } from 'next';
import ShopClient from './ShopClient';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { getProducts } from '@/lib/content';
import { ShopSeoContent } from '@/components/seo/ShopSeoContent';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

const title = 'Shop Facebook Business Managers, Ad Accounts & TikTok Accounts';
const description =
  'Browse verified Business Managers, BM2500, 2-line & 3-line reinstated profiles, Facebook ad accounts and TikTok agency accounts with instant delivery and a 24-hour guarantee.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'buy facebook business manager',
    'facebook ad accounts for sale',
    'bm3 business manager',
    'bm5 business manager',
    'reinstated facebook account',
    'tiktok ads account',
  ],
  alternates: { canonical: '/shop' },
  ...pageSocial({ title, description, path: '/shop', image: ogImage({ page: 'shop' }) }),
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Shop', url: absoluteUrl('/shop') },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'BM 4 U product catalog',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(`/product/${p.slug}`),
              name: p.title,
            })),
          },
        ]}
      />
      <ShopClient products={products} seoContent={<ShopSeoContent />} />
    </>
  );
}
