import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { CATEGORY_PAGES, getCategoryPage } from '@/lib/categories';
import { getProducts } from '@/lib/content';
import { absoluteUrl, ogImage, pageSocial } from '@/lib/seo';

export function generateStaticParams() {
  return CATEGORY_PAGES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCategoryPage(slug);
  if (!page) return {};

  return {
    title: { absolute: page.metaTitle.length <= 52 ? `${page.metaTitle} | BM 4 U` : page.metaTitle },
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: `/category/${page.slug}` },
    ...pageSocial({
      title: page.metaTitle,
      description: page.metaDescription,
      path: `/category/${page.slug}`,
      image: ogImage({ page: page.slug }),
    }),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getCategoryPage(slug);
  if (!page) notFound();

  const all = await getProducts();
  const products = all.filter(p => p.category === page.category);
  const url = absoluteUrl(`/category/${page.slug}`);

  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Shop', url: absoluteUrl('/shop') },
            { name: page.name, url },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: page.h1,
            description: page.metaDescription,
            url,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: products.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: absoluteUrl(`/product/${p.slug}`),
                name: p.title,
              })),
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: page.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
      <Navbar />

      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#0F172A] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#D97706] font-bold">{page.name}</span>
          </nav>

          <header className="max-w-3xl mb-10 space-y-4">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              {page.h1}
            </h1>
            {page.intro.map((para, i) => (
              <p key={i} className="text-[#475569] text-sm sm:text-base leading-relaxed">{para}</p>
            ))}
          </header>

          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A] mb-6">
            {page.name} in stock ({products.length})
          </h2>
          {products.length === 0 ? (
            <p className="text-sm text-[#64748B] mb-12">
              This category is being restocked. Browse the <Link href="/shop" className="text-[#D97706] font-bold hover:underline">full shop</Link> or ask on Telegram.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <section className="rounded-3xl bg-white border border-[#CBD5E1] shadow-sm p-6 sm:p-10 space-y-8 text-sm text-[#475569] leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">{page.chooseTitle}</h2>
              <ul className="list-disc list-inside space-y-1.5 text-[#334155]">
                {page.choose.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Frequently asked questions</h2>
              {page.faqs.map(faq => (
                <div key={faq.question} className="space-y-1">
                  <h3 className="font-bold text-[#0F172A]">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E2E8F0]">
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F172A]">Explore other categories</h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {CATEGORY_PAGES.filter(c => c.slug !== page.slug).map(c => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="text-[#D97706] font-bold hover:underline">{c.name}</Link>
                  </li>
                ))}
                <li><Link href="/tips" className="text-[#D97706] font-bold hover:underline">Guides</Link></li>
                <li><Link href="/replace-rules" className="text-[#D97706] font-bold hover:underline">Replacement rules</Link></li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
