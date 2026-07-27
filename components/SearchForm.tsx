'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const [seat, setSeat] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Automatically convert Eastern Arabic numerals (٠-٩) to English digits (0-9)
  function handleSeatChange(val: string) {
    const normalized = val.replace(/[٠-٩]/g, (d) => (d.charCodeAt(0) - 1632).toString());
    setSeat(normalized);
  }

  function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError('');

    const cleanSeat = seat.trim();
    const cleanName = name.trim();

    if (cleanSeat) {
      router.push(`/result?seat=${encodeURIComponent(cleanSeat)}`);
      return;
    }
    if (cleanName.length >= 2) {
      router.push(`/result?name=${encodeURIComponent(cleanName)}`);
      return;
    }
    setError('من فضلك أدخل رقم الجلوس أو اسم الطالب (حرفين على الأقل).');
  }

  return (
    <form className="card" onSubmit={submit} noValidate>
      <div className="field-group">
        <div className="field">
          <label htmlFor="seatInput">رقم الجلوس</label>
          <input
            id="seatInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="مثال: 123456"
            value={seat}
            onChange={(e) => handleSeatChange(e.target.value)}
          />
        </div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13 }} aria-hidden="true">
          أو
        </div>
        <div className="field">
          <label htmlFor="nameInput">اسم الطالب</label>
          <input
            id="nameInput"
            type="text"
            autoComplete="off"
            placeholder="اسم الطالب بالكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="btn">
        عرض النتيجة
      </button>
      {error && (
        <p className="error-msg" role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}
    </form>
  );
}