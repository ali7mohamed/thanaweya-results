import type { Metadata } from 'next';
import Script from 'next/script';
import { Tajawal, Amiri } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'نتيجة الثانوية العامة 2026 - استعلم عن نتيجتك فوراً',
    template: '%s | نتيجة الثانوية العامة 2026',
  },
  description:
    'استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو الاسم، بالإضافة إلى التنسيق المتوقع وآخر الأخبار وطريقة التظلم.',
  keywords: [
    'نتيجة الثانوية العامة',
    'نتيجة الثانوية العامة 2026',
    'نتيجة تالتة ثانوي',
    'استعلام برقم الجلوس',
    'تنسيق الكليات 2026',
    'تظلمات الثانوية العامة',
  ],
  authors: [{ name: 'فريق بوابة نتائج الثانوية العامة' }],
  publisher: 'بوابة نتائج الثانوية العامة المصرية',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: SITE_URL,
    siteName: 'نتيجة الثانوية العامة 2026',
    title: 'نتيجة الثانوية العامة 2026 - استعلم عن نتيجتك فوراً',
    description:
      'استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو الاسم، بالإضافة إلى التنسيق المتوقع وآخر الأخبار وطريقة التظلم.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نتيجة الثانوية العامة 2026',
    description: 'استعلم عن نتيجة الثانوية العامة 2026 برقم الجلوس أو الاسم بأسرع وأسهل طريقة.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'نتيجة الثانوية العامة 2026',
        description: 'منصة الاستعلام المباشر عن نتيجة الثانوية العامة المصرية وتنسيق الكليات',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'ar-EG',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'نتيجة الثانوية العامة 2026',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.ico`,
        description: 'منصة إخبارية وإرشادية مستقلة متخصصة في مستجدات ونتائج الثانوية العامة المصرية',
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${amiri.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="آخر أخبار نتيجة الثانوية العامة" href="/news/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        {/* Google AdSense site-ownership verification / Auto ads script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6930529333819978"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={tajawal.className}>
        <div className="container">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}