import { NextRequest, NextResponse } from 'next/server';
import { runSeed } from '@/prisma/seed';

// One-time trigger to populate reference data (governorates, 2025 coordination
// figures, ad slot placeholders, FAQ, starter news) into whichever database
// DATABASE_URL points to at runtime. Runs inside Vercel's own environment,
// so nobody needs to see or copy the (Sensitive) DATABASE_URL value to use it.
// Safe to call more than once — every write inside runSeed() is an upsert or
// a scoped delete+recreate, so re-running never creates duplicates.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    await runSeed();
    return NextResponse.json({ success: true, message: 'تم تجهيز البيانات بنجاح.' });
  } catch (err: any) {
    console.error('==========================');
    console.error(err);
    console.error('==========================');
    return NextResponse.json(
      { error: err?.message ?? 'حدث خطأ غير متوقع أثناء التجهيز.' },
      { status: 500 }
    );
  }
}
