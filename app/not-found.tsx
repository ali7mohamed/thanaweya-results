import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card" style={{ marginTop: 10, textAlign: 'center' }}>
      <h2>الصفحة غير موجودة</h2>
      <p style={{ color: 'var(--ink-soft)' }}>الصفحة التي تبحث عنها غير متاحة، جرب البحث عن نتيجتك من جديد.</p>
      <Link href="/search" className="btn" style={{ display: 'inline-block' }}>
        الاستعلام عن النتيجة
      </Link>
    </div>
  );
}
