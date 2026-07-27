import type { Metadata } from 'next';
import SearchForm from '@/components/SearchForm';
import AdStack from '@/components/AdStack';
import { getAdSlots } from '@/lib/ads';

export const metadata: Metadata = {
  title: 'الاستعلام عن نتيجة الثانوية العامة برقم الجلوس أو الاسم',
  description: 'أدخل رقم جلوسك أو اسمك لعرض نتيجة الثانوية العامة 2026 فوراً.',
  alternates: { canonical: '/search' },
};

export default async function SearchPage() {
  const adSlots = await getAdSlots('search');

  return (
    <div style={{ paddingTop: 10 }}>
      <SearchForm />
      <AdStack baseId="search_mid" count={3} adSlots={adSlots} />
    </div>
  );
}
