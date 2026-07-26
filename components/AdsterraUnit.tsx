'use client';

import { useEffect, useRef, useState } from 'react';
import { buildAdsterraHtml, type AdsterraUnit as UnitConfig } from '@/lib/adsterra';

type Props = {
  unit: UnitConfig;
  className?: string;
};

/**
 * Renders one Adsterra unit inside a sandboxed iframe (srcDoc), which is
 * what lets the same page hold many banner instances at once: each
 * `atOptions` global and each invoke.js only ever runs inside its own
 * iframe document, so they never clash with each other.
 *
 * Lazy-loads via IntersectionObserver — the iframe isn't created until the
 * slot scrolls near the viewport, so stacking a lot of these doesn't block
 * the initial page load.
 */
export default function AdsterraUnit({ unit, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  const isBanner = unit.kind === 'banner';
  const width = isBanner ? unit.width : undefined;
  const height = isBanner ? unit.height : 250;

  return (
    <div
      ref={ref}
      className={`ad-slot ${className ?? ''}`}
      style={{
        width: width ? Math.min(width, 340) : '100%',
        maxWidth: width ?? undefined,
        height,
        margin: '0 auto',
      }}
    >
      {visible && (
        <iframe
          title="ad"
          srcDoc={buildAdsterraHtml(unit)}
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          scrolling="no"
        />
      )}
    </div>
  );
}
