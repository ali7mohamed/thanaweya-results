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

// Builds a compact list of page numbers with '…' gaps, e.g. [1, '…', 4, 5, 6, '…', 29]
function buildPageList(current: number, total: number): (number | '…')[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | '…')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('…');
    result.push(p);
    prev = p;
  }
  return result;
}

const PAGE_SIZE = 25;

export default async function CoordinationPage({
  searchParams,
}: {
  searchParams: {
    section?: string;
    percentage?: string;
    governorate?: string;
    university?: string;
    college?: string;
    sort?: string;
    page?: string;
  };
}) {
  const section = searchParams.section;
  const percentage = searchParams.percentage ? Number(searchParams.percentage) : undefined;
  const governorateSlug = searchParams.governorate;
  const university = searchParams.university?.trim();
  const college = searchParams.college?.trim();
  const sort = searchParams.sort === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, Number(searchParams.page) || 1);

  const governorates = await prisma.governorate.findMany({ orderBy: { nameAr: 'asc' } });
  const adSlots = await getAdSlots('coordination');

  const latestYearRow = await prisma.coordination.findFirst({ orderBy: { year: 'desc' } });
  const latestYear = latestYearRow?.year ?? new Date().getFullYear();

  const where = {
    year: latestYear,
    ...(section ? { section } : {}),
    ...(percentage ? { minPercentage: { lte: percentage } } : {}),
    ...(governorateSlug ? { governorate: { slug: governorateSlug } } : {}),
    ...(university ? { universityName: { contains: university, mode: 'insensitive' as const } } : {}),
    ...(college ? { collegeName: { contains: college, mode: 'insensitive' as const } } : {}),
  };

  const totalCount = await prisma.coordination.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const colleges = await prisma.coordination.findMany({
    where,
    orderBy: { minPercentage: sort },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { governorate: true },
  });

  // Builds a query string that keeps all active filters but swaps the page number.
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (university) params.set('university', university);
    if (college) params.set('college', college);
    if (section) params.set('section', section);
    if (governorateSlug) params.set('governorate', governorateSlug);
    if (percentage) params.set('percentage', String(percentage));
    if (sort !== 'desc') params.set('sort', sort);
    params.set('page', String(p));
    return `/coordination?${params.toString()}`;
  };

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
        <h2 style={{ marginTop: 0 }}>تنسيق {latestYear}</h2>
        <p style={{ color: 'var(--muted, #64748b)', fontSize: 13.5, marginTop: -8, marginBottom: 18 }}>
          سجلات {latestYear} فقط، مرتبة حسب نسبة التنسيق (الأعلى أولاً).
        </p>

        <form
          method="get"
          aria-label="تصفية البحث في جدول التنسيق"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}
        >
          <input
            type="text"
            name="university"
            defaultValue={university ?? ''}
            placeholder="الجامعة"
            aria-label="ابحث باسم الجامعة"
            style={{ flex: '1 1 180px', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          />
          <input
            type="text"
            name="college"
            defaultValue={college ?? ''}
            placeholder="الكلية"
            aria-label="ابحث باسم الكلية"
            style={{ flex: '1 1 180px', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}
          />
          <button
            type="submit"
            style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: 'var(--emerald-2, #059669)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            بحث
          </button>
        </form>

        <details style={{ marginBottom: 20 }}>
          <summary style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'var(--emerald-2)' }}>
            فلاتر إضافية (الشعبة، المحافظة، نسبتك، الترتيب)
          </summary>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 10,
              marginTop: 12,
            }}
          >
            <input type="hidden" name="university" value={university ?? ''} />
            <input type="hidden" name="college" value={college ?? ''} />
            <select name="section" defaultValue={section ?? ''} aria-label="اختر الشعبة" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}>
              <option value="">كل الشعب</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select name="governorate" defaultValue={governorateSlug ?? ''} aria-label="اختر المحافظة" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}>
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
            <select name="sort" defaultValue={sort} aria-label="ترتيب النتائج" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', background: '#fff' }}>
              <option value="desc">الأعلى تنسيقاً أولاً</option>
              <option value="asc">الأقل تنسيقاً أولاً</option>
            </select>
            <button type="submit" style={{ padding: '10px 12px', borderRadius: 8, border: 'none', background: 'var(--emerald-2, #059669)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              تطبيق
            </button>
          </div>
        </details>

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
          <>
            <div style={{ overflowX: 'auto', border: '1px solid var(--paper-2, #e2e8f0)', borderRadius: 10 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--paper-2, #f1f5f9)', textAlign: 'right' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--emerald-2, #059669)' }}>التنسيق</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--ink, #0f172a)' }}>الجامعة</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--ink, #0f172a)' }}>الكلية</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--ink, #0f172a)' }}>الشعبة</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--ink, #0f172a)' }}>السنة</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{
                        borderTop: '1px solid var(--paper-2, #f1f5f9)',
                        background: i % 2 === 0 ? '#fff' : 'var(--paper, #fafaf9)',
                      }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--emerald-2, #059669)', whiteSpace: 'nowrap' }}>
                        {c.minPercentage.toString()}%
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {c.governorate?.nameAr || '—'}
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.collegeName}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-soft)' }}>{c.section}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted, #64748b)' }}>{c.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav aria-label="صفحات جدول التنسيق" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
              {currentPage > 1 && (
                <Link href={pageHref(currentPage - 1)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', color: 'var(--ink-soft)', textDecoration: 'none', fontSize: 13 }}>
                  السابق
                </Link>
              )}
              {buildPageList(currentPage, totalPages).map((p, idx) =>
                p === '…' ? (
                  <span key={`ellipsis-${idx}`} style={{ padding: '6px 4px', color: 'var(--muted, #64748b)' }}>…</span>
                ) : (
                  <Link
                    key={p}
                    href={pageHref(p as number)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--line, #cbd5e1)',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: p === currentPage ? 800 : 500,
                      color: p === currentPage ? '#fff' : 'var(--ink-soft)',
                      background: p === currentPage ? 'var(--emerald-2, #059669)' : '#fff',
                    }}
                  >
                    {p}
                  </Link>
                )
              )}
              {currentPage < totalPages && (
                <Link href={pageHref(currentPage + 1)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line, #cbd5e1)', color: 'var(--ink-soft)', textDecoration: 'none', fontSize: 13 }}>
                  التالي
                </Link>
              )}
            </nav>
            <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--muted, #64748b)', marginTop: 10 }}>
              صفحة {currentPage} من {totalPages} · {totalCount} إجمالي
            </p>
          </>
        )}
      </div>

      <AdStack baseId="coordination_bottom" count={3} formats={['multiplex', 'in-feed', 'rectangle']} adSlots={adSlots} />
    </div>
  );
}