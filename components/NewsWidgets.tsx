import Link from 'next/link';

type NewsItem = {
  slug: string;
  title: string;
  publishedAt: Date;
  viewCount?: number;
};

function NewsListWidget({ title, items }: { title: string; items: NewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h2 style={{ marginTop: 0, fontSize: 17 }}>{title}</h2>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, i) => (
          <li key={item.slug} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--paper-2)' }}>
            <span style={{ color: 'var(--gold)', fontWeight: 800, minWidth: 18 }}>{i + 1}</span>
            <Link href={`/news/${item.slug}`} style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 700, fontSize: 14.5 }}>
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LatestNewsWidget({ items }: { items: NewsItem[] }) {
  return <NewsListWidget title="آخر الأخبار" items={items} />;
}

export function PopularNewsWidget({ items }: { items: NewsItem[] }) {
  return <NewsListWidget title="الأكثر قراءة" items={items} />;
}

export function RelatedNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h2 style={{ marginTop: 0, fontSize: 17 }}>أخبار ذات صلة</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/news/${item.slug}`}
            style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)' }}
          >
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
              {new Date(item.publishedAt).toLocaleDateString('ar-EG')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
