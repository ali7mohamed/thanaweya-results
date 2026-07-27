import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import SearchForm from '@/components/SearchForm';
import AdStack from '@/components/AdStack';
import { getAdSlots } from '@/lib/ads';

export const metadata: Metadata = {
  title: 'نتيجة الثانوية العامة 2026 - استعلم عن نتيجتك الآن برقم الجلوس',
  description: 'استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو الاسم فور اعتمادها رسمياً. احصل على التوزيع التفصيلي للدرجات والتنسيق المتوقع ودليل التظلمات.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const adSlots = await getAdSlots('home');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'كيف يمكنني الاستعلام عن نتيجة الثانوية العامة 2026؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'يمكنك كتابة رقم الجلوس أو الاسم في خانة البحث أعلى الصفحة ثم الضغط على زر البحث لعرض نتيجة الطالب فوراً بالدرجات والنسبة المئوية.'
        }
      },
      {
        '@type': 'Question',
        'name': 'ما هو المجموع الكلي لدرجات الثانوية العامة؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'المجموع الكلي لدرجات الثانوية العامة المصرية هو 320 درجات موزعة على المواد الأساسية للشعبتين العلمية والأدبية.'
        }
      },
      {
        '@type': 'Question',
        'name': 'هل البيانات المعروضة معتمدة ورسمية؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'يتم استخراج البيانات بناءً على القوائم الرسمية الصادرة عن وزارة التربية والتعليم والتعليم الفني، وتعتبر الإخطارات الورقية بالمدارس هي المستند الرسمي النهائي.'
        }
      }
    ]
  };

  return (
    <div style={{ paddingTop: 10 }}>
      <Script
        id="home-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* System Live Status Indicator */}
      <div 
        className="card" 
        style={{ 
          marginBottom: 16, 
          borderRight: '4px solid #2563eb', 
          backgroundColor: '#f8fafc',
          padding: '12px 16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span 
            style={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              backgroundColor: '#2563eb', 
              display: 'inline-block' 
            }} 
          />
          <strong style={{ fontSize: '0.95rem' }}>حالة نظام الاستعلام:</strong>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#475569', lineHeight: '1.5' }}>
          النظام جاهز للاستعلام المباشر برقم الجلوس أو الاسم فور الاعتماد الرسمي لكشوف النتائج من وزارة التربية والتعليم والتعليم الفني.
        </p>
      </div>

      <SearchForm />

      <AdStack baseId="home_mid" count={3} adSlots={adSlots} />

      {/* Quick Links Card */}
      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>روابط سريعة واستعلامات</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/coordination" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>التنسيق المتوقع</Link>
          <Link href="/news" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>آخر الأخبار</Link>
          <Link href="/appeals" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>التظلمات</Link>
          <Link href="/faq" className="btn ghost" style={{ margin: 0, flex: '1 1 45%' }}>الأسئلة الشائعة</Link>
        </div>
      </div>

      {/* Static Informational Section (Solves AdSense Low Value Content) */}
      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>دليل الاستعلام عن نتيجة الثانوية العامة 2026</h2>
        <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7' }}>
          يوفر موقعنا خدمة مجانية وسريعة للطلاب وأولياء الأمور للحصول على نتيجة الثانوية العامة للعام الدراسي 2025/2026 فور الإعلان عنها. يتيح النظام البحث برقم الجلوس أو بالاسم للوصول إلى تفاصيل الدرجات والنسبة المئوية والمجموع الكلي.
        </p>

        <h3 style={{ fontSize: '1.05rem', marginTop: 16, marginBottom: 8 }}>خطوات معرفة النتيجة:</h3>
        <ol style={{ paddingRight: 20, margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <li>أدخل رقم الجلوس المكون من أرقام في مربع البحث أعلاه.</li>
          <li>يمكنك أيضاً البحث باسم الطالب للوصول إلى القائمة المطابقة.</li>
          <li>اضغط على زر "بحث" لعرض بطاقة النتيجة التفصيلية.</li>
          <li>تأكد من مراجعة المجموع الكلي (من 320) والدرجات في كل مادة دراسية.</li>
        </ol>
      </div>

      {/* E-E-A-T Disclaimer & Official Source Notice */}
      <div 
        className="card" 
        style={{ 
          marginTop: 24, 
          backgroundColor: '#fffbeb', 
          border: '1px solid #fef3c7', 
          color: '#92400e',
          fontSize: '0.85rem',
          lineHeight: '1.6'
        }}
      >
        <strong>تنويه ومصدر البيانات الرسمي:</strong>
        <p style={{ margin: '4px 0 0 0' }}>
          هذا الموقع خدمة مستقلة لتسهيل وصول الطلاب لنتائجهم، وتعتمد كافة البيانات المعروضة على القوائم والإعلانات الصادرة عن وزارة التربية والتعليم والتعليم الفني المصرية. تعتبر المستندات الورقية الرسمية المسلمة بالمدارس هي المرجع الوحيد المعتمد.
        </p>
      </div>
    </div>
  );
}
