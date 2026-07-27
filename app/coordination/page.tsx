import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getAdSlots } from '@/lib/ads';
import AdStack from '@/components/AdStack';
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  title: 'التنسيق المتوقع للكليات 2026 - كيف يُحسب وكيف تقرأه',
  description: 'دليل شامل لفهم تنسيق الثانوية العامة 2026: كيف يُحدد الحد الأدنى، والفرق بين تنسيق الحكومي والخاص والأهلي، وجدول الكليات المتاحة حسب نسبتك.',
  alternates: { canonical: `${SITE_URL}/coordination` },
  openGraph: {
    title: 'التنسيق المتوقع للكليات 2026 - دليل الطالب الحصري',
    description: 'استعرض الحدود الدنيا المتوقعة للقبول بالكليات والجامعات الحكومية والأهلية والخاصة لعام 2026 حسب مجموعك وشعبتك.',
    type: 'website',
  },
};

const SECTIONS = ['علمي علوم', 'علمي رياضة', 'أدبي'];

export default async function CoordinationPage({
  searchParams,
}: {
  searchParams: { section?: string; percentage?: string; governorate?: string; q?: string; sort?: string };
}) {
  const section = searchParams.section;
  const percentage = searchParams.percentage ? Number(searchParams.percentage) : undefined;
  const governorateSlug = searchParams.governorate;
  const q = searchParams.q?.trim();
  const sort = searchParams.sort === 'asc' ? 'asc' : 'desc';

  const governorates = await prisma.governorate.findMany({ orderBy: { nameAr: 'asc' } });
  const adSlots = await getAdSlots('coordination');

  const colleges = await prisma.coordination.findMany({
    where: {
      ...(section ? { section } : {}),
      ...(percentage ? { minPercentage: { lte: percentage } } : {}),
      ...(governorateSlug ? { governorate: { slug: governorateSlug } } : {}),
      ...(q ? { collegeName: { contains: q, mode: 'insensitive' } } : {}),
    },
    orderBy: { minPercentage: sort },
    take: 100,
    include: { governorate: true },
  });

  // Schema structured data for FAQ and Coordination ItemList
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'كيف يتم تحديد الحد الأدنى لتنسيق الكليات؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'تحدده مكاتب تنسيق القبول بالجامعات بناءً على أعداد الطلاب المتقدمين والأماكن الشاغرة في كل كلية ونسب المجاميع التكرارية للطلاب هذا العام.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما الفرق بين التنسيق الحكومي والأهلي والخاص؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'الجامعات الحكومية تعتمد الحد الأعلى للتنسيق، بينما الأهلية تتبع الدولة وتحدد حدوداً أدنى أقل نسبياً، وتتيح الجامعات الخاصة حدوداً أدنى مستقلة وفقاً لكل كلية.',
        },
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'جدول التنسيق المتوقع للكليات 2026',
    numberOfItems: colleges.length,
    itemListElement: colleges.slice(0, 10).map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.collegeName,
      description: `${c.section} - الحد الأدنى: ${c.minPercentage}%`,
    })),
  };

  return (
    <div style={{ paddingTop: 10 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, itemListSchema]) }}
      />

      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'التنسيق المتوقع' }]} />

      <article className="card">
        <h1 style={{ marginTop: 0, fontFamily: 'var(--font-amiri), Amiri, serif', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
          التنسيق المتوقع لكليات الجامعات: كيف يُحسب ولماذا يتغيّر كل سنة؟
        </h1>

        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9, fontSize: '1.025rem' }}>
          «التنسيق» هو الحد الأدنى من النسبة المئوية الذي يؤهل الطالب للقبول في كلية معينة، وتحدده مكاتب
          تنسيق القبول بالجامعات (وليس الوزارة) بعد ظهور النتيجة بأيام قليلة، بناءً على أعداد المتقدمين
          وأعداد المقاعد المتاحة فعلياً في كل كلية.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--emerald-2, #059669)', marginTop: 24 }}>لماذا يرتفع أو ينخفض التنسيق كل عام؟</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>
          التنسيق ليس رقماً ثابتاً، بل نتيجة مباشرة لعدد الطلاب الحاصلين على نسب معينة في العام نفسه.
          فإذا زاد عدد الطلاب الحاصلين على نسب مرتفعة في شعبة معينة، يرتفع الحد الأدنى لكليات تلك الشعبة
          تلقائياً، والعكس صحيح. لهذا يختلف التنسيق المتوقع من عام لآخر حتى لو لم تتغير شروط القبول نفسها.
        </p>

        <h2 style={{ fontSize: 19, color: 'var(--emerald-2, #059669)', marginTop: 24 }}>الفرق بين تنسيق الحكومي والخاص والأهلي</h2>
        <ul style={{ color: 'var(--ink-soft)', lineHeight: 2, paddingRight: 20 }}>
          <li><strong>الجامعات الحكومية:</strong> القبول فيها مجاني أو برسوم رمزية، ولذلك يكون الحد الأدنى فيها هو الأعلى بين الأنواع الثلاثة.</li>
          <li><strong>الجامعات الأهلية:</strong> مملوكة لجهات غير ربحية وتتبع لوائح الدولة، وتنسيقها عادة أقل من الحكومي وأعلى من الخاص.</li>
          <li><strong>الجامعات الخاصة:</strong> تحدد كل جامعة حداً أدنى خاصاً بها مستقلاً عن مكتب التنسيق المركزي، وغالباً يكون أقل تشدداً.</li>
        </ul>

        <h2 style={{ fontSize: 19, color: 'var(--emerald-2, #059669)', marginTop: 24 }}>كيف تستخدم هذه الصفحة؟</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>
          بعد ظهور نتيجتك من صفحة{' '}
          <Link href="/search" style={{ color: 'var(--emerald-2)', fontWeight: 700 }}>
            الاستعلام عن النتيجة
          </Link>
          {' '}يمكنك الرجوع لهذه الصفحة تلقائياً ومعرفة الكليات التي تقترب نسبتك من حدها الأدنى، لتبدأ في
          ترتيب اختياراتك بشكل واقعي قبل فتح باب التنسيق الرسمي.
        </p>

        {/* E-E-A-T Editorial Notice */}
        <div 
          style={{ 
            marginTop: 20, 
            padding: '12px 16px', 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: 8, 
            fontSize: '0.85rem', 
            color: '#475569',
            lineHeight: 1.6
          }}
        >
          <strong>تنويه استرشادي:</strong> مؤشرات التنسيق المعروضة أدناه مبنية على البيانات الإحصائية الرسمية للسنوات السابقة ونتائج الشرائح التكرارية، وتُحدّث فور صدور البيانات الرسمية المعتمدة من وزارة التعليم العالي.
        </div>
      </article>

      <AdStack baseId="coordination_mid" count={3} adSlots={adSlots} />

      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>جدول التنسيق المتوقع</h2>

        <form
          method="get"
          aria-label="تصفية البحث في جدول التنسيق"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            marginBottom: 20,
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="ابحث باسم الكلية..."
            aria-label="البحث باسم الكلية"
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          />
          <select 
            name="section" 
            defaultValue={section ?? ''} 
            aria-label="اختر الشعبة"
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          >
            <option value="">كل الشعب</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select 
            name="governorate" 
            defaultValue={governorateSlug ?? ''} 
            aria-label="اختر المحافظة"
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          >
            <option value="">كل المحافظات</option>
            {governorates.map((g) => (
              <option key={g.slug} value={g.slug}>{g.nameAr}</option>
            ))}
          </select>
          <input
            type="number"
            name="percentage"
            defaultValue={percentage ?? ''}
            placeholder="نسبتك %"
            min={0}
            max={100}
            aria-label="أدخل النسبه المئوية"
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          />
          <select 
            name="sort" 
            defaultValue={sort} 
            aria-label="ترتيب النتائج"
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          >
            <option value="desc">الأعلى تنسيقاً أولاً</option>
            <option value="asc">الأقل تنسيقاً أولاً</option>
          </select>
          <button
            type="submit"
            style={{ padding: '10px 12px', borderRadius: 8, border: 'none', background: 'var(--emerald-2, #059669)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            بحث
          </button>
        </form>

        {percentage && (
          <p style={{ color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 16 }}>
            الكليات المتاحة لنسبة {percentage}% وأقل في الحدود الدنيا:
          </p>
        )}

        {colleges.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <p style={{ color: 'var(--ink-soft)', margin: '0 0 8px 0', fontWeight: 600 }}>
              لا توجد بيانات تنسيق تطابق خيارات البحث الحالية.
            </p>
            <p style={{ color: 'var(--muted, #64748b)', fontSize: 13, margin: 0 }}>
              جرّب إزالة بعض الفلاتر أو البحث بكلمة عامة، وستُحدّث البيانات رسمياً فور اعتماد مراحل التنسيق الجديدة.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {colleges.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--paper-2, #f1f5f9)',
                  background: '#fff',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ink, #0f172a)' }}>{c.collegeName}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted, #64748b)', marginTop: 2 }}>
                    {c.section}
                    {c.governorate ? ` — ${c.governorate.nameAr}` : ''}
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--emerald-2, #059669)', fontSize: 16 }}>
                  {c.minPercentage.toString()}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdStack baseId="coordination_bottom" count={3} formats={['multiplex', 'in-feed', 'rectangle']} adSlots={adSlots} />
    </div>
  );
}