import type { Metadata } from 'next';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import AdStack from '@/components/AdStack';

export const metadata: Metadata = {
  title: 'نتيجة الثانوية العامة 2026 - استعلم عن نتيجتك الآن',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <div style={{ paddingTop: 10 }}>
      <SearchForm />
      <AdStack baseId="home_mid" count={3} />

      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>روابط سريعة</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/coordination" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>التنسيق المتوقع</Link>
          <Link href="/news" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>آخر الأخبار</Link>
          <Link href="/appeals" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>التظلمات</Link>
          <Link href="/faq" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>الأسئلة الشائعة</Link>
        </div>
      </div>
    </div>
  );
}
