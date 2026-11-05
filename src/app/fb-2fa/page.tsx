import type { Metadata } from 'next';
import FB2FAClient from './FB2FAClient';
import { ToolSeoContent } from '@/components/seo/ToolSeoContent';
import { TWO_FA_CONTENT } from '@/lib/toolContent';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Facebook 2FA Code Generator (TOTP Authenticator)',
  description: 'Generate Facebook 2FA login codes online from your Base32 secret key. Live 30-second countdown, one-click copy, and 100% private in-browser processing.',
  alternates: { canonical: '/fb-2fa' },
  ...pageSocial({ title: 'Free Facebook 2FA Code Generator (TOTP Authenticator)', description: 'Generate Facebook 2FA login codes online from your Base32 secret key. Live 30-second countdown, one-click copy, and 100% private in-browser processing.', path: '/fb-2fa', image: ogImage({ page: 'fb-2fa' }) }),
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'FB 2FA Authenticator', url: absoluteUrl('/fb-2fa') },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Free Facebook 2FA Code Generator (TOTP Authenticator)',
          description: 'Generate Facebook 2FA login codes online from your Base32 secret key. Live 30-second countdown, one-click copy, and 100% private in-browser processing.',
          url: absoluteUrl('/fb-2fa'),
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
            name: TWO_FA_CONTENT.howToName,
            step: TWO_FA_CONTENT.howToSteps.map((step, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: step.name,
              text: step.text,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: TWO_FA_CONTENT.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
      <FB2FAClient seoContent={<ToolSeoContent content={TWO_FA_CONTENT} />} />
    </>
  );
}
