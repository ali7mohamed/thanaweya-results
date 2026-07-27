import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, category, excerpt, body: newsBody, image, isPublished } = body;

    if (!title || !slug || !category || !newsBody) {
      return NextResponse.json({ error: 'جميع الحقول الأساسية مطلوبة' }, { status: 400 });
    }

    const newArticle = await prisma.news.create({
      data: {
        title,
        slug,
        category,
        excerpt: excerpt || null,
        body: newsBody,
        image: image || null,
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'فشل حفظ الخبر في قاعدة البيانات' }, { status: 500 });
  }
}