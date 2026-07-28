import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const CONTACT_EMAIL = 'ali7mohamed76@gmail.com';

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description:
    'تواصل مع فريق بوابة نتائج الثانوية العامة للإبلاغ عن خطأ في النتيجة أو التنسيق، أو اقتراح تحسين، أو أي استفسار.',
  alternates: { canonical: `ali7mohamed76@gmail.com/contact` },
};

const REASONS: { title: string; body: string }[] = [
  {
    title: 'الإبلاغ عن خطأ في نتيجة أو درجة',
    body:
      'لو ظاهر رقم أو درجة مختلفة عن الإخطار الورقي الرسمي من مدرستك، ابعتلنا رقم الجلوس (بدون كتابة الاسم الكامل لو حابب) ووصف مختصر للمشكلة، وهنراجعها بمقارنتها بمصدرها الرسمي.',
  },
  {
    title: 'الإبلاغ عن خطأ في التنسيق',
    body: 'لو لاحظت رقم تنسيق أو حد أدنى لكلية مختلف عمّا هو معلن رسمياً، وضّح اسم الكلية والرقم اللي شايفه، وهنتأكد منه.',
  },
  {
    title: 'الإبلاغ عن خبر غير دقيق',
    body: 'لو في مقال أو خبر على الموقع فيه معلومة تحس إنها غلط أو قديمة، ابعتلنا رابط الصفحة وهنراجعها فوراً.',
  },
  {
    title: 'اقتراح لتحسين الموقع',
    body: 'أي اقتراح لتحسين سهولة الاستخدام، سرعة الموقع، أو محتوى جديد يفيد الطلاب، يسعدنا سماعه.',
  },
];

export default function ContactPage() {
  return (
    <div style={{ paddingTop: 10 }}>
      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'اتصل بنا' }]} />

      <article className="card" style={{ lineHeight: 1.9, color: 'var(--ink-soft)' }}>
        <h1 style={{ marginTop: 0, fontFamily: 'var(--font-amiri), Amiri, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--ink)' }}>
          اتصل بنا
        </h1>

        <p>
          نسعد بتواصلك معنا في أي وقت. سواء كان استفساراً، تصحيح بيانات، أو ملاحظة على الموقع، فريقنا
          يراجع كل رسالة تصلنا.
        </p>

        <div
          style={{
            background: 'var(--paper-2)',
            border: '1px solid var(--line, #e2e8f0)',
            borderRadius: 10,
            padding: '16px 18px',
            margin: '20px 0',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, color: 'var(--emerald-2)' }}>البريد الإلكتروني للتواصل</p>
          <p style={{ margin: '6px 0 0', fontWeight: 700, direction: 'ltr', textAlign: 'right' }}>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--ink)' }}>
              {CONTACT_EMAIL}
            </a>
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 13.5, color: 'var(--muted)' }}>
            وقت الرد المعتاد: خلال 24-48 ساعة عمل. في أيام إعلان النتيجة قد يتأخر الرد قليلاً بسبب
            زيادة عدد الرسائل، ونعتذر مقدماً عن أي تأخير.
          </p>
        </div>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>إيه أنواع الرسائل اللي ممكن تبعتها؟</h2>
        <div style={{ display: 'grid', gap: 14, marginTop: 10 }}>
          {REASONS.map((r) => (
            <div key={r.title}>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--emerald-2)' }}>{r.title}</p>
              <p style={{ margin: '4px 0 0' }}>{r.body}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 19, color: 'var(--ink)', marginTop: 24 }}>ملحوظة مهمة</h2>
        <p>
          فريقنا يراجع الرسائل ويصحح أي معلومة على الموقع عند التأكد منها من مصدرها الرسمي، لكننا لا
          نقدر نُصدر قرارات نتيجة أو تظلم بديلة عن وزارة التربية والتعليم. للإجراءات الرسمية، المرجع
          الوحيد هو الجهات الحكومية المختصة — راجع صفحة{' '}
          <Link href="/disclaimer" style={{ color: 'var(--emerald-2)', fontWeight: 700 }}>
            إخلاء المسؤولية
          </Link>{' '}
          لمزيد من التفاصيل.
        </p>
      </article>
    </div>
  );
}
