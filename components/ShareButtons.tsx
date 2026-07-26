'use client';

import { useState } from 'react';

type Props = {
  url: string; // full absolute URL of the article
  title: string;
};

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: 'واتساب', href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'فيسبوك', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '18px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>مشاركة:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--emerald-2)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '6px 14px',
            textDecoration: 'none',
          }}
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // clipboard unavailable — no-op, button just won't confirm
          }
        }}
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--ink-soft)',
          border: '1px solid var(--line)',
          borderRadius: 999,
          padding: '6px 14px',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        {copied ? 'تم النسخ ✓' : 'نسخ الرابط'}
      </button>
    </div>
  );
}
