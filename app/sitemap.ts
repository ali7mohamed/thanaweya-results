import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

// Chunked sitemap: static pages here, news articles paginated separately
// so the file never grows unbounded as news accumulates through the season.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    '/', '/search', '/coordination', '/appeals', '/faq', '/news', '/about', '/contact', '/privacy', '/terms',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '/news' ? 'hourly' : 'daily',
    priority: path === '/' || path === '/search' ? 1 : 0.6,
  }));

  const news = await prisma.news.findMany({
    where: { isPublished: true },
    select: { slug: true, publishedAt: true },
    take: 1000,
  });

  const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: n.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...newsPages];
}
