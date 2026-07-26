import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { POPUNDER_SRC, SOCIAL_BAR_SRC } from '@/lib/adsterra';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'نتيجة الثانوية العامة 2026 - استعلم عن نتيجتك فوراً',
    template: '%s | نتيجة الثانوية العامة 2026',
  },
  description:
    'استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو الاسم، بالإضافة إلى التنسيق المتوقع وآخر الأخبار وطريقة التظلم.',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'نتيجة الثانوية العامة 2026',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="application/rss+xml" title="آخر أخبار نتيجة الثانوية العامة" href="/news/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'نتيجة الثانوية العامة 2026',
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Adsterra site-wide units: fire once per page view, not tied to a content slot. */}
        <Script src={POPUNDER_SRC} strategy="afterInteractive" />
        <Script src={SOCIAL_BAR_SRC} strategy="afterInteractive" />
      </head>
      <body>
        <div className="container">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
