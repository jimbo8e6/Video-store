export default function Header({ onSetup }) {
  return (
    <header
      className="relative flex items-center justify-between px-6 py-4"
      style={{
        background: 'linear-gradient(180deg, #1a0a2e 0%, #0a0a0f 100%)',
        borderBottom: '2px solid #00f3ff',
        boxShadow: '0 0 30px rgba(0,243,255,0.2)',
      }}
    >
      {/* Left: rewind icon */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff006e', boxShadow: '0 0 6px #ff006e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#ffe600', boxShadow: '0 0 6px #ffe600' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#00f3ff', boxShadow: '0 0 6px #00f3ff' }} />
        </div>
        <span className="vhs-title text-lg" style={{ color: '#666', letterSpacing: '2px' }}>
          BE KIND, REWIND
        </span>
      </div>

      {/* Center: title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1
          className="vhs-title flicker m-0"
          style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            color: '#00f3ff',
            textShadow: '0 0 10px #00f3ff, 0 0 30px #00f3ff, 0 0 60px #00f3ff',
            letterSpacing: '4px',
            lineHeight: 1,
          }}
        >
          VIDEO VAULT
        </h1>
        <p className="vhs-title m-0" style={{ color: '#ff006e', fontSize: '14px', letterSpacing: '6px', textShadow: '0 0 8px #ff006e' }}>
          ◆ TIME MACHINE ◆
        </p>
      </div>

      {/* Right: settings */}
      <button
        onClick={onSetup}
        title="API Settings"
        className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-200"
        style={{
          background: 'rgba(0,243,255,0.1)',
          border: '1px solid rgba(0,243,255,0.3)',
          color: '#00f3ff',
          cursor: 'pointer',
          fontFamily: "'VT323', monospace",
          fontSize: '16px',
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
        ⚙ API KEYS
      </button>
    </header>
  )
}
