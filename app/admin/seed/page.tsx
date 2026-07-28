'use client';

import { useState } from 'react';

export default function AdminSeedPage() {
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'x-admin-secret': adminSecret },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          setMessage({ type: 'error', text: 'كلمة السر غير صحيحة.' });
        } else {
          setMessage({ type: 'error', text: data.error || 'حدث خطأ أثناء التجهيز.' });
        }
        return;
      }

      setMessage({ type: 'success', text: data.message || 'تم تجهيز البيانات بنجاح! 🚀' });
    } catch {
      setMessage({ type: 'error', text: 'تعذر الاتصال بالسيرفر.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 10, maxWidth: 480, margin: '0 auto' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.3rem', marginTop: 0 }}>تجهيز بيانات التنسيق والمرجعية</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
          الزرار ده بيملأ قاعدة البيانات ببيانات تنسيق 2025 الحقيقية، والمحافظات، والأسئلة الشائعة، وأخبار
          افتتاحية. آمن تضغطه أكتر من مرة، مش هيكرر أي بيانات.
        </p>

        <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, marginTop: 16 }}>
          كلمة سر الأدمن
        </label>
        <input
          type="password"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          placeholder="أدخل كلمة السر"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', marginBottom: 16 }}
        />

        <button
          type="button"
          onClick={handleRun}
          disabled={!adminSecret || loading}
          className="btn"
          style={{ width: '100%', opacity: !adminSecret || loading ? 0.6 : 1, cursor: !adminSecret || loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'جاري التجهيز...' : 'شغّل التجهيز الآن'}
        </button>

        {message && (
          <div
            style={{
              marginTop: 16,
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#15803d' : '#b91c1c',
              fontWeight: 600,
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
