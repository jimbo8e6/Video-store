import { useState } from 'react'
import { posterUrl } from '../lib/tmdb'
import { igdbCoverUrl } from '../lib/igdb'
import WatchModal from './WatchModal'
import GameModal from './GameModal'

function VhsBack({ item, type, onWatch }) {
  const isMovie = type === 'movie'
  const overview = item.overview || item.summary || ''
  const truncated = overview.length > 300 ? overview.slice(0, 300) + '...' : overview

  const genres = (item.genres || []).map(g => g.name)
  const platforms = !isMovie ? (item.platforms || []).slice(0, 3).map(p => p.name) : []

  const rating = isMovie
    ? item.vote_average ? `${item.vote_average.toFixed(1)} / 10` : null
    : null

  const year = isMovie
    ? item.release_date?.slice(0, 4)
    : item.first_release_date
      ? new Date(item.first_release_date * 1000).getFullYear()
      : null

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        background: isMovie
          ? 'linear-gradient(180deg, #0a0a1e 0%, #050510 100%)'
          : 'linear-gradient(180deg, #1a0005 0%, #0a0005 100%)',
        border: isMovie ? '2px solid #00f3ff' : '2px solid #ff006e',
        padding: '8px',
        fontFamily: "'Special Elite', cursive",
        overflow: 'hidden',
      }}
    >
      {/* Header bar */}
      <div
        className="vhs-title text-center py-1 mb-2 flex-shrink-0"
        style={{ background: isMovie ? '#00f3ff' : '#ff006e', color: '#000', fontSize: '10px', letterSpacing: '2px' }}
      >
        {isMovie ? 'VHS · RENTAL' : 'GAME · CARTRIDGE'}
      </div>

      {/* Title */}
      <div
        className="vhs-title text-center mb-1 flex-shrink-0"
        style={{ color: isMovie ? '#00f3ff' : '#ff006e', fontSize: '13px', letterSpacing: '1px', textShadow: isMovie ? '0 0 6px #00f3ff' : '0 0 6px #ff006e', lineHeight: 1.2 }}
      >
        {item.title || item.name}
      </div>

      {year && (
        <div className="text-center mb-2 flex-shrink-0" style={{ color: '#666', fontSize: '10px', letterSpacing: '1px' }}>
          {year}
        </div>
      )}

      {/* Description */}
      <div className="flex-1 overflow-hidden" style={{ color: '#bbb', fontSize: '9.5px', lineHeight: '1.5', minHeight: 0 }}>
        {truncated || (
          <span style={{ color: '#555', fontStyle: 'italic' }}>No description available. Ask the guy behind the counter.</span>
        )}
      </div>

      {/* Genres / Platforms */}
      {(genres.length > 0 || platforms.length > 0) && (
        <div className="flex-shrink-0 mt-2 flex flex-wrap gap-1">
          {(genres.length > 0 ? genres : platforms).slice(0, 3).map(g => (
            <span
              key={g}
              className="vhs-title"
              style={{
                background: isMovie ? 'rgba(0,243,255,0.1)' : 'rgba(255,0,110,0.1)',
                border: `1px solid ${isMovie ? 'rgba(0,243,255,0.3)' : 'rgba(255,0,110,0.3)'}`,
                color: isMovie ? '#00f3ff' : '#ff006e',
                fontSize: '8px', padding: '1px 4px', borderRadius: '2px', letterSpacing: '1px',
              }}
            >
              {g.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {rating && (
        <div className="flex-shrink-0 mt-1 text-center vhs-title" style={{ color: '#ffe600', fontSize: '11px', letterSpacing: '1px' }}>
          ★ {rating}
        </div>
      )}

      {/* WHERE TO WATCH — movies only */}
      {isMovie && onWatch && (
        <button
          onClick={e => { e.stopPropagation(); onWatch() }}
          className="flex-shrink-0 mt-2 w-full vhs-title"
          style={{
            background: 'rgba(0,243,255,0.12)',
            border: '1px solid rgba(0,243,255,0.4)',
            color: '#00f3ff',
            fontSize: '10px',
            letterSpacing: '2px',
            cursor: 'pointer',
            borderRadius: '2px',
            padding: '3px 0',
            textShadow: '0 0 6px rgba(0,243,255,0.5)',
          }}
        >
          ▶ WHERE TO WATCH
        </button>
      )}

    </div>
  )
}

export default function CoverCard({ item, type, tmdbKey }) {
  const [flipped, setFlipped] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [showWatch, setShowWatch] = useState(false)
  const [showGame, setShowGame] = useState(false)

  const isMovie = type === 'movie'
  const imgSrc = isMovie ? posterUrl(item.poster_path, 'w342') : igdbCoverUrl(item.cover?.image_id)
  const title = item.title || item.name

  const handleClick = () => {
    if (isMovie) setFlipped(f => !f)
    else setShowGame(true)
  }

  return (
    <>
      <div
        className={`cover-card ${isMovie && flipped ? 'flipped' : ''}`}
        style={{ aspectRatio: '2 / 3' }}
        onClick={handleClick}
      >
        <div className="cover-inner">
          {/* FRONT */}
          <div className="cover-front">
            <div
              className="relative w-full h-full rounded overflow-hidden"
              style={{
                boxShadow: flipped ? 'none' : isMovie
                  ? '4px 4px 0 #000, 0 0 20px rgba(0,243,255,0.2)'
                  : '4px 4px 0 #000, 0 0 20px rgba(255,0,110,0.2)',
                transition: 'box-shadow 0.3s',
              }}
            >
              {imgSrc && !imgError ? (
                <img
                  src={imgSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-2"
                  style={{
                    background: isMovie ? 'linear-gradient(135deg, #0a0a2e, #1a0a3e)' : 'linear-gradient(135deg, #1a000a, #2e001a)',
                    border: isMovie ? '2px solid #00f3ff40' : '2px solid #ff006e40',
                  }}
                >
                  <div className="vhs-title text-center mt-2" style={{ color: isMovie ? '#00f3ff' : '#ff006e', fontSize: '10px', letterSpacing: '1px', lineHeight: 1.3 }}>
                    {title}
                  </div>
                </div>
              )}

              {imgSrc && !imgError && (
                <div className="absolute bottom-0 left-0 right-0 px-1 py-1" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)' }}>
                  <div className="vhs-title text-center" style={{ color: '#fff', fontSize: '9px', letterSpacing: '1px', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {title.toUpperCase()}
                  </div>
                </div>
              )}

              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200"
                style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(1px)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                <span className="vhs-title" style={{ color: '#fff', fontSize: '12px', letterSpacing: '2px', textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>
                  {isMovie ? 'READ BACK ▶' : 'PRESS START ▶'}
                </span>
              </div>
            </div>
          </div>

          {/* BACK — movies only; games use the zoom modal instead */}
          {isMovie && (
            <div className="cover-back rounded overflow-hidden">
              <VhsBack
                item={item}
                type={type}
                onWatch={tmdbKey ? () => setShowWatch(true) : null}
              />
            </div>
          )}
        </div>
      </div>

      {showWatch && (
        <WatchModal
          movie={item}
          tmdbKey={tmdbKey}
          onClose={() => setShowWatch(false)}
        />
      )}
      {showGame && (
        <GameModal game={item} onClose={() => setShowGame(false)} />
      )}
    </>
  )
}
