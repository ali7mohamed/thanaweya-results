'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import AdsterraUnit from '@/components/AdsterraUnit';
import AdsterraBreak from '@/components/AdsterraBreak';
import { AD_FORMAT_MAP } from '@/lib/adsterra';

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const seat = params.get('seat');
  const name = params.get('name');

  const [state, setState] = useState<'loading' | 'found' | 'suggestions' | 'error'>('loading');
  const [result, setResult] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!seat && !name) {
      router.replace('/search');
      return;
    }
    setState('loading');
    const qs = seat ? `seat=${encodeURIComponent(seat)}` : `name=${encodeURIComponent(name!)}`;
    fetch(`/api/search?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.result) {
          setResult(data.result);
          setState('found');
        } else if (data.suggestions) {
          setSuggestions(data.suggestions);
          setState('suggestions');
        } else {
          setError(data.error || 'حدث خطأ.');
          setState('error');
        }
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم، من فضلك حاول مرة أخرى.');
        setState('error');
      });
  }, [seat, name, router]);

  if (state === 'loading') {
    return <p style={{ textAlign: 'center', padding: '60px 0' }}>جارِ البحث عن النتيجة...</p>;
  }

  if (state === 'error') {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="error-msg" style={{ margin: '0 0 16px' }}>{error}</p>
        <Link href="/search" className="btn ghost" style={{ display: 'inline-block' }}>
          العودة للبحث
        </Link>
      </div>
    );
  }

  if (state === 'suggestions') {
    return (
      <div className="card">
        <p style={{ marginBottom: 16 }}>يوجد أكثر من نتيجة بهذا الاسم، اختر رقم الجلوس الصحيح:</p>
        {suggestions.map((s) => (
          <Link
            key={s.seatNumber}
            href={`/result?seat=${s.seatNumber}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--paper-2)',
              textDecoration: 'none',
              color: 'var(--ink)',
            }}
          >
            <span>{s.name}</span>
            <span style={{ color: 'var(--muted)', direction: 'ltr' }}>{s.seatNumber}</span>
          </Link>
        ))}
      </div>
    );
  }

  // Found: this is the money page. Every section below naturally leads
  // to another page (coordination, colleges, news, appeals, faq) to lift
  // pages-per-session without clickbait, per the AdSense-first architecture.
  return (
    <div style={{ paddingTop: 20 }}>
      <AdsterraUnit unit={AD_FORMAT_MAP.leaderboard} />
      <ResultCard result={result} />
      <AdsterraUnit unit={AD_FORMAT_MAP['in-feed']} />

      {/* Exam-season ad wall #1, between the result and the "next step" card. */}
      <AdsterraBreak count={9} />

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>الخطوة التالية</h3>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>
          بناءً على نسبتك ({result.percentage ?? '—'}%)، يمكنك الآن معرفة الكليات المتاحة لك في التنسيق،
          أو متابعة آخر التحديثات حول نتيجة هذا العام.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href={`/coordination?section=${result.section}&percentage=${result.percentage ?? ''}`} className="btn" style={{ margin: 0, flex: '1 1 200px' }}>
            التنسيق المتوقع للكليات
          </Link>
          <Link href="/news" className="btn ghost" style={{ margin: 0, flex: '1 1 200px' }}>
            آخر أخبار النتيجة
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <Link href="/appeals" className="btn ghost" style={{ margin: 0, flex: '1 1 200px' }}>
            التقدم بتظلم على النتيجة
          </Link>
          <Link href="/faq" className="btn ghost" style={{ margin: 0, flex: '1 1 200px' }}>
            الأسئلة الشائعة
          </Link>
        </div>
      </div>

      <AdsterraUnit unit={AD_FORMAT_MAP.rectangle} />
      {/* Exam-season ad wall #2, at the bottom of the page. */}
      <AdsterraBreak count={10} />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<p style={{ textAlign: 'center', padding: '60px 0' }}>جارِ التحميل...</p>}>
      <ResultContent />
    </Suspense>
  );
}
