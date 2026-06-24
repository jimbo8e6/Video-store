import { useState } from 'react'
import { posterUrl } from '../lib/tmdb'
import WatchModal from './WatchModal'

export default function MovieModal({ movie, tmdbKey, onClose }) {
  const [showWatch, setShowWatch] = useState(false)

  const title = movie.title
  const year = movie.release_date?.slice(0, 4)
  const genres = (movie.genres || []).slice(0, 5).map(g => g.name)
  const overview = movie.overview || ''
  const truncated = overview.length > 500 ? overview.slice(0, 500) + '…' : overview
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null
  const posterSrc = posterUrl(movie.poster_path, 'w342')

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div
          className="w-full max-w-md rounded overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a0a1e 0%, #050510 100%)',
            border: '2px solid #00f3ff',
            boxShadow: '0 0 60px rgba(0,243,255,0.3)',
            animation: 'movieZoomIn 0.2s ease-out',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'rgba(0,243,255,0.08)', borderBottom: '1px solid rgba(0,243,255,0.2)' }}
          >
            <div className="vhs-title" style={{ color: '#00f3ff', fontSize: '18px', letterSpacing: '3px', textShadow: '0 0 8px #00f3ff' }}>
              VHS · RENTAL
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
            {/* Poster + meta */}
            <div className="flex gap-4 p-4">
              {posterSrc && (
                <div className="flex-shrink-0" style={{ width: '90px' }}>
                  <img
                    src={posterSrc}
                    alt={title}
                    className="w-full rounded"
                    style={{
                      border: '1px solid rgba(0,243,255,0.3)',
                      boxShadow: '0 0 20px rgba(0,243,255,0.2), 4px 4px 0 #000',
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 min-w-0">
                <div
                  className="vhs-title"
                  style={{ color: '#00f3ff', fontSize: 'clamp(14px, 4vw, 20px)', letterSpacing: '1px', textShadow: '0 0 8px #00f3ff', lineHeight: 1.2 }}
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
                    ★ {rating} / 10
                  </div>
                )}

                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {genres.map(g => (
                      <span
                        key={g}
                        className="vhs-title"
                        style={{
                          background: 'rgba(0,243,255,0.1)',
                          border: '1px solid rgba(0,243,255,0.3)',
                          color: '#00f3ff',
                          fontSize: '9px', padding: '2px 5px', borderRadius: '2px', letterSpacing: '1px',
                        }}
                      >
                        {g.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                {tmdbKey && (
                  <button
                    onClick={() => setShowWatch(true)}
                    className="vhs-title mt-1"
                    style={{
                      background: 'rgba(0,243,255,0.12)',
                      border: '1px solid rgba(0,243,255,0.4)',
                      color: '#00f3ff',
                      fontSize: '11px',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      padding: '4px 8px',
                      textShadow: '0 0 6px rgba(0,243,255,0.5)',
                      alignSelf: 'flex-start',
                    }}
                  >
                    ▶ WHERE TO WATCH
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(0,243,255,0.15)', margin: '0 16px' }} />

            {/* Overview */}
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
      </div>

      {showWatch && (
        <WatchModal movie={movie} tmdbKey={tmdbKey} onClose={() => setShowWatch(false)} />
      )}

      <style>{`
        @keyframes movieZoomIn {
          from { transform: scale(0.82); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
