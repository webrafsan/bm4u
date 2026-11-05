import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbLd } from '@/components/JsonLd';
import { absoluteUrl } from '@/lib/seo';

export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export function LegalPage({
  title,
  path,
  updated,
  intro,
  sections,
}: {
  title: string;
  path: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: absoluteUrl('/') },
          { name: title, url: absoluteUrl(path) },
        ])}
      />
      <Navbar />
      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-cosmic relative">
        <article className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D97706] font-bold">{title}</span>
          </nav>

          <header className="mb-8 space-y-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-xs text-[#64748B] font-medium">Last updated: {updated}</p>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">{intro}</p>
          </header>

          <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-sm p-6 sm:p-10 space-y-8 text-sm text-[#475569] leading-relaxed">
            {sections.map(section => (
              <section key={section.heading} className="space-y-3">
                <h2 className="font-heading text-xl font-bold text-[#0F172A]">{section.heading}</h2>
                {section.paragraphs?.map((para, i) => <p key={i}>{para}</p>)}
                {section.bullets && (
                  <ul className="list-disc list-inside space-y-1.5 text-[#334155]">
                    {section.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <p className="mt-8 text-xs text-[#64748B]">
            Questions? Email{' '}
            <a href="mailto:support@bm4u.net" className="text-[#D97706] font-bold hover:underline">support@bm4u.net</a> or message{' '}
            <a href="https://t.me/bybm4u" target="_blank" rel="noopener noreferrer" className="text-[#D97706] font-bold hover:underline">@bybm4u</a>{' '}
            on Telegram.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
