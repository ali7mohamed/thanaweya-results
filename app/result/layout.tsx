import type { Metadata } from 'next';

// Individual results contain student PII and are thin/duplicate content from
// Google's perspective - never index them. This protects AdSense compliance
// and privacy without giving up the ad revenue this page generates directly.
export const metadata: Metadata = {
  title: 'نتيجتك',
  robots: { index: false, follow: false },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
