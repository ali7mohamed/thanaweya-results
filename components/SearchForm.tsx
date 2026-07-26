'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const [seat, setSeat] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function submit() {
    setError('');
    if (seat.trim()) {
      router.push(`/result?seat=${encodeURIComponent(seat.trim())}`);
      return;
    }
    if (name.trim().length >= 2) {
      router.push(`/result?name=${encodeURIComponent(name.trim())}`);
      return;
    }
    setError('من فضلك أدخل رقم الجلوس أو اسم الطالب (حرفين على الأقل).');
  }

  return (
    <div className="card">
      <div className="field-group">
        <div className="field">
          <label htmlFor="seatInput">رقم الجلوس</label>
          <input
            id="seatInput"
            inputMode="numeric"
            placeholder="مثال: 123456"
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>أو</div>
        <div className="field">
          <label htmlFor="nameInput">اسم الطالب</label>
          <input
            id="nameInput"
            placeholder="اسم الطالب بالكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>
      </div>
      <button className="btn" onClick={submit}>
        عرض النتيجة
      </button>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
