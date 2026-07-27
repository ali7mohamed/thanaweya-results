'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  'أخبار الثانوية',
  'تنسيق الكليات',
  'أدلة الطلاب',
  'التظلمات والنتائج',
  'الجامعات الأهلية والخاصة',
];

export default function AdminNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: CATEGORIES[0],
    excerpt: '',
    body: '',
    image: '',
    isPublished: true,
  });
  const [adminSecret, setAdminSecret] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // توليد slug تلقائي من العنوان
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0621-\u064A\s-]/g, '') // السماح بالكلمات العربية والحروف والأرقام
      .replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title,
      slug: generatedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('كلمة السر غير صحيحة.');
        }
        throw new Error(data.error || 'حدث خطأ أثناء حفظ الخبر');
      }

      setMessage({ type: 'success', text: 'تم حفظ ونشر الخبر بنجاح! 🚀' });
      // إعادة ضبط النموذج
      setFormData({
        title: '',
        slug: '',
        category: CATEGORIES[0],
        excerpt: '',
        body: '',
        image: '',
        isPublished: true,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'تعذر حفظ الخبر، يرجى المحاولة لاحقاً.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 850, margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-amiri), Amiri, serif', margin: 0, fontSize: '1.8rem' }}>
          📝 إضافة خبر أو مقال حصري جديد
        </h1>
        <Link href="/news" target="_blank" style={{ color: 'var(--emerald-2, #059669)', fontSize: '0.9rem', fontWeight: 600 }}>
          معاينة قسم الأخبار ↗
        </Link>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 20,
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            fontWeight: 600,
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>كلمة سر الأدمن *</label>
          <input
            type="password"
            required
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            placeholder="أدخل كلمة السر"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>عنوان الخبر الحصري *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="مثال: مؤشرات تنسيق المرحلة الأولى 2026 والكليات المتاحة للشعبتين"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>رابط الخبر (Slug) *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="مؤشرات-تنسيق-المرحلة-الأولى-2026"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', direction: 'ltr', textAlign: 'right' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>التصنيف *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>رابط صورة الخبر (اختياري)</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/images/news1.jpg"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', direction: 'ltr' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>ملخص قصير (Excerpt)</label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="موجز عن الخبر يظهر في نتائج البحث والبطاقات المخصصة..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
  <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
    محتوى الخبر التفصيلي *
  </label>

  <textarea
    rows={10}
    required
    value={formData.body}
    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
    placeholder="اكتب تفاصيل المقال هنا... استخدم الأسطر المزدوجة للفصل بين الفقرات."
    style={{
      width: '100%',
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #cbd5e1',
      lineHeight: 1.8,
    }}
  />
</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="isPublished" style={{ fontWeight: 600, cursor: 'pointer' }}>
            نشر الخبر فوراً للمستخدمين ومحركات البحث
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'var(--emerald-2, #059669)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: 8,
          }}
        >
          {loading ? 'جاري حفظ الخبر...' : 'حفظ ونشر الخبر'}
        </button>
      </form>
    </div>
  );
}