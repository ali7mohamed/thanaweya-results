import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.href ? (
              <Link href={item.href} style={{ color: 'var(--emerald-2)', textDecoration: 'none', fontWeight: 600 }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{item.label}</span>
            )}
            {i < items.length - 1 && <span style={{ color: 'var(--line)' }}>/</span>}
          </span>
        ))}
      </nav>
    </>
  );
}
