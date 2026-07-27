import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  title: 'إخلاء المسؤولية - بوابة نتائج الثانوية العامة 2026',
  description: 'إخلاء مسؤولية قانوني يوضح استقلالية الموقع عن أي جهة حكومية، وأن الإخطار الورقي بالمدرسة هو المستند الرسمي النهائي للنتيجة.',
  alternates: { canonical: `${SITE_URL}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <div style={{ paddingTop: 10 }}>
      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'إخلاء المسؤولية' }]} />

      <article className="card" style={{ lineHeight: 1.9, color: 'var(--ink-soft, #334155)' }}>
        <h1 style={{ marginTop: 0, fontFamily: 'var(--font-amiri), Amiri, serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--ink, #0f172a)' }}>
          إخلاء المسؤولية القانونية
        </h1>

        <p style={{ fontSize: '0.9rem', color: 'var(--muted, #64748b)' }}>
          آخر تحديث: يوليو 2026
        </p>

        <p>
          يرجى قراءة هذه الصفحة بعناية قبل استخدام الخدمات والمعلومات المتاحة على موقع <strong>بوابة نتائج الثانوية العامة</strong>.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--paper-2, #e2e8f0)', margin: '24px 0' }} />

        <h2 style={{ fontSize: '1.25rem', color: 'var(--emerald-2, #059669)' }}>1. الاستقلالية وعدم التبعية الحكومية</h2>
        <p>
          هذا الموقع هو <strong>بوابة خدمية مستقلة</strong> ومبادرة تكنولوجية خاصة تهدف لتسهيل وصول الطلاب وأولياء الأمور إلى نتائج الامتحانات والمؤشرات التنسيقية. الموقع <strong>لا يتبع ولا يمثل أي جهة حكومية أو رسمية</strong> مثل وزارة التربية والتعليم والتعليم الفني أو وزارة التعليم العالي والبحث العلمي.
        </p>

        <h2 style={{ fontSize: '1.25rem', color: 'var(--emerald-2, #059669)', marginTop: 24 }}>2. المستند الرسمي والنهائي</h2>
        <p>
          تُعرض النتائج والبيانات المتاحة على هذا الموقع لأغراض الاستعلام الأولي والاسترشادي فقط. <strong>الإخطار الورقي الرسمي الصادر من المدرسة المقيد بها الطالب هو المستند القانوني والفعلي الوحيد</strong> المعتمد لمعرفة درجات الطالب أو اتخاذ أي إجراءات رسمية بناءً عليها (مثل التظلمات أو التنسيق).
        </p>

        <h2 style={{ fontSize: '1.25rem', color: 'var(--emerald-2, #059669)', marginTop: 24 }}>3. دقة البيانات والتحديثات</h2>
        <p>
          نبذل قصارى جهدنا لضمان دقة وصحة البيانات المنشورة وسرعة تحديثها فور صدورها من المصادر المعتمدة. ومع ذلك، لا تتحمل إدارة الموقع أي مسؤولية قانونية عن أي أخطاء مطبعية غير مقصودة، أو تأخير في تحديث البيانات، أو أي قرارات تُتخذ بناءً على المعلومات المتاحة بالموقع.
        </p>

        <h2 style={{ fontSize: '1.25rem', color: 'var(--emerald-2, #059669)', marginTop: 24 }}>4. الروابط الخارجية</h2>
        <p>
          قد يحتوي الموقع على روابط تشعبية توجه الزائر إلى مواقع خارجية (مثل موقع التظلمات الرسمي أو بوابات التنسيق الحكومية). نحن غير مسؤولين عن محتوى أو سياسات الخصوصية لهذه المواقع الخارجية.
        </p>

        <h2 style={{ fontSize: '1.25rem', color: 'var(--emerald-2, #059669)', marginTop: 24 }}>5. التواصل والاستفسارات</h2>
        <p>
          إذا كان لديك أي استفسار قانوني أو رغبت في الإبلاغ عن خطأ في البيانات المعروضة، يمكنك التواصل مباشرة معنا عبر صفحة{' '}
          <Link href="/contact" style={{ color: 'var(--emerald-2)', fontWeight: 700 }}>
            اتصل بنا
          </Link>.
        </p>
      </article>
    </div>
  );
}