import { NextResponse } from 'next/server';
import { syncTrustedNews } from '@/lib/news-aggregator';

export const dynamic = 'force-dynamic';

/**
 * Protected refresh endpoint for the aggregated trusted-news cache.
 * Wire this up to a scheduled job (e.g. Vercel Cron every 15-30 min during
 * results season) hitting: /api/news/sync?secret=CRON_SECRET
 * It is intentionally NOT called from the /news page itself, so a slow or
 * dead outlet feed never affects a real visitor's page load.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (process.env.NEWS_SYNC_SECRET && secret !== process.env.NEWS_SYNC_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const result = await syncTrustedNews();
  return NextResponse.json(result);
}
