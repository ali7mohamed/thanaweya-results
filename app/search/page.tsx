import type { Metadata } from 'next';
import SearchForm from '@/components/SearchForm';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'الاستعلام عن نتيجة الثانوية العامة برقم الجلوس أو الاسم',
  description: 'أدخل رقم جلوسك أو اسمك لعرض نتيجة الثانوية العامة 2026 فوراً.',
  alternates: { canonical: '/search' },
};

export default function SearchPage() {
  return (
    <div style={{ paddingTop: 10 }}>
      <SearchForm />
      <AdSlot format="responsive" adUnitId="search_mid" />
    </div>
  );
}
