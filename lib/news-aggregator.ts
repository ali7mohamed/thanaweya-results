import { prisma } from './db';

/**
 * AI NEWS POLICY (see README / project brief):
 * - We never generate or paraphrase-as-fact any news content.
 * - We only read PUBLIC RSS feeds published by the outlets themselves,
 *   and only keep: title, a short summary (the feed's own <description>),
 *   the source name, the original publish date, and the original URL.
 * - Every item links back to the source. Nothing is stored without a
 *   sourceUrl, and sourceUrl is unique so re-syncing never duplicates.
 * - If a feed is unreachable or returns nothing relevant, we simply skip
 *   it for this run — the page keeps serving the last successful cache
 *   from the aggregated_news table. We never fabricate a replacement.
 *
 * NOTE FOR WHOEVER DEPLOYS THIS: RSS feed URLs and item markup occasionally
 * change on the publisher's side. Verify each URL below still resolves and
 * still contains Thanaweya Amma coverage before relying on this in production —
 * this sandbox has no outbound access to these domains, so the parsing logic
 * below is written defensively (try/catch per source) but has not been
 * executed against live traffic.
 */

export type TrustedSource = {
  name: string; // Arabic display name of the outlet
  feedUrl: string; // publicly documented RSS endpoint
};

export const TRUSTED_SOURCES: TrustedSource[] = [
  { name: 'وزارة التربية والتعليم', feedUrl: 'https://moe.gov.eg/rss' },
  { name: 'اليوم السابع', feedUrl: 'https://www.youm7.com/rss/SectionRss?SectionID=65' },
  { name: 'مصراوي', feedUrl: 'https://www.masrawy.com/rss/education' },
  { name: 'الوطن', feedUrl: 'https://www.elwatannews.com/rss/education' },
  { name: 'المصري اليوم', feedUrl: 'https://www.almasryalyoum.com/rss/section/education' },
  { name: 'الشروق', feedUrl: 'https://www.shorouknews.com/rss/education.xml' },
  { name: 'الدستور', feedUrl: 'https://www.dostor.org/rss/section/1' },
];

// Only keep RSS items whose title/description clearly relates to Thanaweya Amma,
// so an outlet's general "education" feed doesn't flood the widget with
// unrelated primary/preparatory school stories.
const RELEVANCE_KEYWORDS = ['الثانوية العامة', 'ثانوية عامة', 'نتيجة الثانوية', 'تنسيق الجامعات', 'وزارة التربية'];

type ParsedItem = {
  title: string;
  summary: string;
  sourceUrl: string;
  publishedAt: Date | null;
};

function decodeEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '') // strip any inline HTML tags in description
    .trim();
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeEntities(match[1]) : null;
}

/**
 * Minimal, dependency-free RSS <item> parser. Deliberately conservative:
 * anything that doesn't clearly parse is skipped rather than guessed at.
 */
function parseRss(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const itemBlocks = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) ?? [];

  for (const block of itemBlocks) {
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const description = extractTag(block, 'description') ?? '';
    const pubDateRaw = extractTag(block, 'pubDate');

    if (!title || !link) continue;

    const haystack = `${title} ${description}`;
    const isRelevant = RELEVANCE_KEYWORDS.some((kw) => haystack.includes(kw));
    if (!isRelevant) continue;

    const parsedDate = pubDateRaw ? new Date(pubDateRaw) : null;

    items.push({
      title: title.slice(0, 300),
      summary: (description || title).slice(0, 500),
      sourceUrl: link.trim(),
      publishedAt: parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null,
    });
  }

  return items;
}

/**
 * Fetches every trusted source's RSS feed, extracts only relevant Thanaweya
 * Amma items, and upserts them into the aggregated_news cache table keyed by
 * sourceUrl. Each source is isolated in its own try/catch so one dead feed
 * never blocks the others. Returns a summary for logging/monitoring.
 */
export async function syncTrustedNews(): Promise<{
  sourcesTried: number;
  sourcesOk: number;
  itemsUpserted: number;
  errors: { source: string; message: string }[];
}> {
  let sourcesOk = 0;
  let itemsUpserted = 0;
  const errors: { source: string; message: string }[] = [];

  for (const source of TRUSTED_SOURCES) {
    try {
      const res = await fetch(source.feedUrl, {
        headers: { 'User-Agent': 'ThanaweyaResultsBot/1.0 (+https://example.com)' },
        // Short timeout via AbortSignal so one slow feed doesn't stall the whole sync.
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const items = parseRss(xml);

      for (const item of items) {
        await prisma.aggregatedNews.upsert({
          where: { sourceUrl: item.sourceUrl },
          update: {
            title: item.title,
            summary: item.summary,
            sourceName: source.name,
            publishedAt: item.publishedAt,
          },
          create: {
            title: item.title,
            summary: item.summary,
            sourceName: source.name,
            sourceUrl: item.sourceUrl,
            publishedAt: item.publishedAt,
          },
        });
        itemsUpserted++;
      }

      sourcesOk++;
    } catch (err) {
      errors.push({ source: source.name, message: err instanceof Error ? err.message : String(err) });
    }
  }

  return { sourcesTried: TRUSTED_SOURCES.length, sourcesOk, itemsUpserted, errors };
}

/**
 * Read path used by the /news page. Always reads from the cache table —
 * never calls the network directly on a page render — so a page view is
 * never slowed down (or broken) by an outlet being down. Sync happens via
 * the separate /api/news/sync route, ideally on a cron schedule.
 */
export async function getCachedTrustedNews(limit = 8) {
  return prisma.aggregatedNews.findMany({
    orderBy: [{ publishedAt: 'desc' }, { fetchedAt: 'desc' }],
    take: limit,
  });
}
