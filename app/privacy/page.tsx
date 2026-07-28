import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description:
    'سياسة الخصوصية لبوابة نتائج الثانوية العامة: كيف نتعامل مع بيانات الزوار، الكوكيز، إعلانات Google AdSense، والتحليلات.',
  alternates: { canonical: `ali7mohamed76@gmail.com/privacy` },
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: 10 }}>
      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'سياسة الخصوصية' }]} />

      <article className="card" style={{ lineHeight: 1.9, color: 'var(--ink-soft)' }}>
        <h1 style={{ marginTop: 0, fontFamily: 'var(--font-amiri), Amiri, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--ink)' }}>
          سياسة الخصوصية
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>آخر تحديث: يوليو 2026</p>

        <p>
          نحترم خصوصية كل زائر لهذا الموقع. هذه الصفحة توضح بشفافية إيه البيانات اللي بنتعامل معاها،
          إزاي بنستخدمها، ومين بيشوفها.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>1. البيانات المتعلقة بالنتيجة</h2>
        <p>
          لعرض نتيجة الثانوية العامة، بنستخدم رقم الجلوس (والاسم لو مدخّل) فقط لمطابقة النتيجة من
          مصدرها الرسمي المعتمد من وزارة التربية والتعليم. مفيش بيانات نتيجة بتتخزن أو تترتبط باسمك
          بشكل دائم على السيرفر أكتر من كونها كاش لعرض الصفحة.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>2. Google AdSense والإعلانات</h2>
        <p>
          يعرض هذا الموقع إعلانات عبر خدمة Google AdSense. تستخدم Google ومورّدو الإعلانات الخارجيون
          ملفات تعريف الارتباط (بما فيها الكوكي الخاص بـ DoubleClick DART) لعرض إعلانات مبنية على
          زياراتك لهذا الموقع ومواقع أخرى. يمكنك مراجعة أو تعديل تفضيلاتك الإعلانية من خلال{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--emerald-2)', fontWeight: 700 }}
          >
            إعدادات إعلانات Google
          </a>
          ، أو تعطيل الإعلانات المخصصة بالكامل من هناك.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>3. الكوكيز (Cookies)</h2>
        <p>
          نستخدم كوكيز أساسية لتشغيل الموقع بشكل صحيح (مثل تفضيل الوضع الليلي أو حالة القائمة)، وكوكيز
          من طرف ثالث (Google AdSense والتحليلات) لأغراض الإعلانات وقياس الأداء. يمكنك حظر أو حذف
          الكوكيز في أي وقت من إعدادات المتصفح، مع العلم أن بعض ميزات الموقع قد تعمل بشكل مختلف بدونها.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>4. التخزين المحلي (Local Storage)</h2>
        <p>
          قد يستخدم الموقع التخزين المحلي بالمتصفح (Local Storage) لحفظ تفضيلات بسيطة مثل آخر رقم
          جلوس بحثت عنه لتسهيل الاستخدام، وهذا التخزين يبقى على جهازك فقط ولا يُرسل لسيرفراتنا.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>5. التحليلات (Analytics)</h2>
        <p>
          نستخدم أدوات تحليل الزيارات لفهم الصفحات الأكثر زيارة وتحسين أداء الموقع، وهي بيانات مجمّعة
          وغير مرتبطة بهويتك الشخصية (مثل عدد الزيارات، الصفحة، ونوع الجهاز تقريباً).
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>6. سجلات البحث (Search Logs)</h2>
        <p>
          عمليات البحث عن رقم الجلوس تُستخدم فقط لحظة الاستعلام لعرض النتيجة المطابقة، ولا يتم الاحتفاظ
          بسجل دائم يربط عمليات بحث معينة بأشخاص محددين لأغراض تسويقية.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>7. الاحتفاظ بالبيانات (Data Retention)</h2>
        <p>
          بيانات النتائج المعروضة تُحدَّث وتُستبدل بحسب المصدر الرسمي، ولا نحتفظ بنسخ شخصية إضافية بعد
          انتهاء الغرض من عرضها. سجلات الخادم التقنية (مثل سجلات الأخطاء) تُحفظ لفترة محدودة لأغراض
          الصيانة الأمنية فقط.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>8. حقوقك</h2>
        <p>
          يمكنك طلب معرفة أو حذف أي بيانات نحتفظ بها متعلقة بك (مثل رسالة أرسلتها لنا)، وذلك بالتواصل
          معنا مباشرة.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--ink)' }}>9. التواصل</h2>
        <p>
          لأي استفسار بخصوص هذه السياسة أو خصوصيتك، يمكنك التواصل معنا عبر صفحة{' '}
          <Link href="/contact" style={{ color: 'var(--emerald-2)', fontWeight: 700 }}>
            اتصل بنا
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
