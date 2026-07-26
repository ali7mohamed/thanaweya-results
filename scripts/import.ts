/**
 * Yearly import pipeline for the OFFICIAL ministry export format
 * ("النظام الجديد" .xlsx), matched exactly to the columns verified against
 * a real export:
 *
 *   رقم الجلوس | اسم الطالب بالعربيه | كود الشعبة | اللغة العربية |
 *   اللغة الأجنبية الأولى | مجموع الرياضيات | التاريخ | الجغرافيا |
 *   الكيمياء | الأحياء | الفيزياء | الإحصاء | المجموع الكلى |
 *   التربية الدينية | التربية القومية | اللغة الأجنبية الثانية |
 *   حالة الطالب | std_type
 *
 * Key facts about this format:
 *   - No governorate column. Pass --governorate=<slug> to tag every row in
 *     a single-governorate file with that governorate.
 *   - A subject value of -4 means "not applicable to this student's section"
 *     - it is dropped, not stored as a real score.
 *   - كود الشعبة (section code): 2 = أدبي, 4 = علمي علوم, 5 = علمي رياضة,
 *     0 = نوعيات أخرى (small subset, doesn't fit the normal % scale).
 *   - حالة الطالب (status code): 1 = ناجح, 2 = دور ثانٍ, 3 = راسب.
 *   - المجموع الكلى has no percentage column - computed here against
 *     SECTION_MAX_TOTAL (320), reverse-engineered from observed totals.
 *
 * Behavior:
 *   - Invalid rows (bad seat number, missing name, unknown section/status
 *     code, duplicate seat number) are SKIPPED and logged, not fatal.
 *   - Rows are validated, cleaned, and inserted in a single streaming pass
 *     in batches of BATCH_SIZE, so memory use stays flat regardless of
 *     whether the file has 65k or 700k+ rows.
 *   - The whole import (delete previous season + insert new one) runs in
 *     one DB transaction so the site never serves a half-imported result
 *     set, per the single-season "replace" design in prisma/schema.prisma.
 *
 * Usage:
 *   npx tsx scripts/import.ts /path/to/النظام_الجديد.xlsx
 *   npx tsx scripts/import.ts /path/to/file.xlsx --governorate=cairo
 */
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { normalizeArabic } from '../lib/normalize';
import fs from 'node:fs';

const prisma = new PrismaClient();

const NOT_APPLICABLE = -4;

const SECTION_LABELS: Record<number, string> = {
  0: 'نوعيات أخرى',
  2: 'أدبي',
  4: 'علمي علوم',
  5: 'علمي رياضة',
};

const STATUS_LABELS: Record<number, string> = {
  1: 'PASS',
  2: 'SECOND_ROUND',
  3: 'FAIL',
};

// Adjust if the ministry publishes a different official "out of" value for
// the current year. Section 0 is intentionally excluded (different scale),
// percentage stays null for it.
const SECTION_MAX_TOTAL: Record<number, number> = {
  2: 320,
  4: 320,
  5: 320,
};

// Column index -> subject label used in subjectScores JSON.
// Index matches the real file's column order (0-based).
const SUBJECT_COLUMNS: { index: number; label: string }[] = [
  { index: 3, label: 'اللغة العربية' },
  { index: 4, label: 'اللغة الأجنبية الأولى' },
  { index: 5, label: 'مجموع الرياضيات' },
  { index: 6, label: 'التاريخ' },
  { index: 7, label: 'الجغرافيا' },
  { index: 8, label: 'الكيمياء' },
  { index: 9, label: 'الأحياء' },
  { index: 10, label: 'الفيزياء' },
  { index: 11, label: 'الإحصاء' },
  { index: 13, label: 'التربية الدينية' },
  { index: 14, label: 'التربية القومية' },
  { index: 15, label: 'اللغة الأجنبية الثانية' },
];

const BATCH_SIZE = 5000;
// Max time to wait to acquire a DB connection for the transaction.
const TX_MAX_WAIT_MS = 30_000;
// Max total duration of the import transaction. Generous ceiling for
// 700k+ rows; real imports finish in minutes, this just guards against
// a genuinely stuck connection.
const TX_TIMEOUT_MS = 60 * 60 * 1000;

type BuildResult = { ok: true; data: any } | { ok: false; reason: string };

function buildRow(row: any[], governorateId: number | null): BuildResult {
  const seat = row[0];
  const name = row[1];
  const sectionCode = Number(row[2]);
  const statusCode = Number(row[16]);

  if (seat == null || !/^\d+$/.test(String(seat).trim())) {
    return { ok: false, reason: `invalid seat number "${seat}"` };
  }
  if (!name || !String(name).trim()) {
    return { ok: false, reason: 'missing student name' };
  }
  if (SECTION_LABELS[sectionCode] === undefined) {
    return { ok: false, reason: `unknown section code ${sectionCode}` };
  }
  if (STATUS_LABELS[statusCode] === undefined) {
    return { ok: false, reason: `unknown status code ${statusCode}` };
  }

  let seatNumber: bigint;
  try {
    seatNumber = BigInt(String(seat).trim());
  } catch {
    return { ok: false, reason: `seat number "${seat}" is not a valid integer` };
  }

  const totalDegree = typeof row[12] === 'number' ? row[12] : null;

  const subjectScores: Record<string, number> = {};
  for (const { index, label } of SUBJECT_COLUMNS) {
    const val = row[index];
    if (typeof val === 'number' && val !== NOT_APPLICABLE) {
      subjectScores[label] = val;
    }
  }

  const maxTotal = SECTION_MAX_TOTAL[sectionCode];
  const percentage =
    maxTotal && totalDegree != null ? Math.round((totalDegree / maxTotal) * 10000) / 100 : null;

  return {
    ok: true,
    data: {
      seatNumber,
      nameAr: String(name).trim(),
      nameNormalized: normalizeArabic(String(name)),
      governorateId,
      schoolName: null as string | null,
      section: SECTION_LABELS[sectionCode],
      sectionCode,
      totalDegree,
      percentage,
      resultStatus: STATUS_LABELS[statusCode],
      subjectScores,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args.find((a) => !a.startsWith('--'));
  const govFlag = args.find((a) => a.startsWith('--governorate='));
  const governorateSlug = govFlag ? govFlag.split('=')[1] : null;

  if (!filePath) {
    console.error('Usage: npx tsx scripts/import.ts <path-to-excel-file> [--governorate=<slug>]');
    process.exit(1);
  }
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  let governorateId: number | null = null;
  if (governorateSlug) {
    const gov = await prisma.governorate.findUnique({ where: { slug: governorateSlug } });
    if (!gov) {
      console.error(
        `Unknown governorate slug "${governorateSlug}". Run prisma/seed.ts first, or check the spelling.`
      );
      process.exit(1);
    }
    governorateId = gov.id;
    console.log(`Tagging all rows with governorate: ${gov.nameAr} (${governorateSlug})`);
  }

  console.log('Reading Excel file (this can take a while for 700k+ rows)...');
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true });

  const dataRows = rows.slice(1).filter((r) => r && r[0] != null);
  const total = dataRows.length;
  console.log(`Found ${total} student rows. Starting import...`);

  const seenSeats = new Set<string>();
  const skippedSamples: string[] = [];
  let skippedCount = 0;
  let insertedCount = 0;
  let batch: any[] = [];
  const startedAt = Date.now();

  await prisma.$transaction(
    async (tx) => {
      await tx.result.deleteMany({});

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const built = buildRow(row, governorateId);

        if (!built.ok) {
          skippedCount++;
          if (skippedSamples.length < 20) skippedSamples.push(`Row ${i + 2}: ${built.reason}`);
          continue;
        }

        const seatKey = built.data.seatNumber.toString();
        if (seenSeats.has(seatKey)) {
          skippedCount++;
          if (skippedSamples.length < 20) {
            skippedSamples.push(`Row ${i + 2}: duplicate seat number ${seatKey}`);
          }
          continue;
        }
        seenSeats.add(seatKey);
        batch.push(built.data);

        if (batch.length >= BATCH_SIZE) {
          await tx.result.createMany({ data: batch, skipDuplicates: true });
          insertedCount += batch.length;
          batch = [];
          const pct = (((i + 1) / total) * 100).toFixed(1);
          const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);
          console.log(
            `  [${pct}%] inserted ${insertedCount} / ${total} (skipped so far: ${skippedCount}) - ${elapsed}s elapsed`
          );
        }
      }

      if (batch.length > 0) {
        await tx.result.createMany({ data: batch, skipDuplicates: true });
        insertedCount += batch.length;
        console.log(`  [100%] inserted ${insertedCount} / ${total} (skipped so far: ${skippedCount})`);
      }
    },
    { timeout: TX_TIMEOUT_MS, maxWait: TX_MAX_WAIT_MS }
  );

  const totalSeconds = ((Date.now() - startedAt) / 1000).toFixed(0);
  console.log('---');
  console.log(`Import finished in ${totalSeconds}s`);
  console.log(`Inserted: ${insertedCount}`);
  console.log(`Skipped:  ${skippedCount}`);
  if (skippedSamples.length > 0) {
    console.log('Sample of skipped rows (first 20):');
    skippedSamples.forEach((s) => console.log('  - ' + s));
  }
  console.log('Reminder: run prisma/migrations/manual_trgm_index.sql once if not already applied.');
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());