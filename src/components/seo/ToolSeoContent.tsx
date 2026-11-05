import type { ToolContent } from '@/lib/toolContent';

export function ToolSeoContent({ content }: { content: ToolContent }) {
  return (
    <section className="mt-16 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm p-6 sm:p-10 space-y-8 text-sm text-[#475569] leading-relaxed">
      <h2 className="font-heading text-2xl font-extrabold text-[#0F172A]">{content.heading}</h2>

      {content.sections.map(section => (
        <div key={section.title} className="space-y-3">
          <h3 className="font-heading text-lg font-bold text-[#0F172A]">{section.title}</h3>
          {section.paragraphs?.map((para, i) => <p key={i}>{para}</p>)}
          {section.bullets && (
            <ul className="list-disc list-inside space-y-1.5 text-[#334155]">
              {section.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
          )}
        </div>
      ))}

      <div className="space-y-3">
        <h3 className="font-heading text-lg font-bold text-[#0F172A]">{content.howToName}</h3>
        <ol className="list-decimal list-inside space-y-1.5 text-[#334155]">
          {content.howToSteps.map(step => (
            <li key={step.name}><strong className="text-[#0F172A]">{step.name}.</strong> {step.text}</li>
          ))}
        </ol>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#0F172A]">Frequently asked questions</h3>
        {content.faqs.map(faq => (
          <div key={faq.question} className="space-y-1">
            <h4 className="font-bold text-[#0F172A]">{faq.question}</h4>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
