import Link from 'next/link';

const CATEGORY_GUIDE = [
  { id: 'business-manager', name: 'Business Managers', text: 'BM0 to BM10 assets with one or more ad account slots. Choose a BM3 for testing, a BM5 or BM10 for agency work and hold pages.' },
  { id: 'verified-bm', name: 'Verified Business Managers', text: 'Documents-verified Business Managers with higher trust in ad review and a spending limit that expands with spend.' },
  { id: 'facebook-account', name: 'Reinstated Facebook Accounts', text: '2-line and 3-line reinstated profiles by country, delivered with full 2FA, CP mail and cookies for use as admin profiles.' },
  { id: 'tiktok-account', name: 'TikTok Ads Accounts', text: 'Verified TikTok Business Center accounts with manual prepaid payment, so there is no postpay billing debt.' },
  { id: 'special-item', name: 'High-Limit Items', text: 'The BM2500 Business Manager with a $2,500 daily spend limit for fast scaling from day one.' },
];

export function ShopSeoContent() {
  return (
    <section className="mt-16 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm p-6 sm:p-10 space-y-6 text-sm text-[#475569] leading-relaxed">
      <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">
        How to choose a Facebook Business Manager or ad account
      </h2>
      <p>
        Start with how many ad accounts you need and how fast you plan to spend. A restored BM3 suits creative testing,
        a BM5 or BM10 suits agencies sharing pixels and Pages across clients, and a BM2500 suits large budgets from day
        one. Pair any Business Manager with an aged 2-line or 3-line reinstated profile as the admin, and always add a
        backup administrator after accepting the invite.
      </p>
      <div className="space-y-4">
        {CATEGORY_GUIDE.map(cat => (
          <div key={cat.id} className="space-y-1">
            <h3 className="font-bold text-[#0F172A]">
              <Link href={`/category/${cat.id === 'special-item' ? 'high-limit-bm' : cat.id}`} className="hover:text-[#D97706]">{cat.name}</Link>
            </h3>
            <p>{cat.text}</p>
          </div>
        ))}
      </div>
      <p>
        All products include the 24-hour replacement guarantee. Check delivered profiles with the{' '}
        <Link href="/live-uid-checker" className="font-bold text-[#D97706] hover:underline">Live UID checker</Link> and read
        the <Link href="/replace-rules" className="font-bold text-[#D97706] hover:underline">replacement rules</Link> for what
        is covered.
      </p>
    </section>
  );
}
