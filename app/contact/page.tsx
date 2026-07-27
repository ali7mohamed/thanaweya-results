import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'اتصل بنا', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <div className="card" style={{ marginTop: 10, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
      <h2>اتصل بنا</h2>
      <p>لأي استفسار أو ملاحظة، يمكنك مراسلتنا عبر البريد الإلكتروني:</p>
      <p style={{ fontWeight: 700, direction: 'ltr', textAlign: 'right' }}>ali7mohamed76@gmail.com</p>
    </div>
  );
}
