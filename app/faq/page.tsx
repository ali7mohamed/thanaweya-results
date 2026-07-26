import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import AdStack from '@/components/AdStack';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة عن نتيجة الثانوية العامة 2026',
  alternates: { canonical: '/faq' },
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div style={{ paddingTop: 10 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'الأسئلة الشائعة' }]} />
      <div className="card">
        <h2 style={{ marginTop: 0 }}>الأسئلة الشائعة</h2>
        {faqs.length === 0 && <p>سيتم إضافة الأسئلة الشائعة قريباً.</p>}
        {faqs.map((f) => (
          <details key={f.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--paper-2)' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer' }}>{f.question}</summary>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{f.answer}</p>
          </details>
        ))}
      </div>
      <AdStack baseId="faq_bottom" count={3} formats={['in-feed', 'rectangle', 'multiplex']} />
    </div>
  );
}
