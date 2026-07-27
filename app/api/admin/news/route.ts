import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Protects the admin news-authoring endpoint. The /admin/news page itself
// is reachable by anyone who knows the URL (it's only hidden from search
// engines via robots.txt, not actually access-controlled), so every write
// here must be gated on this secret or anyone could publish fake news.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'بيانات غير صالحة.' }, { status: 400 });
  }

  const { title, slug, category, excerpt, body: content, image, isPublished } = body ?? {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'عنوان الخبر مطلوب.' }, { status: 400 });
  }
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9\u0621-\u064A-]+$/i.test(slug)) {
    return NextResponse.json({ error: 'رابط الخبر (Slug) غير صالح.' }, { status: 400 });
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'محتوى الخبر مطلوب.' }, { status: 400 });
  }

  try {
    const news = await prisma.news.upsert({
      where: { slug },
      update: {
        title: title.trim(),
        category: category?.trim() || 'عام',
        excerpt: excerpt?.trim() || null,
        body: content,
        image: image?.trim() || null,
        isPublished: Boolean(isPublished),
        updatedAt: new Date(),
      },
      create: {
        slug,
        title: title.trim(),
        category: category?.trim() || 'عام',
        excerpt: excerpt?.trim() || null,
        body: content,
        image: image?.trim() || null,
        isPublished: Boolean(isPublished),
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, slug: news.slug });
  } catch (err: any) {
    console.error('==========================');
    console.error(err);
    console.error('==========================');
    return NextResponse.json(
      { error: err?.message ?? 'حدث خطأ غير متوقع أثناء الحفظ.' },
      { status: 500 }
    );
  }
}