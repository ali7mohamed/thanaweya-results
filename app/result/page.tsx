'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';

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
          setError(data.error || 'لم يتم العثور على نتيجة متطابقة مع البيانات الموضحة.');
          setState('error');
        }
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم، من فضلك حاول مرة أخرى.');
        setState('error');
      });
  }, [seat, name, router]);

  if (state === 'loading') {
    return (
      <div 
        style={{ textAlign: 'center', padding: '60px 0' }} 
        role="status" 
        aria-live="polite"
      >
        <p style={{ fontSize: '1.1rem', color: 'var(--muted, #64748b)' }}>جاري البحث عن النتيجة في قاعدة البيانات...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: 20 }} role="alert">
        <p className="error-msg" style={{ margin: '0 0 16px', fontSize: '1rem' }}>{error}</p>
        
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>
          تأكد من كتابة رقم الجلوس الصحيح باللغة العربية أو الإنجليزية. إذا لم تكن النتائج قد أُعلنت رسمياً بعد، يرجى متابعة الأخبار لحين اعتماد الكشوف.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/search" className="btn" style={{ margin: 0 }}>
            إعادة البحث
          </Link>
          <Link href="/news" className="btn ghost" style={{ margin: 0 }}>
            متابعة أخبار النتيجة
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'suggestions') {
    return (
      <div className="card" style={{ marginTop: 20 }}>
        <p style={{ marginBottom: 16, fontWeight: 600 }}>
          يوجد أكثر من نتيجة بهذا الاسم، اختر اسم الطالب ورقم الجلوس الصحيح:
        </p>
        <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {suggestions.map((s) => (
            <Link
              key={s.seatNumber}
              href={`/result?seat=${s.seatNumber}`}
              role="listitem"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid var(--paper-2, #e2e8f0)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--ink, #0f172a)',
                backgroundColor: '#ffffff',
                transition: 'background-color 0.2s',
              }}
            >
              <span style={{ fontWeight: 500 }}>{s.name}</span>
              <span style={{ color: 'var(--muted, #64748b)', direction: 'ltr', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                {s.seatNumber}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Found: this is the money page. Every section below naturally leads
  // to another page (coordination, colleges, news, appeals, faq) to lift
  // pages-per-session without clickbait, per the AdSense-first architecture.
  return (
    <div style={{ paddingTop: 20 }}>
      {/* Result Card Component */}
      <ResultCard result={result} />

      {/* Utility Actions (Print / Save Result) */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button 
          onClick={() => window.print()} 
          className="btn ghost"
          style={{ cursor: 'pointer', fontSize: '0.9rem' }}
        >
          🖨️ طباعة أو حفظ بطاقة النتيجة (PDF)
        </button>
      </div>

      {/* E-E-A-T Official Transcript Disclaimer */}
      <div 
        className="card" 
        style={{ 
          marginTop: 16, 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          fontSize: '0.825rem',
          color: '#475569',
          lineHeight: '1.6'
        }}
      >
        <strong>تنويه هام:</strong> هذه النتيجة مستخرجة إلكترونياً من القوائم المعلنة. وتعتبر واستمارة النجاح الورقية المسلمة من المدرسة المقيد بها الطالب هي الوثيقة الرسمية المعتمدة لاستكمال إجراءات التنسيق الجامعي.
      </div>

      {/* Next Steps Guidance */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0, fontSize: '1.15rem' }}>الخطوات التالية المتاحة للطالب</h3>
        <p style={{ color: 'var(--ink-soft, #334155)', lineHeight: 1.8, fontSize: '0.925rem' }}>
          بناءً على نسبتك ({result.percentage ?? '—'}%)، يمكنك الآن معرفة الكليات والمؤهلات المتاحة لك في التنسيق الجامعي المتوقع، أو الاطلاع على مواعيد التظلمات ورسوم المواد.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link 
            href={`/coordination?section=${encodeURIComponent(result.section || '')}&percentage=${result.percentage ?? ''}`} 
            className="btn" 
            style={{ margin: 0, flex: '1 1 200px' }}
          >
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