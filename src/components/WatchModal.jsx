import { useEffect, useState } from 'react'
import { fetchWatchProviders, providerLogoUrl } from '../lib/tmdb'

function ProviderLogo({ p }) {
  return (
    <a
      href="#"
      title={p.provider_name}
      onClick={e => e.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
    >
      <img
        src={providerLogoUrl(p.logo_path)}
        alt={p.provider_name}
        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
      />
      <span style={{ color: '#888', fontSize: '8px', fontFamily: "'VT323', monospace", letterSpacing: '1px', textAlign: 'center', maxWidth: '44px', lineHeight: 1.2 }}>
        {p.provider_name}
      </span>
    </a>
  )
}

function ProviderGroup({ label, color, providers }) {
  if (!providers?.length) return null
  return (
    <div className="mb-4">
      <div className="vhs-title mb-2" style={{ color, fontSize: '12px', letterSpacing: '3px' }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-3">
        {providers.map(p => <ProviderLogo key={p.provider_id} p={p} />)}
      </div>
    </div>
  )
}

export default function WatchModal({ movie, tmdbKey, onClose }) {
  const [providers, setProviders] = useState(undefined) // undefined = loading
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWatchProviders(tmdbKey, movie.id)
      .then(setProviders)
      .catch(() => setError(true))
  }, [movie.id, tmdbKey])

  const hasAny = providers && (providers.flatrate?.length || providers.rent?.length || providers.buy?.length)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a0a1e 0%, #050510 100%)',
          border: '2px solid #00f3ff',
          boxShadow: '0 0 60px rgba(0,243,255,0.25)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(0,243,255,0.08)', borderBottom: '1px solid rgba(0,243,255,0.2)' }}
        >
          <div>
            <div className="vhs-title" style={{ color: '#00f3ff', fontSize: '18px', letterSpacing: '3px', textShadow: '0 0 8px #00f3ff' }}>
              WHERE TO WATCH
            </div>
            <div className="special-elite" style={{ color: '#666', fontSize: '11px', lineHeight: 1.3 }}>
              {movie.title}
              {movie.release_date && <span style={{ color: '#444' }}> · {movie.release_date.slice(0, 4)}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="vhs-title"
            style={{ background: 'none', border: 'none', color: '#555', fontSize: '22px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {providers === undefined && !error && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div style={{ width: '160px', height: '3px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                <div className="loading-bar" style={{ height: '100%', background: 'linear-gradient(90deg, #00f3ff, #ff006e)', borderRadius: '2px' }} />
              </div>
              <span className="vhs-title" style={{ color: '#444', fontSize: '14px', letterSpacing: '3px' }}>SCANNING CHANNELS...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8 special-elite" style={{ color: '#555' }}>
              Couldn't reach the listings. Try again later.
            </div>
          )}

          {providers !== undefined && !error && !hasAny && (
            <div className="text-center py-6">
              <div className="vhs-title mb-2" style={{ color: '#333', fontSize: '16px', letterSpacing: '3px' }}>[ NOT AVAILABLE ]</div>
              <p className="special-elite" style={{ color: '#555', fontSize: '12px', lineHeight: 1.6 }}>
                Not currently streaming or available to buy in your region.
              </p>
              {providers?.link && (
                <a
                  href={providers.link}
                  target="_blank"
                  rel="noreferrer"
                  className="vhs-title"
                  style={{ color: '#00f3ff', fontSize: '12px', letterSpacing: '2px', textDecoration: 'none' }}
                >
                  CHECK JUSTWATCH ▶
                </a>
              )}
            </div>
          )}

          {hasAny && (
            <>
              <ProviderGroup label="▶ STREAMING" color="#00f3ff" providers={providers.flatrate} />
              <ProviderGroup label="▶ RENT"      color="#ffe600" providers={providers.rent} />
              <ProviderGroup label="▶ BUY"       color="#ff006e" providers={providers.buy} />

              {providers.link && (
                <a
                  href={providers.link}
                  target="_blank"
                  rel="noreferrer"
                  className="vhs-title flex items-center justify-center gap-2 mt-2 py-2 rounded"
                  style={{
                    background: 'rgba(0,243,255,0.06)',
                    border: '1px solid rgba(0,243,255,0.2)',
                    color: '#00f3ff',
                    fontSize: '13px',
                    letterSpacing: '2px',
                    textDecoration: 'none',
                  }}
                >
                  SEE ALL OPTIONS ON JUSTWATCH ▶
                </a>
              )}
            </>
          )}
        </div>

        {/* Footer credit */}
        <div
          className="text-center py-2"
          style={{ borderTop: '1px solid #0a0a1a' }}
        >
          <span style={{ color: '#222', fontSize: '10px', fontFamily: 'monospace' }}>
            Streaming data by JustWatch via TMDB
          </span>
        </div>
      </div>
    </div>
  )
}
