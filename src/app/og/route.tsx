import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { getProductBySlug, getPostBySlug } from '@/lib/content';

// Branded 1200x630 social card. Text comes from our own catalogue (by slug) or a fixed page
// list - never from the query string - so this endpoint can't be used to render arbitrary text.

const PAGES: Record<string, { badge: string; title: string; sub: string }> = {
  default: { badge: 'Meta & TikTok Ad Assets', title: 'Buy Facebook Business Manager & Reinstated Ad Accounts', sub: 'Instant delivery - 24-hour replacement guarantee' },
  shop: { badge: 'Store Catalog', title: 'Business Managers, Ad Accounts & TikTok Accounts', sub: 'BM3 - BM5 - BM10 - BM2500 - Reinstated profiles' },
  tips: { badge: 'Guides', title: 'Meta Ads Tips & Business Manager Guides', sub: 'Setup, security and scaling playbooks' },
  'fb-2fa': { badge: 'Free Tool', title: 'Free Facebook 2FA Code Generator', sub: 'Live 30-second TOTP codes - private, in your browser' },
  'live-uid-checker': { badge: 'Free Tool', title: 'Facebook Live UID Checker', sub: 'Check live or die profiles in bulk' },
  'replace-rules': { badge: 'Guarantee', title: 'Replacement Policy & 24-Hour Guarantee', sub: 'What is covered and how to claim' },
  terms: { badge: 'Legal', title: 'Terms of Service', sub: 'Delivery, payment and the 24-hour guarantee' },
  privacy: { badge: 'Legal', title: 'Privacy Policy', sub: 'What we collect and why' },
  'refund-policy': { badge: 'Guarantee', title: 'Refund & Replacement Policy', sub: 'What the 24-hour guarantee covers' },
  'about-us': { badge: 'About', title: 'Trusted Meta & TikTok Ad Account Supplier', sub: 'Telegram support desk, seven days a week' },
  'business-manager': { badge: 'Category', title: 'Buy Facebook Business Manager', sub: 'BM1 - BM3 - BM5 - BM10' },
  'verified-bm': { badge: 'Category', title: 'Buy Verified Facebook Business Manager', sub: 'Docs-verified - higher trust in ad review' },
  'facebook-account': { badge: 'Category', title: 'Buy Reinstated Facebook Accounts', sub: '2-line and 3-line - Full 2FA - CP mail' },
  'tiktok-account': { badge: 'Category', title: 'Buy TikTok Ads Account', sub: 'Verified - Manual payment' },
  'high-limit-bm': { badge: 'Category', title: 'Buy Facebook BM2500 High-Limit Business Manager', sub: '$2,500 daily spend limit' },
};

const clean = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

async function resolve(params: URLSearchParams) {
  const productSlug = params.get('product');
  if (productSlug) {
    const p = await getProductBySlug(productSlug);
    if (p) {
      const name = p.title.split(/\s[|–-]\s/)[0].trim();
      const bits = [p.country && !/random|global/i.test(p.country) ? p.country : '', p.limit || '', p.lines && p.lines !== 'n/a' ? p.lines : ''].filter(Boolean);
      return {
        badge: p.stock > 0 ? 'In Stock - Instant Delivery' : 'Out of Stock',
        title: clean(name.length >= 12 ? name : p.title, 80),
        sub: clean(bits.join(' - ') || '24-hour replacement guarantee', 70),
        price: `$${p.price.toLocaleString()}`,
      };
    }
  }
  const postSlug = params.get('post');
  if (postSlug) {
    const post = await getPostBySlug(postSlug);
    if (post) return { badge: post.category, title: clean(post.title, 90), sub: `${post.readTime} - BM 4 U Guides`, price: '' };
  }
  const page = PAGES[params.get('page') || 'default'] || PAGES.default;
  return { ...page, price: '' };
}

export async function GET(req: NextRequest) {
  const { badge, title, sub, price } = await resolve(req.nextUrl.searchParams);
  const size = title.length > 60 ? 54 : title.length > 36 ? 64 : 74;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #334155 100%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: -140, right: -120, width: 520, height: 520, borderRadius: 520, background: 'rgba(251,173,24,0.18)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -200, right: 120, width: 380, height: 380, borderRadius: 380, background: 'rgba(251,173,24,0.08)', display: 'flex' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#FBAD18', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900 }}>
              B
            </div>
            <div style={{ marginLeft: 16, fontSize: 34, fontWeight: 800, letterSpacing: -1, display: 'flex' }}>BM 4 U</div>
          </div>
          <div style={{ display: 'flex', padding: '10px 22px', borderRadius: 999, border: '2px solid rgba(251,173,24,0.7)', color: '#FBAD18', fontSize: 24, fontWeight: 700 }}>
            {badge}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 30, color: '#CBD5E1' }}>{sub}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 24, color: '#94A3B8' }}>bm4u.net - 24H Guarantee - Telegram Support</div>
          {price ? (
            <div style={{ display: 'flex', padding: '12px 32px', borderRadius: 18, background: '#FBAD18', color: '#0F172A', fontSize: 46, fontWeight: 900 }}>
              {price}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
    }
  );
}
