import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { ogImage, pageSocial } from '@/lib/seo';

const title = 'Terms of Service';
const description =
  'The terms that apply when you buy Business Managers, ad accounts and other digital assets from BM 4 U, including delivery, payment, guarantee and acceptable use.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/terms' },
  ...pageSocial({ title, description, path: '/terms', image: ogImage({ page: 'terms' }) }),
};

export default function TermsPage() {
  return (
    <LegalPage
      title={title}
      path="/terms"
      updated="November 5, 2026"
      intro="These terms apply to every order placed on bm4u.net. By placing an order or using our tools you agree to them, so please read them before you buy."
      sections={[
        {
          heading: 'Who we are and what we sell',
          paragraphs: [
            'BM 4 U supplies digital advertising assets such as Meta Business Managers, reinstated Facebook profiles and TikTok Ads accounts, together with free browser tools such as the 2FA code generator and the live UID checker.',
            'Product pages describe each asset, its specifications and its price. We aim to keep these accurate, but the description on the product page at the time of your order is what we deliver against.',
          ],
        },
        {
          heading: 'Orders, payment and delivery',
          bullets: [
            'Payment is accepted in cryptocurrency (Bitcoin, Ethereum, USDT and Solana). An order is confirmed when we verify your transaction.',
            'Digital assets are delivered electronically to the contact details you provide at checkout, such as your email address or Telegram username.',
            'You are responsible for providing correct contact details and for sending the exact amount to the wallet address shown for your order.',
            'Prices are shown in US dollars and may change; the price shown when you place the order applies.',
          ],
        },
        {
          heading: '24-hour guarantee',
          paragraphs: [
            'Every asset carries a 24-hour guarantee that starts at the time of delivery. If a delivered asset does not work as described, report it to our support desk within that window so we can replace it. What is and is not covered is set out in our replacement rules and refund policy, which form part of these terms.',
          ],
        },
        {
          heading: 'Your responsibilities',
          bullets: [
            'You must use purchased assets lawfully and in line with the advertising policies and terms of Meta, TikTok and any other platform you use them on.',
            'You are responsible for your ads, landing pages, payment methods and account security, including adding backup administrators and keeping two-factor authentication active.',
            'You must not use our services for illegal activity or to harm others.',
          ],
        },
        {
          heading: 'No guarantee of results',
          paragraphs: [
            'Platforms such as Meta and TikTok control their own accounts, limits and enforcement decisions. We cannot promise any particular spending limit, ad approval, performance or account lifespan after delivery, and restrictions caused by your own activity are outside our control.',
          ],
        },
        {
          heading: 'Free tools',
          paragraphs: [
            'The 2FA code generator and live UID checker are provided as a convenience, as is. The UID checker gives an indication based on public profile responses and is not a guarantee that an account can be accessed.',
          ],
        },
        {
          heading: 'Limitation of liability',
          paragraphs: [
            'To the extent permitted by law, our liability for any claim relating to an order is limited to replacing the affected asset or the amount you paid for that asset. We are not liable for indirect losses such as lost revenue, lost ad spend or loss of data.',
          ],
        },
        {
          heading: 'Changes to these terms',
          paragraphs: [
            'We may update these terms from time to time. The date at the top of this page shows when they were last changed, and the version in force when you order applies to that order.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: ['For questions about these terms, email support@bm4u.net or contact our Telegram support desk at @bybm4u.'],
        },
      ]}
    />
  );
}
