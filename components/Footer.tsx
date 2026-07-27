import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <Link href="/about">من نحن</Link>
        <Link href="/contact">اتصل بنا</Link>
        <Link href="/privacy">سياسة الخصوصية</Link>
        <Link href="/terms">الشروط والأحكام</Link>
        <Link href="/disclaimer">إخلاء المسؤولية</Link>
      </div>
      <p style={{ marginTop: 12 }}>
        هذا الموقع خدمة مستقلة لمساعدة الطلاب على الاستعلام عن نتائجهم، وغير تابع لوزارة التربية والتعليم والتعليم الفني المصرية.
      </p>
      <p style={{ marginTop: 6, opacity: 0.85, fontSize: '0.85em' }}>
        جميع الحقوق محفوظة © {currentYear} - نتيجة الثانوية العامة
      </p>
    </footer>
  );
}