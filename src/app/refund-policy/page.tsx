import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { ogImage, pageSocial } from '@/lib/seo';

const title = 'Refund & Replacement Policy';
const description =
  'How BM 4 U handles replacements and refunds: what the 24-hour guarantee covers, what it does not, and how to submit a request.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/refund-policy' },
  ...pageSocial({ title, description, path: '/refund-policy', image: ogImage({ page: 'refund-policy' }) }),
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title={title}
      path="/refund-policy"
      updated="November 5, 2026"
      intro="Our main remedy is a free replacement under the 24-hour guarantee. Because our products are digital and delivered electronically, this page explains exactly how replacements and refunds work."
      sections={[
        {
          heading: 'The 24-hour guarantee',
          paragraphs: [
            'Every asset is covered for 24 hours from the moment of delivery. If it does not work as described, report it to us inside that window and we will replace it. Reports made after the 24 hours have passed are not covered.',
          ],
        },
        {
          heading: 'What is covered',
          bullets: [
            'The delivered product is not as described on its product page.',
            'The 2FA secret key is corrupted or cannot generate valid codes.',
            'The primary email or checkpoint access does not work on first test.',
            'The login or invite is dead on delivery, confirmed for example with our live UID checker.',
          ],
        },
        {
          heading: 'What is not covered',
          bullets: [
            'Accounts restricted because of violations of Meta or TikTok advertising policies, prohibited offers or card declines.',
            'Changing the password or email immediately, before the session has had time to warm up.',
            'Using low-quality, datacenter or shared proxies that platforms flag.',
            'Change of mind or accidental purchases.',
            'Reports submitted after the 24-hour window.',
          ],
        },
        {
          heading: 'How to submit a request',
          bullets: [
            'Contact our Telegram support desk at @bybm4u or email support@bm4u.net within 24 hours of delivery.',
            'Include your order ID, the affected product and screenshots or a short recording showing the problem.',
            'We review the request and, if it is eligible, send a replacement.',
          ],
        },
        {
          heading: 'Refunds',
          paragraphs: [
            'Because assets are delivered digitally, we do not offer refunds for change of mind. If an eligible item cannot be replaced, contact support and we will agree a fair resolution with you directly.',
          ],
        },
        {
          heading: 'Related pages',
          paragraphs: ['See the replacement rules page for the short version of this policy, and our terms of service for the full conditions that apply to every order.'],
        },
      ]}
    />
  );
}
