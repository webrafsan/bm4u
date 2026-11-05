import Link from 'next/link';
import { SITE_FAQS } from '@/lib/seoContent';

// Visible copy for the home page: category explainers (internal links + LSI terms) and the FAQ
// that backs the FAQPage schema. Kept server-side so it is in the initial HTML.
export function HomeSeoContent() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white border border-[#CBD5E1] shadow-sm p-6 sm:p-10 space-y-10 text-sm text-[#475569] leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Buy Facebook Business Managers and ad accounts for scaling Meta ads
          </h2>
          <p>
            BM 4 U supplies ready-to-use Meta advertising assets for media buyers, affiliates and agencies: Facebook
            Business Managers, verified Business Managers, reinstated personal profiles and TikTok Ads accounts. Every
            order is delivered electronically after payment is confirmed and is backed by a 24-hour replacement
            guarantee, with a Telegram support desk open seven days a week.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">What you can buy</h2>
          <div className="space-y-3">
            <p>
              <Link href="/category/business-manager" className="font-bold text-[#D97706] hover:underline">Business Managers</Link>{' '}
              range from restored BM3 and reinstated BM1 assets to BM5 and BM10 setups with several ad account slots for
              hold pages, pixel sharing and agency ad accounts.
            </p>
            <p>
              <Link href="/category/verified-bm" className="font-bold text-[#D97706] hover:underline">Verified Business Managers</Link>{' '}
              are completed with company documents in Meta Business Settings, which helps with ad review and lets the
              daily spending limit expand as you spend.
            </p>
            <p>
              The flagship{' '}
              <Link href="/product/facebook-bm2500-business-manager" className="font-bold text-[#D97706] hover:underline">BM2500</Link>{' '}
              starts with a $2,500 daily limit for advertisers who cannot wait for automatic limit increases.
            </p>
            <p>
              <Link href="/category/facebook-account" className="font-bold text-[#D97706] hover:underline">Reinstated Facebook accounts</Link>{' '}
              in 2-line and 3-line tiers come with full 2FA, CP mail and cookies for anti-detect browsers, in stock for
              the USA, UK, Germany, France, Australia and more.
            </p>
            <p>
              <Link href="/category/tiktok-account" className="font-bold text-[#D97706] hover:underline">TikTok Ads accounts</Link>{' '}
              with manual payment let you run prepaid campaigns without postpay billing risk.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Free tools and guides</h2>
          <p>
            Generate login codes with the free{' '}
            <Link href="/fb-2fa" className="font-bold text-[#D97706] hover:underline">Facebook 2FA authenticator</Link>, verify
            purchased profiles with the{' '}
            <Link href="/live-uid-checker" className="font-bold text-[#D97706] hover:underline">Live UID checker</Link>, and read
            our <Link href="/tips" className="font-bold text-[#D97706] hover:underline">Business Manager guides</Link> and{' '}
            <Link href="/replace-rules" className="font-bold text-[#D97706] hover:underline">replacement rules</Link> before you
            scale.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Frequently asked questions</h2>
          {SITE_FAQS.map(faq => (
            <div key={faq.question} className="space-y-1">
              <h3 className="font-bold text-[#0F172A]">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
