import type { Metadata } from 'next';
import LiveUIDCheckerClient from './LiveUIDCheckerClient';
import { ToolSeoContent } from '@/components/seo/ToolSeoContent';
import { UID_CHECKER_CONTENT } from '@/lib/toolContent';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Facebook Live UID Checker | Bulk Check Live or Die Accounts',
  description: 'Check whether Facebook UIDs are live or dead in bulk. Verify purchased accounts instantly before you log in.',
  alternates: { canonical: '/live-uid-checker' },
  ...pageSocial({ title: 'Facebook Live UID Checker | Bulk Check Live or Die Accounts', description: 'Check whether Facebook UIDs are live or dead in bulk. Verify purchased accounts instantly before you log in.', path: '/live-uid-checker', image: ogImage({ page: 'live-uid-checker' }) }),
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Facebook Live UID Checker', url: absoluteUrl('/live-uid-checker') },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Facebook Live UID Checker',
          description: 'Check whether Facebook UIDs are live or dead in bulk. Verify purchased accounts instantly before you log in.',
          url: absoluteUrl('/live-uid-checker'),
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: UID_CHECKER_CONTENT.howToName,
            step: UID_CHECKER_CONTENT.howToSteps.map((step, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: step.name,
              text: step.text,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: UID_CHECKER_CONTENT.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
      <LiveUIDCheckerClient seoContent={<ToolSeoContent content={UID_CHECKER_CONTENT} />} />
    </>
  );
}
