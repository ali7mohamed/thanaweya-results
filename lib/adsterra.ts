/**
 * All Adsterra ad codes for the site live here, in one place.
 * Nothing in this file is secret — Adsterra keys are public client-side
 * values anyway (they're visible in the browser the moment an ad loads) —
 * so hardcoding them is fine and keeps deploys simple (no env vars to sync).
 */

export type AdFormat = 'leaderboard' | 'rectangle' | 'multiplex' | 'in-feed' | 'responsive' | 'anchor';

type BannerUnit = {
  kind: 'banner';
  key: string;
  width: number;
  height: number;
};

type NativeUnit = {
  kind: 'native';
  scriptSrc: string;
  containerId: string;
};

export type AdsterraUnit = BannerUnit | NativeUnit;

// ---- "Banner" units (atOptions + highperformanceformat.com invoke.js) ----
const BANNER_160x300: BannerUnit = { kind: 'banner', key: '73dbf55d9cb6afd107dd85ae3688e63b', width: 160, height: 300 };
const BANNER_320x50: BannerUnit = { kind: 'banner', key: 'e380d76fe3ce6ca088ab27fc9b0c9b25', width: 320, height: 50 };
const BANNER_728x90: BannerUnit = { kind: 'banner', key: 'e9d0e8e760df2ae6ecada0cf23296c33', width: 728, height: 90 };
const BANNER_160x600: BannerUnit = { kind: 'banner', key: '83cb32b706604d2b9d195baa9790335f', width: 160, height: 600 };
const BANNER_300x250: BannerUnit = { kind: 'banner', key: '96c0f23217bd74d064ff71c22a67bbda', width: 300, height: 250 };
const BANNER_468x60: BannerUnit = { kind: 'banner', key: '9a8d5fd986b7b538bfdb5a6b89d1474e', width: 468, height: 60 };

// ---- "Native Banner" unit (effectivecpmnetwork.com invoke.js + container div) ----
const NATIVE_BANNER: NativeUnit = {
  kind: 'native',
  scriptSrc: 'https://pl30550419.effectivecpmnetwork.com/df1c114d60ccf6d85c05cd93fba321a2/invoke.js',
  containerId: 'container-df1c114d60ccf6d85c05cd93fba321a2',
};

/**
 * Maps every AdSlot "format" used across the site to one Adsterra unit.
 * There's only one Native Banner zone, so the three feed-like formats
 * (multiplex / in-feed / responsive) all point at it — that's expected,
 * it's the same ad reused in different spots on the page.
 *
 * 160x600 and 320x50 banners aren't wired to a format below because no
 * current layout slot matches their shape; they're still exported above
 * in case a future skyscraper/mobile-sticky slot is added.
 */
export const AD_FORMAT_MAP: Record<AdFormat, AdsterraUnit> = {
  leaderboard: BANNER_728x90,
  rectangle: BANNER_300x250,
  multiplex: NATIVE_BANNER,
  'in-feed': NATIVE_BANNER,
  responsive: NATIVE_BANNER,
  anchor: BANNER_320x50,
};

/**
 * Every Adsterra unit we have a code for, in a fixed rotation. Used by
 * getAdUnits() below to fill a page with as many ad blocks as it wants —
 * there are only 7 real zones, so past 7 the same zones repeat.
 */
export const ALL_UNITS: AdsterraUnit[] = [
  BANNER_728x90,
  BANNER_300x250,
  NATIVE_BANNER,
  BANNER_468x60,
  BANNER_160x300,
  BANNER_160x600,
  BANNER_320x50,
];

/**
 * Returns `count` ad units, cycling through ALL_UNITS so a page (e.g. the
 * search or result page during results season) can request a big stack of
 * ads without hand-listing every one.
 */
export function getAdUnits(count: number): AdsterraUnit[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => ALL_UNITS[i % ALL_UNITS.length]);
}

/** Builds the raw HTML Adsterra expects for one unit, for use inside an isolated iframe. */
export function buildAdsterraHtml(unit: AdsterraUnit): string {
  if (unit.kind === 'banner') {
    const atOptions = { key: unit.key, format: 'iframe', height: unit.height, width: unit.width, params: {} };
    return `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body>
<script>atOptions = ${JSON.stringify(atOptions)};</script>
<script src="https://www.highperformanceformat.com/${unit.key}/invoke.js"></script>
</body></html>`;
  }
  return `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style></head><body>
<div id="${unit.containerId}"></div>
<script src="${unit.scriptSrc}" async></script>
</body></html>`;
}

/**
 * Site-wide units — these fire globally per page view, not into a specific
 * content slot, so they're loaded once from app/layout.tsx rather than
 * through AdSlot/AdStack.
 */
export const POPUNDER_SRC = 'https://pl30550420.effectivecpmnetwork.com/2c/96/76/2c9676200a3ab3064b2e211c578fe189.js';
export const SOCIAL_BAR_SRC = 'https://pl30550421.effectivecpmnetwork.com/be/be/f4/bebef430457a5f20cd12b2c5fc3a7f20.js';

/**
 * Smartlink is a plain URL (not a script), meant to be the href of a real
 * link/button somewhere — not something that has a natural "slot" in the
 * existing layout. It's exported here ready to use, but intentionally not
 * wired into any page yet.
 */
export const SMARTLINK_URL = 'https://www.effectivecpmnetwork.com/hz76ijaa?key=6878d8928f537e97237198ee4c3ce915';
