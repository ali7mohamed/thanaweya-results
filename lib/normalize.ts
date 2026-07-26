/**
 * Arabic text normalization for search.
 * Precomputed once at import time and stored in `name_normalized`
 * so it never has to run on the hot search path.
 */
export function normalizeArabic(input: string): string {
  if (!input) return '';
  return String(input)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '') // strip tashkeel + tatweel
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
