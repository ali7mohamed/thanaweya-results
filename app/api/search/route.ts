import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizeArabic } from '@/lib/normalize';

const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return false;
  }

  entry.count++;

  return entry.count > MAX_REQUESTS;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: 'طلبات كثيرة جداً، حاول مرة أخرى بعد دقيقة.',
      },
      {
        status: 429,
      }
    );
  }

  const { searchParams } = new URL(req.url);

  const seatParam = searchParams.get('seat')?.trim();
  const nameParam = searchParams.get('name')?.trim();

  try {
    // ======================================
    // Search By Seat Number
    // ======================================

    if (seatParam) {
      if (!/^\d+$/.test(seatParam)) {
        return NextResponse.json(
          {
            error: 'رقم الجلوس غير صحيح.',
          },
          {
            status: 400,
          }
        );
      }

      const result = await prisma.result.findUnique({
        where: {
          seatNumber: BigInt(seatParam),
        },
        include: {
          governorate: true,
        },
      });

      if (!result) {
        return NextResponse.json(
          {
            error: 'لا توجد نتيجة لهذا الرقم.',
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        result: serialize(result),
      });
    }

    // ======================================
    // Search By Name
    // ======================================

    if (nameParam) {
      if (nameParam.length < 2) {
        return NextResponse.json(
          {
            error: 'الاسم قصير جداً.',
          },
          {
            status: 400,
          }
        );
      }

      const normalized = normalizeArabic(nameParam);

      const words = normalized
        .split(/\s+/)
        .map((x) => x.trim())
        .filter(Boolean);

      let sql = `
        SELECT
          seat_number,
          name_ar,
          name_normalized
        FROM results
        WHERE
      `;

      sql += words
        .map((_, i) => `name_normalized ILIKE '%' || $${i + 1} || '%'`)
        .join(' AND ');

      sql += `
        ORDER BY
          LENGTH(name_normalized) ASC,
          seat_number ASC
        LIMIT 20
      `;

      const matches = await prisma.$queryRawUnsafe<
        {
          seat_number: bigint;
          name_ar: string;
          name_normalized: string;
        }[]
      >(sql, ...words);

      if (matches.length === 0) {
        return NextResponse.json(
          {
            error: 'لم يتم العثور على أي طالب بهذا الاسم.',
          },
          {
            status: 404,
          }
        );
      }

      if (matches.length === 1) {
        const result = await prisma.result.findUnique({
          where: {
            seatNumber: matches[0].seat_number,
          },
          include: {
            governorate: true,
          },
        });

        return NextResponse.json({
          result: serialize(result),
        });
      }

      return NextResponse.json({
        suggestions: matches.map((m) => ({
          seatNumber: m.seat_number.toString(),
          name: m.name_ar,
        })),
      });
    }

    return NextResponse.json(
      {
        error: 'أدخل رقم الجلوس أو الاسم.',
      },
      {
        status: 400,
      }
    );
  } catch (err: any) {
    console.error('==========================');
    console.error(err);
    console.error('==========================');

    return NextResponse.json(
      {
        error: err?.message ?? 'حدث خطأ غير متوقع.',
      },
      {
        status: 500,
      }
    );
  }
}

function serialize(result: any) {
  return {
    ...result,
    seatNumber: result.seatNumber.toString(),
    totalDegree: result.totalDegree?.toString() ?? null,
    percentage: result.percentage?.toString() ?? null,
  };
}