import type { Metadata } from 'next';
import TipsClient from './TipsClient';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { getPosts } from '@/lib/content';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

const title = 'Meta Ads Tips & Business Manager Guides';
const description =
  'Practical guides for media buyers: securing a Facebook Business Manager, adding backup admins, scaling ad spend, and avoiding account restrictions.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/tips' },
  ...pageSocial({ title, description, path: '/tips', image: ogImage({ page: 'tips' }) }),
};

export default async function TipsPage() {
  const posts = await getPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Tips', url: absoluteUrl('/tips') },
        ])}
      />
      <TipsClient posts={posts} />
    </>
  );
}
