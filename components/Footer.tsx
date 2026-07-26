import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/about">من نحن</Link>
        <Link href="/contact">اتصل بنا</Link>
        <Link href="/privacy">سياسة الخصوصية</Link>
        <Link href="/terms">الشروط والأحكام</Link>
      </div>
      <p style={{ marginTop: 12 }}>
        هذا الموقع خدمة مستقلة لمساعدة الطلاب على الاستعلام عن نتائجهم، وغير تابع لوزارة التربية والتعليم.
      </p>
    </footer>
  );
}
