import { igdbCoverUrl } from '../lib/igdb'

export default function GameModal({ game, onClose }) {
  const title = game.name
  const year = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null
  const platforms = (game.platforms || []).map(p => p.name)
  const genres = (game.genres || []).slice(0, 5).map(g => g.name)
  const summary = game.summary || ''
  const truncated = summary.length > 500 ? summary.slice(0, 500) + '…' : summary
  const rating = game.rating ? Math.round(game.rating) : null
  const coverUrl = igdbCoverUrl(game.cover?.image_id, 'cover_big')
  const retroSearchUrl = year && year <= 1995
    ? `https://www.google.com/search?q=site:retrogames.cc+${encodeURIComponent(game.name)}`
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a000a 0%, #0a0005 100%)',
          border: '2px solid #ff006e',
          boxShadow: '0 0 60px rgba(255,0,110,0.35)',
          animation: 'gameZoomIn 0.2s ease-out',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: 'rgba(255,0,110,0.1)', borderBottom: '1px solid rgba(255,0,110,0.2)' }}
        >
          <div className="vhs-title" style={{ color: '#ff006e', fontSize: '18px', letterSpacing: '3px', textShadow: '0 0 8px #ff006e' }}>
            GAME · CARTRIDGE
          </div>
          <button
            onClick={onClose}
            className="vhs-title"
            style={{ background: 'none', border: 'none', color: '#555', fontSize: '22px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto">
          {/* Cover + meta */}
          <div className="flex gap-4 p-4">
            {coverUrl && (
              <div className="flex-shrink-0" style={{ width: '100px' }}>
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full rounded"
                  style={{
                    border: '1px solid rgba(255,0,110,0.35)',
                    boxShadow: '0 0 20px rgba(255,0,110,0.25), 4px 4px 0 #000',
                  }}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 min-w-0">
              <div
                className="vhs-title"
                style={{ color: '#ff006e', fontSize: 'clamp(14px, 4vw, 20px)', letterSpacing: '1px', textShadow: '0 0 8px #ff006e', lineHeight: 1.2 }}
              >
                {title}
              </div>

              {year && (
                <div className="vhs-title" style={{ color: '#555', fontSize: '13px', letterSpacing: '2px' }}>
                  {year}
                </div>
              )}

              {rating && (
                <div className="vhs-title" style={{ color: '#ffe600', fontSize: '14px', letterSpacing: '1px', textShadow: '0 0 6px rgba(255,230,0,0.4)' }}>
                  ★ {rating} / 100
                </div>
              )}

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {genres.map(g => (
                    <span
                      key={g}
                      className="vhs-title"
                      style={{
                        background: 'rgba(255,0,110,0.1)',
                        border: '1px solid rgba(255,0,110,0.3)',
                        color: '#ff006e',
                        fontSize: '9px', padding: '2px 5px', borderRadius: '2px', letterSpacing: '1px',
                      }}
                    >
                      {g.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}

              {platforms.length > 0 && (
                <div>
                  <div className="vhs-title mb-1" style={{ color: '#444', fontSize: '10px', letterSpacing: '3px' }}>PLATFORMS</div>
                  <div className="flex flex-wrap gap-1">
                    {platforms.map(p => (
                      <span
                        key={p}
                        className="vhs-title"
                        style={{
                          background: 'rgba(255,230,0,0.07)',
                          border: '1px solid rgba(255,230,0,0.2)',
                          color: '#ffe600',
                          fontSize: '9px', padding: '2px 5px', borderRadius: '2px', letterSpacing: '1px',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {retroSearchUrl && (
                <a
                  href={retroSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="vhs-title mt-1"
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255,0,110,0.12)',
                    border: '1px solid rgba(255,0,110,0.4)',
                    color: '#ff006e',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    borderRadius: '2px',
                    padding: '4px 8px',
                    textDecoration: 'none',
                    textShadow: '0 0 6px rgba(255,0,110,0.5)',
                  }}
                >
                  🕹 PLAY IN BROWSER
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,0,110,0.15)', margin: '0 16px' }} />

          {/* Summary */}
          <div className="px-4 py-4">
            {truncated ? (
              <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.8, fontFamily: "'Special Elite', cursive", margin: 0 }}>
                {truncated}
              </p>
            ) : (
              <p style={{ color: '#444', fontSize: '12px', fontStyle: 'italic', fontFamily: "'Special Elite', cursive", margin: 0 }}>
                No description available. Ask the guy behind the counter.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gameZoomIn {
          from { transform: scale(0.82); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
