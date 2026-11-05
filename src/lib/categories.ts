import type { ProductCategory } from '@/types';
import type { Faq } from '@/lib/seoContent';

export type CategoryPage = {
  slug: string;
  category: ProductCategory;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string[];
  chooseTitle: string;
  choose: string[];
  faqs: Faq[];
};

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: 'business-manager',
    category: 'business-manager',
    name: 'Business Managers',
    h1: 'Buy Facebook Business Manager (BM1, BM3, BM5, BM10)',
    metaTitle: 'Buy Facebook Business Manager - BM1, BM3, BM5, BM10',
    metaDescription:
      'Buy a ready Facebook Business Manager: restored BM3, reinstated BM1, BM5 for hold pages and BM10 for agencies. Instant invite, crypto payment, 24-hour guarantee.',
    keywords: ['buy facebook business manager', 'bm3 business manager', 'bm5 business manager', 'bm10 business manager', 'reinstated business manager', 'meta business manager for sale', 'agency business manager'],
    intro: [
      'A Business Manager (BM) is the Meta account that sits above your ad accounts, Pages and pixels. Starting a brand-new one means a low daily spending limit and a slow warm-up, which is why many media buyers and agencies buy a Business Manager that is already set up. The BM number in our catalogue is the rough count of ad accounts the Business Manager can hold, so a BM3 holds three and a BM10 holds ten.',
      'This category covers the full range: low-cost restored and reinstated BM3 assets for creative testing, aged BM0 and BM1 assets created in 2021-2022, a strong BM5 for hosting Pages and sharing pixels, and a BM10 built for agencies that need many ad accounts under one roof. Every Business Manager is delivered as an admin invite link with an access guide, and is covered by the 24-hour replacement guarantee.',
    ],
    chooseTitle: 'How to choose the right Business Manager',
    choose: [
      'Testing creatives or a new offer: a restored BM3 with a $50 limit keeps the cost low while you validate.',
      'Scaling a proven offer: a reinstated BM3 or BM1 with a $250 limit gives you more daily headroom.',
      'Holding Pages, pixels and agency ad accounts: a BM5 or the dedicated hold Business Manager keeps those assets insulated from your spend accounts.',
      'Running many client accounts: a BM10 gives you ten ad accounts and changeable billing in one place.',
      'Always accept the invite from an aged profile and add a backup administrator straight away.',
    ],
    faqs: [
      { question: 'What does BM3, BM5 or BM10 mean?', answer: 'The number is roughly how many ad accounts the Business Manager can hold or create. A BM3 holds three, a BM5 holds five and a BM10 holds ten, so you can isolate offers or clients across separate ad accounts.' },
      { question: 'What is a reinstated or restored Business Manager?', answer: 'It is a Business Manager that was restricted at some point and later restored by Meta. It keeps its history, which many buyers prefer to a freshly created one, but it still follows the same advertising policies as any other.' },
      { question: 'Which payment methods can I use?', answer: 'We accept Bitcoin, Ethereum, USDT and Solana. Each order shows a QR code and wallet address, and payment is confirmed with the transaction ID.' },
      { question: 'What happens if the invite link does not work?', answer: 'Report it on our Telegram support desk within 24 hours of delivery. Covered problems are replaced; the replacement rules page explains exactly what is and is not covered.' },
      { question: 'Do you also sell the admin profile to accept the invite?', answer: 'Yes. Our reinstated Facebook accounts, in 2-line and 3-line tiers, are commonly used as the admin profile for a Business Manager.' },
    ],
  },
  {
    slug: 'verified-bm',
    category: 'verified-bm',
    name: 'Verified Business Managers',
    h1: 'Buy Verified Facebook Business Manager (Docs Verified)',
    metaTitle: 'Buy Verified Facebook Business Manager - Docs Verified BM',
    metaDescription:
      'Buy a documents-verified Facebook Business Manager with 3-4 ready ad accounts. Verified in Meta Business Settings for higher trust in ad review. 24-hour guarantee.',
    keywords: ['buy verified business manager', 'docs verified bm', 'verified facebook business manager', 'meta business verification', 'verified bm usa', 'business manager with ad accounts'],
    intro: [
      'A verified Business Manager has completed business verification in Meta Business Settings with supporting company documents. Verification adds a layer of identity to the whole Business Manager, which advertisers use to reduce creative rejections, qualify for more features and let the daily spending limit expand as spend builds up.',
      'Our verified listings are USA stock with three or four ad accounts ready to launch. They suit e-commerce brands, lead-generation advertisers and agencies who want a stable base account instead of an unverified one. Delivery is an admin invite plus a short access guide, backed by the 24-hour replacement guarantee.',
    ],
    chooseTitle: 'What to check before you buy a verified BM',
    choose: [
      'Country: match the Business Manager country to your payment method and target market.',
      'Ad account count: three ad accounts is enough for most tests, four gives you room to split creatives or audiences.',
      'Spending limit: the starting limit is usually modest and grows with a clean billing history, so plan your first week of spend accordingly.',
      'Admin access: accept the invite from an aged profile and add a second administrator immediately.',
    ],
    faqs: [
      { question: 'What does docs verified mean?', answer: 'It means business verification was completed with supporting documents in Meta Business Settings. Verified Business Managers generally see higher trust during ad review, although results still depend on your creatives, billing and compliance.' },
      { question: 'Is a verified BM better than a reinstated BM?', answer: 'They solve different problems. Verification is about business identity and trust, while reinstated means the asset was restored after a restriction. Many advertisers use a verified BM for brand campaigns and a reinstated BM for fast, low-cost testing.' },
      { question: 'Will the spending limit increase?', answer: 'Meta raises the daily limit automatically as an ad account builds a clean billing history. We list the starting limit; the speed of growth depends on your spend and payment record.' },
      { question: 'Can I share pixels and Pages from it?', answer: 'Yes. Verified Business Managers can host and share pixels, Pages and assets with partners in the normal way through Business Settings.' },
    ],
  },
  {
    slug: 'facebook-account',
    category: 'facebook-account',
    name: 'Reinstated Facebook Accounts',
    h1: 'Buy Reinstated Facebook Accounts (2-Line & 3-Line)',
    metaTitle: 'Buy Reinstated Facebook Accounts - 2-Line & 3-Line, Full 2FA',
    metaDescription:
      'Buy reinstated 2-line and 3-line Facebook accounts by country (USA, UK, Germany and more) with live ads access, full 2FA, CP mail and cookies. 24-hour guarantee.',
    keywords: ['buy reinstated facebook account', '3 line reinstated account', '2 line facebook account', 'facebook account with 2fa', 'facebook account cp mail', 'aged facebook account', 'facebook admin profile'],
    intro: [
      'A reinstated Facebook account is a personal profile that was restricted and then restored after identity confirmation. It keeps its age and history, which makes it a stronger admin profile for a Business Manager, ad account or Page than a brand-new account. In our catalogue the tier is described in lines: 3-line profiles are the strongest reinstatement tier and 2-line profiles are the lower-cost option.',
      'Each account is delivered with the full login kit: UID, password, 2FA secret, email, email password, recovery email and cookies for anti-detect browsers. Stock is available by country, including the USA, United Kingdom, Germany, France, Australia, Poland, Spain, Hong Kong, Pakistan, Bangladesh and more, plus aged UID 1000XX profiles and mixed-country stock. The 24-hour guarantee applies from delivery.',
    ],
    chooseTitle: 'How to pick the right account',
    choose: [
      'Match the account country to the proxy and payment method you plan to use.',
      'Choose 3-line for the main admin profile of a valuable Business Manager; choose 2-line for lower-risk or supporting roles.',
      'Pick the aged UID 1000XX profile when you want the longest account history.',
      'Run every new account through the free Live UID checker and set up 2FA with the free authenticator before first use.',
      'Warm up the browser session for 24 hours before changing credentials.',
    ],
    faqs: [
      { question: 'What is the difference between 2-line and 3-line accounts?', answer: 'These are catalogue tiers describing how thoroughly the profile was reinstated. 3-line is the strongest tier and is the usual choice for important admin roles, while 2-line is a cheaper option for supporting profiles.' },
      { question: 'What is included with each account?', answer: 'You receive the UID, password, 2FA secret, email and email password, a recovery email and cookies, so you can sign in directly or import the session into an anti-detect browser.' },
      { question: 'Can I change the password and email?', answer: 'Yes on password-changeable accounts. We recommend warming up the browser session for 24 hours first so you do not trigger sudden security checks.' },
      { question: 'Which country should I choose?', answer: 'Choose the country that matches your proxy location, payment method and target audience, so the login location and the account history stay consistent.' },
      { question: 'How do I get the 2FA code?', answer: 'Paste the 2FA secret into our free 2FA code generator to get a live six-digit code that refreshes every 30 seconds.' },
    ],
  },
  {
    slug: 'tiktok-account',
    category: 'tiktok-account',
    name: 'TikTok Ads Accounts',
    h1: 'Buy TikTok Ads Account (Verified, Manual Payment)',
    metaTitle: 'Buy TikTok Ads Account - Verified Business, Manual Payment',
    metaDescription:
      'Buy a verified TikTok Ads Business Center account with manual (prepaid) payment. Top up by card or crypto with no postpay debt risk. Instant access, 24-hour guarantee.',
    keywords: ['buy tiktok ads account', 'tiktok agency account', 'tiktok ads manual payment', 'tiktok business center', 'verified tiktok ads account', 'tiktok prepaid ads account'],
    intro: [
      'TikTok Ads accounts come in two billing modes. Manual payment is prepaid: you add funds first and your ads spend from that balance. Automatic payment bills after spend, which can lead to debt and suspensions if a card fails. Our TikTok listing is a verified Business Center account with manual payment already enabled, so you control exactly how much is at risk.',
      'It suits e-commerce, app-install and lead-generation advertisers who want to launch In-Feed and Spark Ads quickly, and agencies that keep each client in a separate advertising account. Access is delivered as email, password, backup 2FA and the login portal, with the 24-hour replacement guarantee.',
    ],
    chooseTitle: 'Things to know before you launch',
    choose: [
      'Top up in small amounts first to confirm payment works before committing a large budget.',
      'Keep creatives within TikTok advertising policies; account health depends on your ads as much as on the account.',
      'Use a consistent browser profile and a proxy that matches the account country.',
      'Keep TikTok assets separate from your Meta Business Manager so a problem on one platform never affects the other.',
    ],
    faqs: [
      { question: 'What does manual payment mean on TikTok Ads?', answer: 'Manual payment is a prepaid mode. You deposit funds and ads spend from the balance, so there is no automatic charge and no debt-related suspension.' },
      { question: 'How can I top up the balance?', answer: 'Funds can be added with a card, a virtual card or other supported methods that TikTok accepts in the account country.' },
      { question: 'Which country is the account from?', answer: 'The current listing is a verified USA TikTok Ads Business Center account. Check the product page for the country and stock before ordering.' },
      { question: 'What if I cannot log in?', answer: 'Contact the Telegram support desk within 24 hours of delivery. Login problems that are not caused by policy violations are replaced under the guarantee.' },
    ],
  },
  {
    slug: 'high-limit-bm',
    category: 'special-item',
    name: 'High-Limit Business Managers',
    h1: 'Buy Facebook BM2500 - High-Limit Business Manager',
    metaTitle: 'Buy Facebook BM2500 - $2,500 Daily Limit Business Manager',
    metaDescription:
      'Buy a Facebook BM2500 high-limit Business Manager with a $2,500 daily spend ceiling from day one. Docs verified, pixel shareable, instant invite, 24-hour guarantee.',
    keywords: ['buy facebook bm2500', 'bm2500', 'high limit business manager', '$2500 daily limit facebook', 'enterprise business manager', 'agency high limit bm'],
    intro: [
      'The BM2500 is named for its $2,500 daily spending limit. A standard new Business Manager often begins at around $50 per ad account and climbs slowly, which can cost weeks during a seasonal push. The BM2500 removes that early bottleneck so winning ad sets can scale on day one.',
      'It is built for agencies, media buyers and enterprise advertisers running high-volume e-commerce or lead-generation funnels, and for teams that want to share a pixel across several domains. Delivery includes a primary admin invite, backup admin access and documents, covered by the 24-hour replacement guarantee. Stock is limited, so check availability on the product page.',
    ],
    chooseTitle: 'Getting the most from a high-limit Business Manager',
    choose: [
      'Accept the invite on an aged 2-line or 3-line reinstated profile, never on a fresh account.',
      'Add a backup administrator immediately so one restricted profile never locks you out.',
      'Add a payment method that matches the Business Manager region.',
      'Start with a moderate budget of $100-$300 per day, then scale as performance and billing history stabilise.',
    ],
    faqs: [
      { question: 'Why is a BM2500 priced higher than other Business Managers?', answer: 'You are paying for the $2,500 daily spend ceiling and the documents behind it. For large budgets this saves the weeks a standard Business Manager needs to earn higher limits.' },
      { question: 'Do I have to spend $2,500 a day?', answer: 'No. It is a ceiling, not a minimum. We still recommend starting at $100-$300 per day and scaling up gradually.' },
      { question: 'How is it delivered?', answer: 'You receive a primary admin invite link, backup admin access and the supporting documents, after your crypto payment is confirmed.' },
      { question: 'Is there a guarantee?', answer: 'Yes, the standard 24-hour replacement guarantee applies from delivery. Report any access problem on Telegram within that window.' },
    ],
  },
];

export function getCategoryPage(slug: string) {
  return CATEGORY_PAGES.find(c => c.slug === slug);
}

export function categoryPathFor(category: ProductCategory) {
  const page = CATEGORY_PAGES.find(c => c.category === category);
  return page ? `/category/${page.slug}` : '/shop';
}
