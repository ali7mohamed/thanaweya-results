type Item = {
  id: number;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date | null;
};

export default function TrustedNewsFeed({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h2 style={{ marginTop: 0, fontSize: 17 }}>أخبار من مصادر موثوقة</h2>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: -6 }}>
        عناوين منقولة حرفياً مع ذكر المصدر — اضغط على أي عنوان للانتقال إلى الموقع الأصلي.
      </p>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)', borderBottom: '1px solid var(--paper-2)', paddingBottom: 12 }}
          >
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.title}</div>
            {item.summary && item.summary !== item.title && (
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0' }}>{item.summary}</p>
            )}
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              المصدر: {item.sourceName}
              {item.publishedAt ? ` — ${new Date(item.publishedAt).toLocaleDateString('ar-EG')}` : ''}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
