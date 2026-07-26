import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import AdSlot from '@/components/AdSlot';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LatestNewsWidget, PopularNewsWidget } from '@/components/NewsWidgets';
import TrustedNewsFeed from '@/components/TrustedNewsFeed';
import { getCachedTrustedNews } from '@/lib/news-aggregator';

export const metadata: Metadata = {
  title: 'آخر أخبار نتيجة الثانوية العامة 2026',
  description: 'أحدث أخبار نتيجة الثانوية العامة 2026: مواعيد الإعلان، التنسيق، التظلمات، وكل تحديث رسمي من وزارة التربية والتعليم.',
  alternates: {
    canonical: '/news',
    types: { 'application/rss+xml': '/news/feed.xml' },
  },
  openGraph: { title: 'آخر أخبار نتيجة الثانوية العامة 2026', type: 'website' },
};

export const revalidate = 300; // fresh news matters more than static caching here

const CATEGORIES = ['الكل', 'النتيجة', 'التنسيق', 'التظلمات', 'عام'];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category && searchParams.category !== 'الكل' ? searchParams.category : undefined;

  const [items, latest, popular, trustedNews] = await Promise.all([
    prisma.news.findMany({
      where: { isPublished: true, ...(category ? { category } : {}) },
      orderBy: { publishedAt: 'desc' },
      take: 30,
    }),
    prisma.news.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.news.findMany({ where: { isPublished: true }, orderBy: { viewCount: 'desc' }, take: 5 }),
    getCachedTrustedNews(6),
  ]);

  return (
    <div style={{ paddingTop: 10 }}>
      <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'آخر الأخبار' }]} />

      <div className="card">
        <h1 style={{ marginTop: 0, fontSize: 24, fontFamily: 'Amiri, serif' }}>آخر الأخبار</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {CATEGORIES.map((c) => {
            const active = (c === 'الكل' && !category) || c === category;
            return (
              <Link
                key={c}
                href={c === 'الكل' ? '/news' : `/news?category=${encodeURIComponent(c)}`}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  border: '1px solid var(--line)',
                  color: active ? '#fff' : 'var(--emerald-2)',
                  background: active ? 'var(--emerald-2)' : 'transparent',
                }}
              >
                {c}
              </Link>
            );
          })}
        </div>

        {items.length === 0 && <p>لا توجد أخبار منشورة حالياً في هذا التصنيف.</p>}

        {items.map((item: (typeof items)[number], i: number) => (
          <div key={item.id}>
            <Link
              href={`/news/${item.slug}`}
              style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--paper-2)', textDecoration: 'none', color: 'var(--ink)' }}
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  width={96}
                  height={72}
                  style={{ borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                  loading="lazy"
                />
              )}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--gold)' }}>{item.category}</span>
                <div style={{ fontWeight: 700, marginTop: 2 }}>{item.title}</div>
                {item.excerpt && (
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0' }}>{item.excerpt}</p>
                )}
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {new Date(item.publishedAt).toLocaleDateString('ar-EG')}
                </div>
              </div>
            </Link>
            {i === 2 && <AdSlot format="in-feed" adUnitId="news_list_infeed_1" />}
          </div>
        ))}
      </div>

      <AdSlot format="in-feed" adUnitId="news_list_bottom" />

      <TrustedNewsFeed items={trustedNews} />
      <LatestNewsWidget items={latest} />
      <PopularNewsWidget items={popular} />
    </div>
  );
}
