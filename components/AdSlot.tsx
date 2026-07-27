'use client';

import { useEffect, useRef } from 'react';

type Props = {
  format: 'leaderboard' | 'rectangle' | 'multiplex' | 'in-feed' | 'responsive' | 'anchor';
  adUnitId: string | null | undefined;
  className?: string;
};

/**
 * Single reusable ad component for every placement on the site.
 * - Reserves layout space up front (via CSS min-height per format) to keep CLS at zero.
 * - Lazy-loads: only pushes to adsbygoogle once the slot is in view.
 * - Ad locations can change per-page without touching this component or business logic,
 *   because placement/format/unit-id all come from the ad_slots table, not hardcoded here.
 */
export default function AdSlot({ format, adUnitId, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !adUnitId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !loaded.current) {
            loaded.current = true;
            try {
              // @ts-ignore - adsbygoogle is injected by the AdSense script in layout.tsx
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              // AdSense not yet available (e.g. local dev) - fail silently, never break UX.
            }
            observer.disconnect();
          }
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!adUnitId || !client) return null;

  return (
    <div className={`ad-slot ${className ?? ''}`} data-format={format} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={client}
        data-ad-slot={adUnitId}
        data-ad-format={format === 'in-feed' || format === 'multiplex' ? 'fluid' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
