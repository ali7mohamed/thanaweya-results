import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getAdSlots, findAdUnitId } from '@/lib/ads';
import AdSlot from '@/components/AdSlot';
import AdStack from '@/components/AdStack';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import { RelatedNews, LatestNewsWidget, PopularNewsWidget } from '@/components/NewsWidgets';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item) return { title: 'الخبر غير موجود' };

  const description = item.excerpt || item.body.slice(0, 160);

  return {
    title: item.title,
    description,
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      type: 'article',
      publishedTime: item.publishedAt.toISOString(),
      modifiedTime: item.updatedAt.toISOString(),
      images: item.image ? [{ url: item.image }] : undefined,
    },
    twitter: {
      card: item.image ? 'summary_large_image' : 'summary',
      title: item.title,
      description,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item || !item.isPublished) notFound();

  // Fire-and-forget view count increment — never blocks rendering, never
  // touches the Result/search path, purely powers the Popular News widget.
  prisma.news
    .update({ where: { slug: item.slug }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const [related, adSlots] = await Promise.all([
    prisma.news.findMany({
      where: { isPublished: true, category: item.category, slug: { not: item.slug } },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    }),
    getAdSlots('news_article'),
  ]);

  const [latest, popular] = await Promise.all([
    prisma.news.findMany({ where: { isPublished: true, slug: { not: item.slug } }, orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.news.findMany({ where: { isPublished: true, slug: { not: item.slug } }, orderBy: { viewCount: 'desc' }, take: 5 }),
  ]);

  const articleUrl = `${SITE_URL}/news/${item.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt || item.title,
    image: item.image ? [item.image] : [`${SITE_URL}/og-default.jpg`],
    datePublished: item.publishedAt.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    articleSection: item.category,
    inLanguage: 'ar-EG',
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    author: {
      '@type': 'Organization',
      name: 'فريق التحرير - بوابة نتائج الثانوية العامة',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'نتيجة الثانوية العامة 2026',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
    },
  };

  return (
    <div style={{ paddingTop: 10 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'آخر الأخبار', href: '/news' },
          { label: item.title },
        ]}
      />

      <AdSlot format="leaderboard" adUnitId={findAdUnitId(adSlots, 'news_article_top')} />

      <article className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--gold, #d97706)' }}>
            {item.category}
          </span>
          <span style={{ fontSize: 11, color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
            تغطية تحريرية خاصة
          </span>
        </div>

        <h1 style={{ margin: '4px 0 8px', fontFamily: 'var(--font-amiri), Amiri, serif', fontSize: 'clamp(1.5rem, 4vw, 2.1rem)' }}>
          {item.title}
        </h1>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--muted, #64748b)', margin: '8px 0 16px', borderBottom: '1px solid var(--paper-2, #f1f5f9)', paddingBottom: 8 }}>
          <span>بقلم: فريق التحرير</span>
          <span>•</span>
          <time dateTime={item.publishedAt.toISOString()}>
            📅 {new Date(item.publishedAt).toLocaleDateString('ar-EG')}
          </time>
          {item.updatedAt.getTime() !== item.publishedAt.getTime() && (
            <>
              <span>•</span>
              <span>آخر تحديث: {new Date(item.updatedAt).toLocaleDateString('ar-EG')}</span>
            </>
          )}
        </div>

        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 12, margin: '8px 0 16px' }}
          />
        )}

        {(() => {
          const paragraphs = item.body.split(/\n\s*\n/);
          const firstParagraph = paragraphs[0] ?? item.body;
          const rest = paragraphs.slice(1).join('\n\n');
          return (
            <>
              <div style={{ lineHeight: 1.9, color: 'var(--ink-soft, #334155)', whiteSpace: 'pre-line', fontSize: '1.025rem' }}>
                {firstParagraph}
              </div>
              {rest && (
                <>
                  <div style={{ margin: '20px 0' }}>
                    <AdStack baseId="news_article_mid" count={2} formats={['in-feed', 'rectangle']} adSlots={adSlots} />
                  </div>
                  <div style={{ lineHeight: 1.9, color: 'var(--ink-soft, #334155)', whiteSpace: 'pre-line', fontSize: '1.025rem' }}>
                    {rest}
                  </div>
                </>
              )}
            </>
          );
        })()}

        {/* E-E-A-T Editorial Disclaimer Box */}
        <div 
          style={{ 
            marginTop: 24, 
            padding: '12px 16px', 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: 8, 
            fontSize: '0.825rem', 
            color: '#475569',
            lineHeight: 1.6
          }}
        >
          <strong>تنويه التحرير والمصادر:</strong> تتم مراجعة وتعديل المواد الإخبارية والتنسيقية المنشورة على هذا الموقع بواسطة فريق التحرير بناءً على البيانات والتصريحات الصادرة عن وزارة التربية والتعليم والتعليم الفني والجهات الرسمية المختصة.
        </div>

        <div style={{ marginTop: 16 }}>
          <ShareButtons url={articleUrl} title={item.title} />
        </div>
      </article>

      <AdStack baseId="news_article_bottom" count={3} adSlots={adSlots} />

      <RelatedNews items={related} />
      <LatestNewsWidget items={latest} />
      <PopularNewsWidget items={popular} />
    </div>
  );
}