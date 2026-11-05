import type { Product, BlogPost } from '@/types';
import { truncate } from '@/lib/seo';

// SEO copy for products and posts. Every value can be overridden per item from the admin
// (metaTitle / metaDescription / keywords); the tables below are the curated defaults for the
// catalogue, and the generators cover anything added later so a new product never ships
// with a duplicate or empty title and description.

export type Faq = { question: string; answer: string };

export function toKeywordList(value?: string | string[]): string[] {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.split(',');
  return list.map(k => k.trim()).filter(Boolean);
}

function unique(list: string[]) {
  return Array.from(new Set(list.map(k => k.toLowerCase()))).map(
    k => list.find(o => o.toLowerCase() === k) as string
  );
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

type Curated = { title: string; description: string; keywords: string[] };

const CURATED: Record<string, Curated> = {
  'bm-2500': {
    title: 'Buy Facebook BM2500 - $2,500 Daily Limit Business Manager',
    description:
      'Buy a Facebook BM2500 Business Manager with a $2,500 daily spend limit, docs verified and pixel shareable. Admin invite delivered instantly, 24-hour guarantee.',
    keywords: ['buy facebook bm2500', 'bm2500 business manager', '$2500 limit business manager', 'high limit facebook bm', 'verified meta business manager', 'facebook ads agency account', 'buy bm2500 with crypto'],
  },
  'bm3-50': {
    title: 'Buy BM3 Restored Business Manager - $50 Limit, 3 Ad Accounts',
    description:
      'Buy a restored BM3 Facebook Business Manager with 3 ready ad accounts and a $50 daily limit. Pixel and page shareable, instant invite, 24-hour guarantee.',
    keywords: ['buy bm3 business manager', 'restored business manager', 'facebook bm3 $50 limit', 'bm with 3 ad accounts', 'cheap facebook business manager', 'meta business manager for sale'],
  },
  'bm3-250': {
    title: 'Buy BM3 $250 Limit Reinstated Business Manager (2025)',
    description:
      'Buy a reinstated BM3 Business Manager created in 2025 with 3 ad accounts and a $250 daily limit. Admin invite, backup link and setup guide, 24-hour guarantee.',
    keywords: ['buy bm3 250 limit', 'reinstated business manager', 'facebook bm $250 limit', 'bm3 3 ad accounts', 'business manager 2025 created', 'scale facebook ads bm'],
  },
  'bm0-bm1-old': {
    title: 'Buy Aged BM0 / BM1 Reinstated Business Manager (2021-2022)',
    description:
      'Buy an aged BM0 / BM1 reinstated Business Manager created in 2021-2022 with a $50 limit. Older asset history for stability, instant invite, 24-hour guarantee.',
    keywords: ['aged business manager', 'old facebook business manager', 'bm1 reinstated', 'bm0 business manager', 'business manager 2021 2022', 'buy old bm facebook'],
  },
  'bm-hold-agency': {
    title: 'Reinstated Business Manager for Hold Agency Ads & Pages',
    description:
      'Buy a reinstated Business Manager for holding agency ad accounts, client Pages and shared pixels. Cannot create ad accounts. Instant invite, 24-hour guarantee.',
    keywords: ['hold bm facebook', 'business manager to hold pages', 'agency ads account holder', 'share pixel business manager', 'partner share business manager', 'cheap reinstated bm'],
  },
  'bm1-250-payup': {
    title: 'Buy BM1 $250 Limit Reinstated Business Manager (Pay-up BM3)',
    description:
      'Buy a reinstated BM1 Business Manager with a $250 limit that upgrades to a BM3 once billing thresholds are met. Created 2025, instant invite, 24-hour guarantee.',
    keywords: ['buy bm1 250 limit', 'bm1 to bm3 upgrade', 'pay up bm3', 'reinstated bm1 business manager', 'facebook bm $250 spending limit', 'business manager billing threshold'],
  },
  'bm5-super-strong': {
    title: 'Buy BM5 Business Manager - Hold Page, Pixel & Agency Share',
    description:
      'Buy a strong BM5 Business Manager with 5 ad account slots for page hosting, pixel sharing and agency ad accounts. Instant invite and a 24-hour guarantee.',
    keywords: ['buy bm5 facebook', 'bm5 business manager', 'bm5 hold page pixel share', 'facebook bm 5 ad accounts', 'agency ad account bm5', 'multi ad account business manager'],
  },
  'bm10-250-verified': {
    title: 'Buy BM10 $250 Verified Business Manager - 10 Ad Accounts',
    description:
      'Buy a verified BM10 Business Manager with 10 ad accounts at a $250 limit each and changeable billing. Built for agencies scaling campaigns, 24-hour guarantee.',
    keywords: ['buy bm10 facebook', 'bm10 verified business manager', '10 ad accounts business manager', 'verified bm $250 limit', 'agency business manager', 'changeable billing business manager'],
  },
  'bm3-docs-verified-usa': {
    title: 'Buy USA Docs Verified BM3 Business Manager - $50 Limit',
    description:
      'Buy a US documents-verified BM3 Business Manager with 3 ad accounts and a $50 limit that expands with spend. Higher trust in ad review, 24-hour guarantee.',
    keywords: ['verified business manager usa', 'docs verified bm3', 'us business verification facebook', 'buy verified bm usa', 'bm3 usa $50 limit', 'meta business verification account'],
  },
  'bm3-docs-verified-usa-4ads': {
    title: 'Buy USA Docs Verified BM3 - 4 Ad Accounts Ready, $50 Limit',
    description:
      'Buy a US documents-verified BM3 Business Manager with 4 ad accounts ready and a $50 limit. Expanded setup for testing more creatives, 24-hour guarantee.',
    keywords: ['verified business manager 4 ad accounts', 'usa docs verified bm', 'bm3 4 ads ready', 'verified bm usa $50', 'buy meta business manager usa', 'business manager 4 ad accounts'],
  },
  'tiktok-usa-manual': {
    title: 'Buy TikTok Ads Account USA - Verified, Manual Payment',
    description:
      'Buy a verified USA TikTok Ads account with manual (prepaid) payment. Top up by card or crypto, no postpay debt. Instant login, 24-hour guarantee.',
    keywords: ['buy tiktok ads account', 'tiktok ads manual payment', 'tiktok business center usa', 'verified tiktok ads account', 'tiktok agency account', 'tiktok ads prepaid account'],
  },
  'acc-2line-random': {
    title: 'Buy 2-Line Reinstated Facebook Account - Live Ads, Full 2FA',
    description:
      'Buy a 2-line reinstated Facebook account with live ads access, full 2FA, CP mail and cookies. Admin profile for Business Managers, $9, 24-hour guarantee.',
    keywords: ['buy 2 line facebook account', '2 line reinstated account', 'facebook account with 2fa', 'facebook account cp mail', 'live ads facebook account', 'reinstated facebook profile'],
  },
  'acc-3line-1000xx': {
    title: 'Buy 3-Line Reinstated Facebook Account - UID 1000XX, Aged',
    description:
      'Buy an aged 3-line reinstated Facebook account on a vintage 1000XX UID with full 2FA, CP mail and a changeable password. Safe admin profile, 24-hour guarantee.',
    keywords: ['buy 3 line facebook account', '1000xx facebook account', 'old uid facebook account', 'aged facebook account', '3 line reinstated account', 'password changeable facebook account'],
  },
};

const COUNTRY_NOTES: Record<string, string> = {
  'United States': 'US stock suits campaigns billed in USD and targeting American audiences. Pair the profile with a US residential proxy and a US-timezone browser profile so the login location matches the account history.',
  'United Kingdom': 'UK stock fits campaigns billed in GBP or targeting the United Kingdom and wider Europe. Use a UK residential proxy, a GMT/BST timezone and English (UK) language settings in your browser profile.',
  Bangladesh: 'Bangladesh stock is popular with media buyers running South Asian traffic and lower-cost lead generation. Match it with a Bangladesh or nearby residential proxy and the Asia/Dhaka timezone.',
  Australia: 'Australian stock suits Oceania campaigns billed in AUD. Use an Australian residential proxy and an AEST/AEDT timezone profile; campaign hours differ sharply from US and EU schedules, so plan daily budgets accordingly.',
  Germany: 'German stock fits DACH and wider EU campaigns billed in EUR. Use a German residential proxy, the Europe/Berlin timezone and German or English interface language, and keep creatives compliant with EU advertising rules.',
  France: 'French stock suits French-speaking markets and EU campaigns billed in EUR. Use a French residential proxy, the Europe/Paris timezone and French language settings for a consistent fingerprint.',
  'Hong Kong': 'Hong Kong stock is used for APAC e-commerce and drop shipping campaigns. Use a Hong Kong residential proxy and the Asia/Hong_Kong timezone, and expect different ad review timing than Western markets.',
  Algeria: 'Algerian stock suits North African and French/Arabic-language campaigns. Use an Algeria-region residential proxy and keep browser language and timezone consistent with the account location.',
  Cameroon: 'Cameroon stock is an older, aged profile suited to Central and West African campaigns. Keep proxy location, language and timezone consistent with the account when you first log in.',
  Poland: 'Polish stock fits Central European campaigns billed in PLN or EUR. Use a Polish residential proxy and the Europe/Warsaw timezone with Polish or English interface settings.',
  Spain: 'Spanish stock, with historical account age, suits Spain and Spanish-language markets. Use a Spanish residential proxy, the Europe/Madrid timezone and Spanish language settings.',
  Cambodia: 'Cambodian stock is common for Southeast Asian traffic and international e-commerce tests. Use a regional residential proxy and the Asia/Phnom_Penh timezone for a consistent login pattern.',
  Pakistan: 'Pakistan stock fits South Asian campaigns and regional lead generation. Use a Pakistan-region residential proxy and the Asia/Karachi timezone with matching language settings.',
};

function kindOf(p: Product): 'facebook' | 'tiktok' | 'verified' | 'special' | 'bm' {
  switch (p.category) {
    case 'facebook-account': return 'facebook';
    case 'tiktok-account': return 'tiktok';
    case 'verified-bm': return 'verified';
    case 'special-item': return 'special';
    default: return 'bm';
  }
}

function hasRealCountry(p: Product) {
  return Boolean(p.country) && !/random|global/i.test(p.country as string);
}

export function getProductMeta(p: Product) {
  const curated = CURATED[p.id];
  const kind = kindOf(p);
  const geo = hasRealCountry(p) ? (p.country as string) : '';

  let generatedTitle: string;
  let generatedDescription: string;
  let generatedKeywords: string[];

  if (kind === 'facebook' && geo) {
    const lines = p.lines && p.lines !== 'n/a' ? `${p.lines.replace('-line', '-Line')} ` : '';
    generatedTitle = `Buy ${lines}Reinstated Facebook Account - ${geo} Stock`;
    generatedDescription = `Buy a ${p.lines && p.lines !== 'n/a' ? `${p.lines} ` : ''}reinstated ${geo} Facebook account with live ads access, full 2FA and CP mail. $${p.price}, instant delivery, 24-hour replacement guarantee.`;
    generatedKeywords = [
      `buy ${geo.toLowerCase()} facebook account`,
      `${geo.toLowerCase()} facebook ads account`,
      `${p.lines || '3-line'} reinstated facebook account`,
      'facebook account with 2fa and cp mail',
      'live ads facebook account',
      'reinstated facebook profile',
      'facebook admin profile for business manager',
    ];
  } else {
    generatedTitle = truncate(p.title.replace(/\s*\|\s*/g, ' - '), 58);
    generatedDescription = truncate(`${p.description} ${p.guarantee}. Instant electronic delivery.`, 155);
    generatedKeywords = [`buy ${p.title.split(/[-|–]/)[0].trim().toLowerCase()}`, 'facebook business manager', 'meta advertising account', 'instant delivery', '24 hour replacement guarantee'];
  }

  const title = p.metaTitle?.trim() || curated?.title || generatedTitle;
  const description = p.metaDescription?.trim() || curated?.description || generatedDescription;
  const keywords = unique([
    ...toKeywordList(p.keywords),
    ...(curated?.keywords ?? generatedKeywords),
    'bm4u',
  ]);

  return { title, description, keywords };
}

function shortName(p: Product) {
  const first = p.title.split(/\s[|–-]\s/)[0].trim();
  return first.length >= 12 ? first : p.title;
}

export function getProductContent(p: Product) {
  const kind = kindOf(p);
  const name = shortName(p);
  const price = `$${p.price.toLocaleString()}`;
  const geo = hasRealCountry(p) ? (p.country as string) : '';
  const stock = p.stock > 0 ? `${p.stock} in stock right now` : 'currently out of stock';

  const intro: string[] = [];
  const useCases: string[] = [];
  const steps: string[] = [];
  const faqs: Faq[] = [];

  const commonSteps = [
    'Add the product to your cart and pay in BTC, ETH, USDT or SOL; send the TXID if the gateway asks for it.',
    'Receive your delivery details electronically as soon as the payment is confirmed.',
    'Check the credentials right away with the free Live UID Checker and report any problem on Telegram inside the 24-hour guarantee window.',
  ];

  if (kind === 'facebook') {
    intro.push(
      `This ${p.lines && p.lines !== 'n/a' ? `${p.lines} ` : ''}reinstated Facebook personal profile${geo ? ` (${geo} stock)` : ''} is delivered with the full login kit: ${p.format}. A reinstated profile has already been through Meta's identity re-verification, which is why advertisers use it as the admin profile for a Business Manager, ad account or Page instead of risking a brand-new account.`,
      `The price is ${price} and it is ${stock}. Every profile carries our ${p.guarantee.toLowerCase()}, so you can test the login, the 2FA key and the CP mail before you rely on it for campaigns.`
    );
    useCases.push(
      'Admin profile for a Business Manager invite such as a BM3, BM5 or BM2500.',
      'Running ads from a personal profile that already has live ads access.',
      'Holding Pages, pixels and agency ad accounts as a backup administrator.',
      'Importing cookies into an anti-detect browser such as AdsPower, Dolphin{anty} or Multilogin.'
    );
    steps.push(...commonSteps.slice(0, 2), 'Import the cookies or log in from a clean browser profile with a matching residential proxy, then generate your 2FA code with the free 2FA Authenticator.', commonSteps[2]);
    faqs.push(
      { question: 'What is a reinstated Facebook account?', answer: 'A reinstated account is a personal profile that was restricted at some point and then restored after identity confirmation. It keeps its account age and trust history, which makes it a stronger admin profile than a freshly created one.' },
      { question: 'Can I change the password and email?', answer: 'Yes, on password-changeable accounts. We recommend warming up the browser session for 24 hours before updating primary credentials, to avoid triggering sudden security checks.' }
    );
  } else if (kind === 'tiktok') {
    intro.push(
      `${name} is a TikTok Ads Business Center account${geo ? ` for the ${geo} market` : ''} with manual payment enabled, delivered as ${p.format}. Manual (prepaid) payment means you top up the balance yourself, so there is no automatic postpay billing and no sudden debt suspension.`,
      `It costs ${price} and is ${stock}. You can fund it with a card, PayPal-style virtual card or crypto-funded card, and the ${p.guarantee.toLowerCase()} applies from the moment of delivery.`
    );
    useCases.push(
      'Launching TikTok In-Feed and Spark Ads without waiting for a new Business Center to age.',
      'Running e-commerce, app install and lead-generation tests with a prepaid budget.',
      'Keeping TikTok spend separate from your Meta Business Manager assets.',
      'Agency work where each client needs an isolated advertising account.'
    );
    steps.push(...commonSteps.slice(0, 2), 'Sign in with the delivered credentials, confirm the Business Center and ad account status, then add a payment method and top up the balance.', 'Report any login or access problem on Telegram within 24 hours of delivery.');
    faqs.push(
      { question: 'What does manual payment mean on TikTok Ads?', answer: 'Manual payment is a prepaid mode: you add funds first and ads spend from that balance. It avoids postpay billing thresholds, so there is no automatic charge and no debt-related account suspension.' }
    );
  } else if (kind === 'verified') {
    intro.push(
      `${name} is a ${geo ? `${geo} ` : ''}Business Manager that has been verified with company documents in Meta Business Settings, delivered as ${p.format}. Business verification raises the trust score of the whole Business Manager, which helps with ad review, creative approvals and the spending limit expanding as you spend.`,
      `Priced at ${price}, it is ${stock}, backed by our ${p.guarantee.toLowerCase()}.`
    );
    useCases.push(
      'Ecommerce and lead-generation brands that want fewer creative rejections.',
      'Advertisers who need to share pixels and Pages with clients and partners.',
      'Scaling a proven offer on a Business Manager with documented identity.',
      'Agencies that want a stable, verified base account with extra ad account slots.'
    );
    steps.push(...commonSteps.slice(0, 2), 'Accept the admin invite from an aged 2-line or 3-line reinstated profile and immediately add a backup administrator.', 'Add a payment method that matches the Business Manager country, then start with a moderate daily budget.');
    faqs.push(
      { question: 'What does docs verified mean for a Business Manager?', answer: 'It means business verification was completed with supporting documents in Meta Business Settings. Verified Business Managers generally see higher trust in ad review than unverified ones, though results still depend on your creatives and billing.' }
    );
  } else if (kind === 'special') {
    intro.push(
      `${name} is our top-tier Business Manager with a ${p.limit || '$2,500 daily'} spend ceiling from day one. It is built for agencies, media buyers and enterprise advertisers who cannot wait weeks for automatic limit increases.`,
      `It is priced at ${price}, ${stock}, and ships with an admin invite link, backup access and documents under our ${p.guarantee.toLowerCase()}.`
    );
    useCases.push(
      'Seasonal pushes such as Black Friday and Cyber Monday that need fast budget scaling.',
      'Agencies running many client campaigns from one high-limit Business Manager.',
      'High-volume lead generation and e-commerce funnels with large daily budgets.',
      'Teams that want pixel sharing across several domains from a stable asset.'
    );
    steps.push(...commonSteps.slice(0, 2), 'Accept the invitation on an aged 2-line or 3-line reinstated profile, then add a backup administrator straight away.', 'Add a verified payment method matching the Business Manager region and begin at $100-$300 per day before scaling up.');
    faqs.push(
      { question: 'Why choose a BM2500 over a standard Business Manager?', answer: 'A standard new Business Manager usually starts with a $50 daily cap per ad account and raises it slowly as billing history builds. A BM2500 starts with a $2,500 daily ceiling, so winning ad sets can scale immediately.' }
    );
  } else {
    intro.push(
      `${name} is a Meta Business Manager${p.limit ? ` with a ${p.limit} configuration` : ''}, delivered as ${p.format}. ${p.description}`,
      `It is priced at ${price} and is ${stock}, covered by our ${p.guarantee.toLowerCase()}.`
    );
    useCases.push(
      'Starting new campaigns on a Business Manager with an existing ad account structure.',
      'Hosting Pages, pixels and shared agency ad accounts in one place.',
      'Isolating clients or offers across separate ad accounts to reduce risk.',
      'Testing creatives and audiences before moving budget to a higher-limit Business Manager.'
    );
    steps.push(...commonSteps.slice(0, 2), 'Accept the admin invite from an aged 2-line or 3-line reinstated profile, then add a backup administrator before doing anything else.', 'Add a payment method that matches the Business Manager country and keep the first days of spend moderate.');
    faqs.push(
      { question: 'What does the spending limit mean?', answer: `${p.limit ? `This Business Manager is listed at ${p.limit}. ` : ''}The spending limit is the daily ad spend cap per ad account. Meta raises it automatically as your account builds a clean billing history.` }
    );
  }

  faqs.unshift({
    question: `How much does ${name} cost and how do I pay?`,
    answer: `${name} costs ${price}${p.originalPrice ? ` (regular price ${'$' + p.originalPrice.toLocaleString()})` : ''} and is ${stock}. We accept cryptocurrency (BTC, ETH, USDT, SOL) with QR code and TXID verification.`,
  });
  faqs.push(
    { question: 'How fast is delivery and what if something does not work?', answer: `Delivery is electronic and starts as soon as payment is confirmed. If a credential, 2FA key or login does not work, contact our Telegram support desk within the 24-hour guarantee window and we will replace it. See the replacement rules for what is covered.` }
  );

  const countryNote = geo ? COUNTRY_NOTES[geo] : undefined;

  return { name, intro, useCases, steps, faqs, countryNote, geo };
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

const POST_CURATED: Record<string, Curated> = {
  'buy-facebook-bm2500-premium-meta-business-manager': {
    title: 'BM2500 Guide: How to Receive & Secure a $2,500 Limit BM',
    description:
      'How to accept a Facebook BM2500 invitation, add backup admins, set payment methods and warm up a $2,500 daily limit Business Manager without triggering reviews.',
    keywords: ['bm2500 guide', 'facebook bm2500', 'high limit business manager', 'how to secure business manager', 'add backup admin', 'business manager warm up', 'meta ads scaling'],
  },
  'how-to-add-backup-admin-into-facebook-business-manager': {
    title: 'How to Add a Backup Admin to Facebook Business Manager',
    description:
      'Step-by-step: add a backup admin with Full Control in Meta Business Settings so a restricted profile never locks you out of ad accounts, Pages or pixels.',
    keywords: ['add backup admin facebook business manager', 'business manager admin access', 'meta business settings', 'secure business manager', 'facebook business manager lockout', 'invite admin business manager'],
  },
  'what-is-bm5-business-manager-and-how-does-it-work': {
    title: 'What Is a BM5 Business Manager? How It Works & Why Use One',
    description:
      'A BM5 Business Manager can hold up to 5 ad accounts. Learn how BM5 works, its risk isolation, pixel sharing, hold-page use and best practices.',
    keywords: ['what is bm5', 'bm5 business manager', 'bm5 vs bm3', 'facebook bm 5 ad accounts', 'hold page business manager', 'pixel sharing business manager', 'agency ad accounts'],
  },
  'how-to-use-bm3-business-manager': {
    title: 'How to Use a BM3 Business Manager: Setup & First 7 Days',
    description:
      'A practical BM3 Business Manager guide: secure admin access, structure your three ad accounts, connect assets and plan a safe first week of ad spend.',
    keywords: ['how to use bm3', 'bm3 business manager', 'bm3 setup guide', 'business manager 3 ad accounts', 'facebook business manager setup', 'first week ad spend'],
  },
  'reinstated-vs-verified-business-manager': {
    title: 'Reinstated vs Verified Business Manager: Which to Choose?',
    description:
      'Reinstated and verified Business Managers solve different problems. Compare trust, cost, risk and best use cases to pick the right one for your campaigns.',
    keywords: ['reinstated vs verified business manager', 'reinstated business manager', 'verified business manager', 'business verification meta', 'which business manager to buy'],
  },
  'how-to-increase-business-manager-spending-limit': {
    title: 'How to Increase Business Manager Ad Spending Limit Safely',
    description:
      'Spending limits rise with account history. Learn what influences the limit, how to build a clean billing record and when a higher-limit Business Manager is better.',
    keywords: ['increase ad spending limit', 'facebook ads daily limit', 'business manager spending limit', 'raise facebook ad limit', 'bm2500 vs bm3', 'billing threshold'],
  },
  'facebook-ad-account-restricted-how-to-fix': {
    title: 'Facebook Ad Account Restricted? Causes, Appeals & Prevention',
    description:
      'A restricted ad account is often recoverable. Learn the common causes, how to read the notice, appeal properly and prevent repeat restrictions on Meta.',
    keywords: ['facebook ad account restricted', 'fix restricted ad account', 'facebook ads appeal', 'account quality meta', 'ad account disabled', 'business manager restricted'],
  },
  'tiktok-agency-ad-account-guide': {
    title: 'TikTok Agency Ad Account: What It Is & Manual Payment Explained',
    description:
      'Understand TikTok Business Center, agency ad accounts and manual versus automatic payment, then launch your first prepaid TikTok Ads campaign safely.',
    keywords: ['tiktok agency account', 'tiktok ads manual payment', 'tiktok business center', 'tiktok prepaid ads', 'tiktok ads account guide'],
  },
  'bm5-vs-bm3-business-manager': {
    title: 'BM5 vs BM3 Business Manager: Differences & Which to Buy',
    description:
      'BM3 and BM5 differ mainly in ad account capacity. Compare cost, risk isolation and ideal use cases to choose the right Business Manager for your setup.',
    keywords: ['bm5 vs bm3', 'bm3 vs bm5', 'bm5 business manager', 'bm3 business manager', 'which business manager to buy', 'business manager comparison'],
  },
};

export function getPostMeta(post: BlogPost) {
  const curated = POST_CURATED[post.slug];
  const title = post.metaTitle?.trim() || curated?.title || truncate(post.title, 60);
  const description =
    post.metaDescription?.trim() || curated?.description || truncate(post.excerpt || post.content[0] || post.title);
  const keywords = unique([
    ...toKeywordList(post.keywords),
    ...(curated?.keywords ?? [post.title.toLowerCase(), 'facebook business manager guide', 'meta ads tips']),
    'bm4u',
  ]);
  return { title, description, keywords };
}

// ---------------------------------------------------------------------------
// Cross-linking helpers (products <-> guides)
// ---------------------------------------------------------------------------

const STOP = new Set(['the', 'and', 'for', 'with', 'how', 'what', 'buy', 'into', 'your', 'from', 'that', 'this', 'are', 'its', 'can', 'does', 'work', 'ads', 'account', 'accounts', 'facebook', 'meta', 'limit', 'ready']);

function tokens(text: string) {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(t => t.length > 2 && !STOP.has(t))
  );
}

function overlap(a: Set<string>, b: Set<string>) {
  let n = 0;
  a.forEach(t => { if (b.has(t)) n++; });
  return n;
}

export function relatedPostsFor(subject: string, posts: BlogPost[], excludeSlug?: string, limit = 3) {
  const subj = tokens(subject);
  return posts
    .filter(p => p.slug !== excludeSlug)
    .map(p => ({ p, score: overlap(subj, tokens(`${p.title} ${p.excerpt}`)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.p);
}

export function relatedProductsForPost(post: BlogPost, products: Product[], limit = 3) {
  const subj = tokens(`${post.title} ${post.excerpt}`);
  const scored = products
    .map(p => ({ p, score: overlap(subj, tokens(`${p.title} ${p.limit || ''}`)) + (p.isPopular ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.p);
}

export const SITE_FAQS: Faq[] = [
  { question: 'What is a Facebook Business Manager and why buy a ready one?', answer: 'A Business Manager (BM) is the Meta account that holds your ad accounts, Pages and pixels. A ready BM, such as a BM3, BM5 or BM2500, skips the slow early phase of low spending limits and gives you a ready-made structure for ad accounts and agency sharing.' },
  { question: 'What is the difference between BM3, BM5, BM10 and BM2500?', answer: 'The number is roughly how many ad accounts the Business Manager can hold or create, so a BM3 holds 3, a BM5 holds 5 and a BM10 holds 10. A BM2500 is named for its $2,500 daily spend limit rather than its ad account count.' },
  { question: 'What are 2-line and 3-line reinstated Facebook accounts?', answer: 'Reinstated accounts are personal profiles restored after identity confirmation. In our catalogue, 3-line profiles are the strongest tier of reinstatement and are used as admin profiles for Business Managers and Pages; 2-line profiles are a lower-cost option.' },
  { question: 'How does the 24-hour guarantee work?', answer: 'Every asset is covered for 24 hours from delivery. If a login, 2FA key or invite does not work, report it on Telegram inside that window and we replace it. Problems caused by policy violations or by changing credentials without a warm-up are not covered.' },
  { question: 'Which payment methods do you accept?', answer: 'We accept cryptocurrency: Bitcoin (BTC), Ethereum (ETH), USDT and Solana (SOL). Each order shows a QR code and wallet address, and payment is confirmed with the transaction ID.' },
  { question: 'How fast will I receive my order?', answer: 'Delivery is electronic and starts after your payment is confirmed. Our Telegram support desk (@bybm4u) is available seven days a week if you need help.' },
];
