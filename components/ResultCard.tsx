'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Governorate = { nameAr: string };
type ResultData = {
  seatNumber: string;
  nameAr: string;
  section: string;
  totalDegree: string | null;
  percentage: string | null;
  resultStatus: string;
  schoolName: string | null;
  governorate: Governorate | null;
  subjectScores: Record<string, number> | null;
};

const STATUS_LABELS: Record<string, string> = {
  PASS: 'ناجح',
  FAIL: 'راسب',
  SECOND_ROUND: 'دور ثانٍ',
};

// Cosmetic-only display label overrides — does not touch the underlying
// subjectScores keys (which come straight from scripts/import.ts).
const SUBJECT_LABEL_OVERRIDES: Record<string, string> = {
  'مجموع الرياضيات': 'الرياضيات',
};

// Core subjects that make up the total, in ministry column order, with their
// official max mark (see scripts/import.ts SUBJECT_COLUMNS). A subject
// missing from subjectScores means it wasn't scheduled for this student's
// section (stored value was -4 / NOT_APPLICABLE at import time).
const CORE_SUBJECTS: { key: string; max: number }[] = [
  { key: 'اللغة العربية', max: 80 },
  { key: 'اللغة الأجنبية الأولى', max: 60 },
  { key: 'مجموع الرياضيات', max: 60 },
  { key: 'التاريخ', max: 60 },
  { key: 'الجغرافيا', max: 60 },
  { key: 'الكيمياء', max: 60 },
  { key: 'الأحياء', max: 60 },
  { key: 'الفيزياء', max: 60 },
  { key: 'الإحصاء', max: 60 },
];

// Pass/fail-only subjects — not counted in the total.
const PASS_FAIL_SUBJECTS: { key: string; max: number }[] = [
  { key: 'التربية الدينية', max: 25 },
  { key: 'التربية القومية', max: 25 },
  { key: 'اللغة الأجنبية الثانية', max: 40 },
];

// Sections that use the standard 320-mark total (see SECTION_MAX_TOTAL in
// scripts/import.ts). Others ("نوعيات أخرى") have no published denominator.
const SECTION_MAX_TOTAL: Record<string, number> = {
  'أدبي': 320,
  'علمي علوم': 320,
  'علمي رياضة': 320,
};

export default function ResultCard({ result }: { result: ResultData }) {
  const statusLabel = STATUS_LABELS[result.resultStatus] ?? result.resultStatus;
  const statusColor =
    result.resultStatus === 'FAIL'
      ? 'var(--maroon)'
      : result.resultStatus === 'PASS'
      ? 'var(--emerald-2)'
      : 'var(--gold)';

  const percentageNum = result.percentage ? parseFloat(result.percentage) : null;
  const maxTotal = SECTION_MAX_TOTAL[result.section] ?? null;
  const scores = result.subjectScores ?? {};

  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressFraction =
    percentageNum != null ? Math.min(Math.max(percentageNum, 0), 100) / 100 : 0;
  const dashOffset = circumference * (1 - (animate ? progressFraction : 0));

  const hasCoreSection = CORE_SUBJECTS.some(({ key }) => scores[key] !== undefined);
  const passFailRows = PASS_FAIL_SUBJECTS.filter(({ key }) => scores[key] !== undefined);

  return (
    <div className="card result-card" role="region" aria-label="نتيجة الطالب">
      <div className="rc-header">
        <h2 className="rc-name">{result.nameAr}</h2>
        <div className="rc-badges">
          <span className="rc-badge">رقم الجلوس: {result.seatNumber}</span>
          <span className="rc-badge">الشعبة: {result.section}</span>
          <span className="rc-badge" style={{ color: statusColor, borderColor: statusColor }}>
            الحالة: {statusLabel}
          </span>
        </div>
      </div>

      <div className="rc-summary">
        <div className="rc-ring-wrap">
          <svg viewBox="0 0 160 160" className="rc-ring">
            <circle cx="80" cy="80" r={radius} className="rc-ring-track" />
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="rc-ring-progress"
              style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
            />
          </svg>
          <div className="rc-ring-label">{percentageNum != null ? `${percentageNum}%` : '—'}</div>
        </div>

        <div className="rc-total">
          <div className="rc-total-value">
            {result.totalDegree ?? '—'}
            {maxTotal ? <span className="rc-total-max"> / {maxTotal}</span> : null}
          </div>
          <div className="rc-total-label">المجموع الكلي</div>
        </div>
      </div>

      {hasCoreSection && (
        <div className="rc-section">
          <h3 className="rc-section-title">المواد الأساسية المكوّنة للمجموع</h3>
          <table className="rc-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}>المادة</th>
                <th>الدرجة</th>
                <th>من</th>
                <th style={{ width: '35%' }}>النسبة</th>
              </tr>
            </thead>
            <tbody>
              {CORE_SUBJECTS.map(({ key, max }) => {
                const score = scores[key];
                const scheduled = score !== undefined;
                const pct = scheduled ? Math.min((score / max) * 100, 100) : 0;
                return (
                  <tr key={key}>
                    <td style={{ textAlign: 'right' }}>{SUBJECT_LABEL_OVERRIDES[key] ?? key}</td>
                    <td>{scheduled ? score : <span className="rc-na">غير مقرر</span>}</td>
                    <td>{scheduled ? max : '—'}</td>
                    <td>
                      {scheduled && (
                        <div className="rc-bar-track">
                          <div className="rc-bar-fill" style={{ width: animate ? `${pct}%` : '0%' }} />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {passFailRows.length > 0 && (
        <div className="rc-section">
          <h3 className="rc-section-title">مواد النجاح والرسوب (غير محتسبة في المجموع)</h3>
          <table className="rc-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}>المادة</th>
                <th>الدرجة</th>
                <th>من</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {passFailRows.map(({ key, max }) => {
                const score = scores[key];
                const passed = score / max >= 0.5;
                return (
                  <tr key={key}>
                    <td style={{ textAlign: 'right' }}>{key}</td>
                    <td>{score}</td>
                    <td>{max}</td>
                    <td>
                      <span className={`rc-pill ${passed ? 'rc-pill-pass' : 'rc-pill-fail'}`}>
                        {passed ? 'ناجح' : 'راسب'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/search" className="btn rc-search-btn">
        بحث عن نتيجة أخرى
      </Link>

      <style jsx>{`
        .result-card {
          overflow: hidden;
        }
        .rc-header {
          text-align: center;
          margin-bottom: 28px;
          animation: rcFadeSlide 0.5s ease both;
        }
        .rc-name {
          font-family: 'Amiri', serif;
          font-weight: 700;
          font-size: clamp(26px, 5vw, 40px);
          margin: 0 0 14px;
          color: var(--ink);
        }
        .rc-badges {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .rc-badge {
          display: inline-block;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--paper-2);
          color: var(--ink-soft);
          font-size: 13.5px;
          font-weight: 700;
        }
        .rc-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(24px, 6vw, 64px);
          flex-wrap: wrap;
          padding: 20px 0 30px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 26px;
          animation: rcFadeSlide 0.6s ease 0.1s both;
        }
        .rc-ring-wrap {
          position: relative;
          width: 160px;
          height: 160px;
        }
        .rc-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .rc-ring-track {
          fill: none;
          stroke: var(--paper-2);
          stroke-width: 14;
        }
        .rc-ring-progress {
          fill: none;
          stroke: var(--gold);
          stroke-width: 14;
          stroke-linecap: round;
          transition: stroke-dashoffset 1.1s cubic-bezier(0.22, 0.9, 0.3, 1);
        }
        .rc-ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: var(--ink);
        }
        .rc-total {
          text-align: center;
        }
        .rc-total-value {
          font-size: clamp(36px, 6vw, 54px);
          font-weight: 700;
          color: var(--emerald);
          line-height: 1;
        }
        .rc-total-max {
          font-size: 20px;
          color: var(--muted);
          font-weight: 700;
        }
        .rc-total-label {
          margin-top: 8px;
          font-size: 13.5px;
          color: var(--muted);
          font-weight: 700;
        }
        .rc-section {
          margin-bottom: 30px;
          animation: rcFadeSlide 0.6s ease 0.15s both;
        }
        .rc-section-title {
          font-size: 16px;
          color: var(--emerald-2);
          margin: 0 0 14px;
          font-weight: 700;
        }
        .rc-table {
          width: 100%;
          border-collapse: collapse;
        }
        .rc-table th {
          text-align: center;
          font-size: 12.5px;
          color: var(--muted);
          font-weight: 700;
          padding: 8px 6px;
          border-bottom: 2px solid var(--line);
        }
        .rc-table td {
          text-align: center;
          padding: 12px 6px;
          border-bottom: 1px solid var(--paper-2);
          font-weight: 600;
          color: var(--ink);
        }
        .rc-na {
          color: var(--muted);
          font-weight: 600;
          font-size: 13px;
        }
        .rc-bar-track {
          height: 8px;
          border-radius: 999px;
          background: var(--paper-2);
          overflow: hidden;
        }
        .rc-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          transition: width 1s cubic-bezier(0.22, 0.9, 0.3, 1);
        }
        .rc-pill {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
        }
        .rc-pill-pass {
          background: var(--emerald-glow);
          color: var(--emerald);
        }
        .rc-pill-fail {
          background: rgba(124, 32, 32, 0.12);
          color: var(--maroon);
        }
        .rc-search-btn {
          margin-top: 10px;
          text-align: center;
          text-decoration: none;
        }

        @keyframes rcFadeSlide {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .rc-summary {
            gap: 24px;
          }
          .rc-ring-wrap {
            width: 130px;
            height: 130px;
          }
          .rc-table th,
          .rc-table td {
            font-size: 13px;
            padding: 8px 4px;
          }
        }
      `}</style>
    </div>
  );
}
