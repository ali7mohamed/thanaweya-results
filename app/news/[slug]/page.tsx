import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
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

  const related = await prisma.news.findMany({
    where: { isPublished: true, category: item.category, slug: { not: item.slug } },
    orderBy: { publishedAt: 'desc' },
    take: 4,
  });

  const [latest, popular] = await Promise.all([
    prisma.news.findMany({ where: { isPublished: true, slug: { not: item.slug } }, orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.news.findMany({ where: { isPublished: true, slug: { not: item.slug } }, orderBy: { viewCount: 'desc' }, take: 5 }),
  ]);

  const articleUrl = `${SITE_URL}/news/${item.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt || undefined,
    image: item.image ? [item.image] : undefined,
    datePublished: item.publishedAt.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    articleSection: item.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    publisher: {
      '@type': 'Organization',
      name: 'نتيجة الثانوية العامة 2026',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
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

      <AdSlot format="leaderboard" adUnitId="news_article_top" />

      <article className="card">
        <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--gold)' }}>{item.category}</span>
        <h1 style={{ margin: '4px 0 8px', fontFamily: 'Amiri, serif' }}>{item.title}</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          {new Date(item.publishedAt).toLocaleDateString('ar-EG')}
          {item.updatedAt.getTime() !== item.publishedAt.getTime() && (
            <> — آخر تحديث: {new Date(item.updatedAt).toLocaleDateString('ar-EG')}</>
          )}
        </p>

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
              <div style={{ lineHeight: 1.9, color: 'var(--ink-soft)', whiteSpace: 'pre-line' }}>{firstParagraph}</div>
              {rest && (
                <>
                  <div style={{ margin: '16px 0' }}>
                    <AdStack baseId="news_article_mid" count={2} formats={['in-feed', 'rectangle']} />
                  </div>
                  <div style={{ lineHeight: 1.9, color: 'var(--ink-soft)', whiteSpace: 'pre-line' }}>{rest}</div>
                </>
              )}
            </>
          );
        })()}

        <ShareButtons url={articleUrl} title={item.title} />
      </article>

      <AdStack baseId="news_article_bottom" count={3} />

      <RelatedNews items={related} />
      <LatestNewsWidget items={latest} />
      <PopularNewsWidget items={popular} />
    </div>
  );
}
