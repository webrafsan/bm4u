import type { Metadata } from 'next';
import ReplaceRulesClient from './ReplaceRulesClient';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { getSiteSettings } from '@/lib/content';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Replacement Policy & 24-Hour Guarantee',
  description: 'Read the BM 4 U replacement rules: what is covered by the 24-hour technical warranty, how to report a problem, and what voids a replacement.',
  alternates: { canonical: '/replace-rules' },
  ...pageSocial({ title: 'Replacement Policy & 24-Hour Guarantee', description: 'Read the BM 4 U replacement rules: what is covered by the 24-hour technical warranty, how to report a problem, and what voids a replacement.', path: '/replace-rules', image: ogImage({ page: 'replace-rules' }) }),
};

export default async function Page() {
  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Replacement Policy', url: absoluteUrl('/replace-rules') },
        ])}
      />
      <ReplaceRulesClient initialSettings={settings} />
    </>
  );
}
