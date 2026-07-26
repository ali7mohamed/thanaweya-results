import { prisma } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const revalidate = 300;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const items = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });

  const rssItems = items
    .map((item) => {
      const url = `${SITE_URL}/news/${item.slug}`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(item.excerpt || item.body.slice(0, 200))}</description>
      <category>${escapeXml(item.category)}</category>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>آخر أخبار نتيجة الثانوية العامة 2026</title>
    <link>${SITE_URL}/news</link>
    <atom:link href="${SITE_URL}/news/feed.xml" rel="self" type="application/rss+xml" />
    <description>أحدث أخبار نتيجة الثانوية العامة، التنسيق، والتظلمات</description>
    <language>ar-eg</language>${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
