import Link from 'next/link';
import type { Product, BlogPost } from '@/types';
import { getProductContent } from '@/lib/seoContent';
import { categoryPathFor } from '@/lib/categories';

const card = 'rounded-3xl bg-white border border-[#CBD5E1] shadow-sm p-6 sm:p-10';

// Server-rendered, always-visible copy for the product page: this is the text search engines
// index for the long-tail queries (country, line tier, limit) that the tabbed UI hides.
export function ProductSeoContent({ product, relatedPosts }: { product: Product; relatedPosts: BlogPost[] }) {
  const { name, intro, useCases, steps, faqs, countryNote, geo } = getProductContent(product);

  return (
    <section className={`${card} mb-16 space-y-10 text-sm text-[#475569] leading-relaxed`}>
      <div className="space-y-3">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">About {name}</h2>
        {intro.map((para, i) => <p key={i}>{para}</p>)}
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Who is this for?</h2>
        <ul className="list-disc list-inside space-y-1.5 text-[#334155]">
          {useCases.map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">How ordering and activation work</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-[#334155]">
          {steps.map(step => <li key={step}>{step}</li>)}
        </ol>
      </div>

      {countryNote && (
        <div className="space-y-3">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">{geo} stock notes</h2>
          <p>{countryNote}</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Frequently asked questions</h2>
        {faqs.map(faq => (
          <div key={faq.question} className="space-y-1">
            <h3 className="font-bold text-[#0F172A]">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-[#E2E8F0]">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Helpful tools and guides</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li><Link href="/fb-2fa" className="text-[#D97706] font-bold hover:underline">Free Facebook 2FA code generator</Link></li>
          <li><Link href="/live-uid-checker" className="text-[#D97706] font-bold hover:underline">Live UID checker for purchased accounts</Link></li>
          <li><Link href="/replace-rules" className="text-[#D97706] font-bold hover:underline">24-hour replacement rules</Link></li>
          <li><Link href={categoryPathFor(product.category)} className="text-[#D97706] font-bold hover:underline">More products in this category</Link></li>
          {relatedPosts.map(post => (
            <li key={post.slug}>
              <Link href={`/tips/${post.slug}`} className="text-[#D97706] font-bold hover:underline">{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
