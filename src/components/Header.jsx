export default function Header({ onSetup, showSetupButton }) {
  return (
    <header
      style={{
        background: 'linear-gradient(180deg, #1a0a2e 0%, #0a0a0f 100%)',
        borderBottom: '2px solid #00f3ff',
        boxShadow: '0 0 30px rgba(0,243,255,0.2)',
      }}
    >
      {/* Title row — full width, always centred */}
      <div className="flex items-center justify-center pt-3 pb-1">
        <div className="text-center">
          <h1
            className="vhs-title flicker m-0"
            style={{
              fontSize: 'clamp(26px, 7vw, 52px)',
              color: '#00f3ff',
              textShadow: '0 0 10px #00f3ff, 0 0 30px #00f3ff, 0 0 60px #00f3ff',
              letterSpacing: '4px',
              lineHeight: 1,
            }}
          >
            VIDEO VAULT
          </h1>
          <p className="vhs-title m-0" style={{ color: '#ff006e', fontSize: 'clamp(10px, 2.5vw, 14px)', letterSpacing: '6px', textShadow: '0 0 8px #ff006e' }}>
            ◆ TIME MACHINE ◆
          </p>
        </div>
      </div>

      {/* Bottom strip: dots left, button right */}
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff006e', boxShadow: '0 0 5px #ff006e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffe600', boxShadow: '0 0 5px #ffe600' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00f3ff', boxShadow: '0 0 5px #00f3ff' }} />
          </div>
          <span className="vhs-title hidden sm:inline" style={{ color: '#555', letterSpacing: '2px', fontSize: '13px' }}>
            BE KIND, REWIND
          </span>
        </div>

        <button
          onClick={onSetup}
          title="API Settings"
          className="flex items-center gap-1 px-3 py-1.5 rounded"
          style={{
            visibility: showSetupButton ? 'visible' : 'hidden',
            background: 'rgba(0,243,255,0.1)',
            border: '1px solid rgba(0,243,255,0.3)',
            color: '#00f3ff',
            cursor: 'pointer',
            fontFamily: "'VT323', monospace",
            fontSize: '15px',
            letterSpacing: '2px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,243,255,0.2)'
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,243,255,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,243,255,0.1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ⚙ <span className="hidden sm:inline">API </span>KEYS
        </button>
      </div>
    </header>
  )
}
