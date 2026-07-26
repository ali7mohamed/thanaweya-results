import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'من نحن', alternates: { canonical: '/about' } };

export default function AboutPage() {
  return (
    <div className="card" style={{ marginTop: 10, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
      <h2>من نحن</h2>
      <p>
        نقدم خدمة استعلام سريعة وموثوقة عن نتيجة الثانوية العامة، بالإضافة إلى معلومات التنسيق المتوقع
        وآخر الأخبار وإرشادات التظلم، في مكان واحد سهل الاستخدام.
      </p>
    </div>
  );
}
