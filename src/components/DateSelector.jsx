import { useState } from 'react'

const QUICK_DATES = [
  { label: 'SUMMER \'86', date: '1986-07-04', desc: 'Aliens, Top Gun, Ferris Bueller' },
  { label: 'XMAS \'93', date: '1993-12-25', desc: 'Jurassic Park, Schindler\'s List' },
  { label: 'NEW YEAR \'97', date: '1997-01-01', desc: 'Space Jam, Jerry Maguire' },
  { label: 'SUMMER \'99', date: '1999-08-01', desc: 'Blair Witch, Sixth Sense era' },
]

const TODAY = new Date().toISOString().slice(0, 10)

export default function DateSelector({ onSelectDate }) {
  const [date, setDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (date) onSelectDate(date)
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
      style={{ paddingTop: '60px' }}
    >
      {/* VHS cassette decoration */}
      <div className="mb-12 flex flex-col items-center">
        <div
          className="relative"
          style={{
            width: '200px',
            height: '120px',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
            border: '3px solid #333',
            borderRadius: '8px',
            boxShadow: '0 0 40px rgba(0,243,255,0.15), inset 0 0 20px rgba(0,0,0,0.8)',
          }}
        >
          {/* tape window */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '50px',
              background: '#0a0a0a',
              border: '2px solid #444',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 16px',
            }}
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid #555', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
            </div>
            <div style={{ width: '28px', height: '4px', background: '#1a1a1a', borderRadius: '2px' }} />
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid #555', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
            </div>
          </div>
          {/* label */}
          <div
            className="vhs-title"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              fontSize: '11px',
              color: '#00f3ff',
              letterSpacing: '3px',
              textShadow: '0 0 8px #00f3ff',
            }}
          >
            SELECT YOUR ERA
          </div>
        </div>
      </div>

      <h2
        className="vhs-title text-center mb-2"
        style={{ color: '#ffe600', fontSize: '32px', letterSpacing: '4px', textShadow: '0 0 10px #ffe600' }}
      >
        STEP INTO THE PAST
      </h2>
      <p
        className="text-center mb-10"
        style={{ color: '#888', fontSize: '14px', letterSpacing: '2px', fontFamily: "'VT323', monospace" }}
      >
        CHOOSE A DATE — WE'LL STOCK THE SHELVES
      </p>

      {/* Date form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
        <div className="w-full">
          <div className="vhs-title text-center mb-2" style={{ color: '#555', fontSize: '13px', letterSpacing: '3px' }}>
            PICK A DATE
          </div>
          <input
            type="date"
            value={date}
            min="1970-01-01"
            max={TODAY}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-3 text-center vhs-title"
            style={{
              background: '#0a0a1a',
              border: '2px solid #00f3ff',
              borderRadius: '4px',
              color: date ? '#00f3ff' : '#2a4a5a',
              fontSize: '28px',
              letterSpacing: '4px',
              boxShadow: '0 0 20px rgba(0,243,255,0.2), inset 0 0 10px rgba(0,243,255,0.05)',
              outline: 'none',
              colorScheme: 'dark',
            }}
          />
          <div className="vhs-title text-center mt-2" style={{ color: '#2a3a4a', fontSize: '12px', letterSpacing: '2px' }}>
            {date ? '' : 'YYYY – MM – DD'}
          </div>
        </div>

        <button
          type="submit"
          disabled={!date}
          className="w-full py-4 vhs-title transition-all duration-200"
          style={{
            background: date ? 'linear-gradient(135deg, #ff006e, #a0003a)' : '#1a1a2e',
            border: '2px solid',
            borderColor: date ? '#ff006e' : '#333',
            color: date ? '#fff' : '#444',
            fontSize: '24px',
            letterSpacing: '4px',
            cursor: date ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            boxShadow: date ? '0 0 20px rgba(255,0,110,0.4)' : 'none',
            textShadow: date ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
          }}
        >
          ▶ ENTER THE STORE
        </button>
      </form>

      {/* Quick dates */}
      <div className="mt-12 w-full max-w-2xl">
        <p className="text-center vhs-title mb-4" style={{ color: '#555', fontSize: '16px', letterSpacing: '4px' }}>
          — OR PICK A CLASSIC —
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_DATES.map(q => (
            <button
              key={q.date}
              onClick={() => onSelectDate(q.date)}
              className="p-4 text-left transition-all duration-200 rounded"
              style={{
                background: 'rgba(255,230,0,0.05)',
                border: '1px solid rgba(255,230,0,0.2)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,230,0,0.12)'
                e.currentTarget.style.borderColor = 'rgba(255,230,0,0.5)'
                e.currentTarget.style.boxShadow = '0 0 12px rgba(255,230,0,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,230,0,0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,230,0,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="vhs-title" style={{ color: '#ffe600', fontSize: '20px', letterSpacing: '2px' }}>
                {q.label}
              </div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: '4px', fontFamily: "'Special Elite', cursive" }}>
                {q.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
