import { useState, useMemo } from 'react'
import { posterUrl } from '../lib/tmdb'

const SORT_OPTIONS = [
  { id: 'added',  label: 'ADDED'  },
  { id: 'az',     label: 'A – Z'  },
  { id: 'newest', label: 'NEWEST' },
  { id: 'oldest', label: 'OLDEST' },
]

export default function WatchlistModal({ watchlist, onRemove, onClose }) {
  const [sortBy, setSortBy] = useState('added')

  const sorted = useMemo(() => {
    const arr = [...watchlist]
    if (sortBy === 'az')     return arr.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'newest') return arr.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
    if (sortBy === 'oldest') return arr.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''))
    return arr
  }, [watchlist, sortBy])

  const btn = (active) => ({
    fontFamily: "'VT323', monospace",
    fontSize: '13px',
    letterSpacing: '1px',
    cursor: 'pointer',
    border: '1px solid',
    borderRadius: '3px',
    padding: '2px 7px',
    background: active ? 'rgba(255,230,0,0.15)' : 'transparent',
    borderColor: active ? '#ffe600' : '#333',
    color: active ? '#ffe600' : '#444',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a0a1e 0%, #050510 100%)',
          border: '2px solid #ffe600',
          boxShadow: '0 0 60px rgba(255,230,0,0.2)',
          animation: 'movieZoomIn 0.2s ease-out',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: 'rgba(255,230,0,0.07)', borderBottom: '1px solid rgba(255,230,0,0.2)' }}
        >
          <div>
            <div className="vhs-title" style={{ color: '#ffe600', fontSize: '20px', letterSpacing: '3px', textShadow: '0 0 8px #ffe600' }}>
              ♥ WATCH LIST
            </div>
            <div className="vhs-title" style={{ color: '#444', fontSize: '12px', letterSpacing: '2px' }}>
              {watchlist.length} {watchlist.length === 1 ? 'TITLE' : 'TITLES'}
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

        {/* Sort bar */}
        {watchlist.length > 1 && (
          <div
            className="flex items-center gap-2 px-4 py-2 flex-shrink-0 flex-wrap"
            style={{ borderBottom: '1px solid #111' }}
          >
            <span className="vhs-title" style={{ color: '#444', fontSize: '12px', letterSpacing: '2px' }}>SORT</span>
            {SORT_OPTIONS.map(o => (
              <button key={o.id} onClick={() => setSortBy(o.id)} style={btn(sortBy === o.id)}>{o.label}</button>
            ))}
          </div>
        )}

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {watchlist.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="vhs-title" style={{ color: '#222', fontSize: '20px', letterSpacing: '3px' }}>[ EMPTY ]</div>
              <p className="special-elite" style={{ color: '#444', fontSize: '12px', textAlign: 'center', lineHeight: 1.6, maxWidth: '260px' }}>
                Tap the + on any film to add it to your watch list.
              </p>
            </div>
          ) : (
            <div>
              {sorted.map((movie, i) => {
                const poster = posterUrl(movie.poster_path, 'w92')
                const year = movie.release_date?.slice(0, 4)
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null
                return (
                  <div
                    key={movie.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: i < sorted.length - 1 ? '1px solid #0f0f1a' : 'none' }}
                  >
                    {poster ? (
                      <img src={poster} alt={movie.title} className="flex-shrink-0 rounded" style={{ width: '40px', height: '60px', objectFit: 'cover', border: '1px solid rgba(0,243,255,0.2)' }} />
                    ) : (
                      <div className="flex-shrink-0 rounded" style={{ width: '40px', height: '60px', background: '#0a0a2e', border: '1px solid rgba(0,243,255,0.2)' }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="vhs-title" style={{ color: '#00f3ff', fontSize: '16px', letterSpacing: '1px', lineHeight: 1.2 }}>
                        {movie.title}
                      </div>
                      <div className="vhs-title" style={{ color: '#444', fontSize: '12px', letterSpacing: '1px' }}>
                        {year}{rating ? ` · ★ ${rating}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(movie.id)}
                      className="vhs-title flex-shrink-0"
                      style={{
                        background: 'none',
                        border: '1px solid #2a1a1a',
                        borderRadius: '3px',
                        color: '#553333',
                        fontSize: '14px',
                        padding: '3px 8px',
                        cursor: 'pointer',
                        letterSpacing: '1px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ff006e'; e.currentTarget.style.borderColor = '#ff006e' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#553333'; e.currentTarget.style.borderColor = '#2a1a1a' }}
                    >
                      WATCHED ✕
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
