import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Protects the admin news-authoring endpoint. The /admin/news page itself
// is reachable by anyone who knows the URL (it's only hidden from search
// engines via robots.txt, not actually access-controlled), so every write
// here must be gated on this secret or anyone could publish fake news.
//
// NOTE: credentials are hardcoded here (no Vercel env vars needed).
// If this repo is ever made public, change these immediately.
const ADMIN_USERNAME = 'ali7mohamed76';
const ADMIN_PASSWORD = 'ali7mohamed@#';

function isAuthorized(req: NextRequest): boolean {
  const username = req.headers.get('x-admin-username');
  const password = req.headers.get('x-admin-password');
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Lists all news items (published and unpublished) for the admin panel,
// newest first, so the page can render a delete/manage list.
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const items = await prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      isPublished: true,
      publishedAt: true,
    },
  });

  return NextResponse.json({ items });
}

// Deletes a single news item by slug: /api/admin/news?slug=some-slug
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'رابط الخبر (slug) مطلوب.' }, { status: 400 });
  }

  try {
    await prisma.news.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'الخبر غير موجود أصلاً.' }, { status: 404 });
    }
    console.error('==========================');
    console.error(err);
    console.error('==========================');
    return NextResponse.json(
      { error: err?.message ?? 'حدث خطأ غير متوقع أثناء الحذف.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
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