import { useState } from 'react'

export default function ApiSetup({ initialKeys, onSave, onClose }) {
  const [keys, setKeys] = useState(initialKeys)

  const handleSave = () => {
    onSave(keys)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg p-8 rounded"
        style={{
          background: '#0a0a1a',
          border: '2px solid #00f3ff',
          boxShadow: '0 0 60px rgba(0,243,255,0.3)',
        }}
      >
        <h2 className="vhs-title mb-6 text-center" style={{ color: '#00f3ff', fontSize: '28px', letterSpacing: '4px', textShadow: '0 0 10px #00f3ff' }}>
          ⚙ API CONFIGURATION
        </h2>

        <div className="space-y-6">
          {/* TMDB */}
          <div>
            <label className="block vhs-title mb-2" style={{ color: '#ffe600', fontSize: '16px', letterSpacing: '2px' }}>
              TMDB API KEY <span style={{ color: '#ff006e' }}>*</span>
            </label>
            <p className="text-xs mb-2" style={{ color: '#666', fontFamily: "'Special Elite', cursive" }}>
              Free at themoviedb.org → Settings → API. Used for all movie data & posters.
            </p>
            <input
              type="text"
              placeholder="Enter your TMDB API key..."
              value={keys.tmdb}
              onChange={e => setKeys(k => ({ ...k, tmdb: e.target.value }))}
              className="w-full px-3 py-2"
              style={{
                background: '#050510',
                border: '1px solid #00f3ff',
                color: '#e0e0e0',
                fontFamily: 'monospace',
                fontSize: '13px',
                borderRadius: '3px',
                outline: 'none',
              }}
            />
          </div>

          {/* RAWG */}
          <div>
            <label className="block vhs-title mb-2" style={{ color: '#ff006e', fontSize: '16px', letterSpacing: '2px' }}>
              IGDB / TWITCH CREDENTIALS <span style={{ color: '#666', fontSize: '12px' }}>(optional)</span>
            </label>
            <p className="text-xs mb-2" style={{ color: '#666', fontFamily: "'Special Elite', cursive" }}>
              Free at dev.twitch.tv — create an app to get Client ID + Secret. Used for game covers.
            </p>
            <input
              type="text"
              placeholder="Twitch Client ID..."
              value={keys.igdb_client || ''}
              onChange={e => setKeys(k => ({ ...k, igdb_client: e.target.value }))}
              className="w-full px-3 py-2 mb-2"
              style={{
                background: '#050510',
                border: '1px solid #ff006e',
                color: '#e0e0e0',
                fontFamily: 'monospace',
                fontSize: '13px',
                borderRadius: '3px',
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Twitch Client Secret..."
              value={keys.igdb_secret || ''}
              onChange={e => setKeys(k => ({ ...k, igdb_secret: e.target.value }))}
              className="w-full px-3 py-2"
              style={{
                background: '#050510',
                border: '1px solid #ff006e',
                color: '#e0e0e0',
                fontFamily: 'monospace',
                fontSize: '13px',
                borderRadius: '3px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 vhs-title"
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#666',
              fontSize: '18px',
              letterSpacing: '2px',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 vhs-title"
            style={{
              background: 'linear-gradient(135deg, #00f3ff22, #00f3ff11)',
              border: '1px solid #00f3ff',
              color: '#00f3ff',
              fontSize: '18px',
              letterSpacing: '2px',
              cursor: 'pointer',
              borderRadius: '3px',
              boxShadow: '0 0 20px rgba(0,243,255,0.2)',
              textShadow: '0 0 8px #00f3ff',
            }}
          >
            ▶ SAVE & LOAD
          </button>
        </div>

        <p className="text-center mt-4" style={{ color: '#333', fontSize: '11px', fontFamily: 'monospace' }}>
          Keys stored in your browser's localStorage only. Never sent anywhere else.
        </p>
      </div>
    </div>
  )
}
