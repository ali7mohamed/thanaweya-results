import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'سياسة الخصوصية', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return (
    <div className="card" style={{ marginTop: 10, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
      <h2>سياسة الخصوصية</h2>
      <p>
        نحترم خصوصية زوار الموقع. لا نقوم بجمع بيانات شخصية غير ضرورية، ونستخدم أرقام الجلوس والأسماء
        فقط لعرض نتائج الثانوية العامة العامة المتاحة من الجهات الرسمية.
      </p>
      <p>
        يستخدم هذا الموقع خدمة Google AdSense لعرض الإعلانات، والتي قد تستخدم ملفات تعريف الارتباط (Cookies)
        لعرض إعلانات مناسبة بناءً على زياراتك لهذا الموقع ومواقع أخرى. يمكنك التحكم في تفضيلات الإعلانات من
        خلال إعدادات إعلانات Google.
      </p>
      <p>لأي استفسار بخصوص الخصوصية، يمكنك التواصل معنا عبر صفحة اتصل بنا.</p>
    </div>
  );
}
