import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import AdStack from '@/components/AdStack';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'التنسيق المتوقع للكليات 2026 - كيف يُحسب وكيف تقرأه',
  description: 'دليل شامل لفهم تنسيق الثانوية العامة 2026: كيف يُحدد الحد الأدنى، والفرق بين تنسيق الحكومي والخاص، وجدول الكليات المتاحة حسب نسبتك.',
  alternates: { canonical: '/coordination' },
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

  return (
    <div style={{ paddingTop: 10 }}>
      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'التنسيق المتوقع' }]} />
      <article className="card">
        <h1 style={{ marginTop: 0, fontFamily: 'Amiri, serif', fontSize: 26 }}>
          التنسيق المتوقع لكليات الجامعات: كيف يُحسب ولماذا يتغيّر كل سنة؟
        </h1>

        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>
          «التنسيق» هو الحد الأدنى من النسبة المئوية الذي يؤهل الطالب للقبول في كلية معينة، وتحدده مكاتب
          تنسيق القبول بالجامعات (وليس الوزارة) بعد ظهور النتيجة بأيام قليلة، بناءً على أعداد المتقدمين
          وأعداد المقاعد المتاحة فعلياً في كل كلية.
        </p>

        <h2 style={{ fontSize: 19 }}>لماذا يرتفع أو ينخفض التنسيق كل عام؟</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>
          التنسيق ليس رقماً ثابتاً، بل نتيجة مباشرة لعدد الطلاب الحاصلين على نسب معينة في العام نفسه.
          فإذا زاد عدد الطلاب الحاصلين على نسب مرتفعة في شعبة معينة، يرتفع الحد الأدنى لكليات تلك الشعبة
          تلقائياً، والعكس صحيح. لهذا يختلف التنسيق المتوقع من عام لآخر حتى لو لم تتغير شروط القبول نفسها.
        </p>

        <h2 style={{ fontSize: 19 }}>الفرق بين تنسيق الحكومي والخاص والأهلي</h2>
        <ul style={{ color: 'var(--ink-soft)', lineHeight: 2 }}>
          <li><strong>الجامعات الحكومية:</strong> القبول فيها مجاني أو برسوم رمزية، ولذلك يكون الحد الأدنى فيها هو الأعلى بين الأنواع الثلاثة.</li>
          <li><strong>الجامعات الأهلية:</strong> مملوكة لجهات غير ربحية وتتبع لوائح الدولة، وتنسيقها عادة أقل من الحكومي وأعلى من الخاص.</li>
          <li><strong>الجامعات الخاصة:</strong> تحدد كل جامعة حداً أدنى خاصاً بها مستقلاً عن مكتب التنسيق المركزي، وغالباً يكون أقل تشدداً.</li>
        </ul>

        <h2 style={{ fontSize: 19 }}>كيف تستخدم هذه الصفحة؟</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>
          بعد ظهور نتيجتك من صفحة{' '}
          <a href="/search" style={{ color: 'var(--emerald-2)', fontWeight: 700 }}>الاستعلام عن النتيجة</a>
          {' '}يمكنك الرجوع لهذه الصفحة تلقائياً ومعرفة الكليات التي تقترب نسبتك من حدها الأدنى، لتبدأ في
          ترتيب اختياراتك بشكل واقعي قبل فتح باب التنسيق الرسمي.
        </p>
      </article>

      <AdStack baseId="coordination_mid" count={3} />

      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>جدول التنسيق المتوقع</h2>

        <form
          method="get"
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
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff' }}
          />
          <select name="section" defaultValue={section ?? ''} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff' }}>
            <option value="">كل الشعب</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select name="governorate" defaultValue={governorateSlug ?? ''} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff' }}>
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
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff' }}
          />
          <select name="sort" defaultValue={sort} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff' }}>
            <option value="desc">الأعلى تنسيقاً أولاً</option>
            <option value="asc">الأقل تنسيقاً أولاً</option>
          </select>
          <button
            type="submit"
            style={{ padding: '10px 12px', borderRadius: 8, border: 'none', background: 'var(--emerald-2)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            بحث
          </button>
        </form>

        {percentage && (
          <p style={{ color: 'var(--ink-soft)' }}>الكليات المتاحة لنسبة {percentage}% وأعلى:</p>
        )}
        {colleges.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>
            لا توجد بيانات تنسيق منشورة بعد لهذا الاختيار. الجدول يُحدَّث فور اعتماد مكاتب التنسيق للحدود
            الدنيا الرسمية لهذا العام.
          </p>
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
                  border: '1px solid var(--paper-2)',
                  background: '#fff',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{c.collegeName}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                    {c.section}
                    {c.governorate ? ` — ${c.governorate.nameAr}` : ''}
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--emerald-2)', fontSize: 16 }}>
                  {c.minPercentage.toString()}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AdStack baseId="coordination_bottom" count={3} formats={['multiplex', 'in-feed', 'rectangle']} />
    </div>
  );
}
