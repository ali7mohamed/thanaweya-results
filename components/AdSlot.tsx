'use client';

import { useEffect, useRef } from 'react';
import { AD_FORMAT_MAP, type AdFormat } from '@/lib/adsterra';

type Props = {
  format: AdFormat;
  /** Placement label, kept for identification in markup/analytics — Adsterra's ad code is fixed per format, not per unit. */
  adUnitId: string;
  className?: string;
};

/**
 * Single reusable ad component for every placement on the site (Adsterra).
 * - Reserves layout space up front (via CSS min-height per format) to keep CLS at zero.
 * - Lazy-loads: the ad only fires once the slot scrolls into view.
 * - Every instance renders inside its own iframe. Adsterra's banner snippets rely on
 *   a page-global `atOptions` variable, and the Native Banner snippet targets a
 *   hardcoded container id — both break the moment the same snippet appears more
 *   than once on a page, which happens constantly here via AdStack. An isolated
 *   iframe gives each instance its own document, so the same zone can be reused
 *   freely across a page without id or variable collisions.
 */
export default function AdSlot({ format, adUnitId, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const unit = AD_FORMAT_MAP[format];

    const render = () => {
      if (loaded.current) return;
      loaded.current = true;

      const iframe = document.createElement('iframe');
      iframe.title = 'advertisement';
      iframe.scrolling = 'no';
      iframe.style.border = '0';
      iframe.style.display = 'block';

      if (unit.kind === 'banner') {
        iframe.width = String(unit.width);
        iframe.height = String(unit.height);
        iframe.style.maxWidth = '100%';
        const atOptions = { key: unit.key, format: 'iframe', height: unit.height, width: unit.width, params: {} };
        iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body>
<script>atOptions=${JSON.stringify(atOptions)};</script>
<script src="https://www.highperformanceformat.com/${unit.key}/invoke.js"></script>
</body></html>`;
      } else {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0}</style></head><body>
<div id="${unit.containerId}"></div>
<script async data-cfasync="false" src="${unit.scriptSrc}"></script>
</body></html>`;
      }

      el.appendChild(iframe);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            render();
            observer.disconnect();
          }
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [format]);

  return <div className={`ad-slot ${className ?? ''}`} data-format={format} data-ad-id={adUnitId} ref={ref} />;
}
