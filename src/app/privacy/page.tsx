import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { ogImage, pageSocial } from '@/lib/seo';

const title = 'Privacy Policy';
const description =
  'How BM 4 U collects, uses and protects the information you give us when you place an order, contact support or use our free 2FA and UID tools.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/privacy' },
  ...pageSocial({ title, description, path: '/privacy', image: ogImage({ page: 'privacy' }) }),
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={title}
      path="/privacy"
      updated="November 5, 2026"
      intro="This policy explains what information we collect on bm4u.net, why we collect it and the choices you have. We keep data collection to what we need to deliver your order."
      sections={[
        {
          heading: 'Information we collect',
          bullets: [
            'Order details: your name, email address, Telegram username, the product and quantity you order, your chosen payment method and cryptocurrency, the transaction ID you submit and any notes you add.',
            'Support messages: anything you send us by email or Telegram.',
            'Basic technical data that servers and hosting providers record automatically, such as IP address and request logs.',
          ],
        },
        {
          heading: 'How we use it',
          bullets: [
            'To confirm your payment, deliver your order and provide support and replacements.',
            'To contact you about your order.',
            'To keep the site secure and prevent abuse.',
          ],
        },
        {
          heading: 'Free tools and your browser',
          paragraphs: [
            'The 2FA code generator calculates codes inside your browser, and the secret you enter is not sent to our server. The live UID checker sends the UIDs you enter to our server, which requests the public profile picture endpoint to see whether each profile appears active.',
            'Your shopping cart is stored in your browser using local storage so it is still there when you return. You can clear it at any time by clearing site data.',
          ],
        },
        {
          heading: 'Sharing',
          paragraphs: [
            'We do not sell your personal information. We use infrastructure providers, such as hosting and database services, to run the site, and they process data on our behalf. We may disclose information if the law requires it.',
          ],
        },
        {
          heading: 'Retention and security',
          paragraphs: [
            'We keep order records for as long as needed to provide support, handle replacements and meet legal obligations. We use reasonable technical measures to protect the data we store, but no online service can promise absolute security.',
          ],
        },
        {
          heading: 'Your choices',
          paragraphs: [
            'You can ask us to access, correct or delete the personal information we hold about you by emailing support@bm4u.net. We will respond as soon as we reasonably can, subject to records we must keep.',
          ],
        },
        {
          heading: 'Changes to this policy',
          paragraphs: ['We may update this policy. The date at the top of this page shows when it was last changed.'],
        },
      ]}
    />
  );
}
