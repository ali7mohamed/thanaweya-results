import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="site-header">
        <span className="eyebrow">البوابة الخدمية المستقلة</span>
        <h1>نتيجة الثانوية العامة 2026</h1>
        <p className="subtitle">استعلم عن نتيجتك برقم الجلوس أو الاسم فور اعتمادها</p>
      </div>
      <nav className="main-nav" aria-label="القائمة الرئيسية">
        <Link href="/">الرئيسية</Link>
        <Link href="/search">الاستعلام عن النتيجة</Link>
        <Link href="/coordination">التنسيق المتوقع</Link>
        <Link href="/appeals">التظلمات</Link>
        <Link href="/news">آخر الأخبار</Link>
        <Link href="/faq">الأسئلة الشائعة</Link>
      </nav>
    </header>
  );
}