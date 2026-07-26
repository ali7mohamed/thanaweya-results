import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'الشروط والأحكام', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return (
    <div className="card" style={{ marginTop: 10, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
      <h2>الشروط والأحكام</h2>
      <p>
        هذا الموقع خدمة مستقلة تهدف لمساعدة الطلاب على الاستعلام عن نتيجة الثانوية العامة بسهولة وسرعة،
        وهو غير تابع رسمياً لوزارة التربية والتعليم المصرية.
      </p>
      <p>نبذل قصارى جهدنا لضمان دقة البيانات المعروضة، لكن النتيجة الرسمية المعتمدة هي الصادرة من الوزارة فقط.</p>
      <p>باستخدامك هذا الموقع، فإنك توافق على استخدامه لأغراض الاستعلام الشخصي فقط.</p>
    </div>
  );
}
