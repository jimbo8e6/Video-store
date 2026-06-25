import { useState } from 'react'
import { posterUrl } from '../lib/tmdb'
import { igdbCoverUrl } from '../lib/igdb'
import MovieModal from './MovieModal'
import GameModal from './GameModal'

export default function CoverCard({ item, type, tmdbKey, inWatchlist, onToggleWatchlist }) {
  const [imgError, setImgError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const isMovie = type === 'movie'
  const imgSrc = isMovie ? posterUrl(item.poster_path, 'w342') : igdbCoverUrl(item.cover?.image_id)
  const title = item.title || item.name
  const glowColor = isMovie ? 'rgba(0,243,255,0.2)' : 'rgba(255,0,110,0.2)'

  return (
    <>
      <div
        style={{ aspectRatio: '2 / 3', cursor: 'pointer' }}
        onClick={() => setShowModal(true)}
      >
        <div
          className="relative w-full h-full rounded overflow-hidden"
          style={{ boxShadow: `4px 4px 0 #000, 0 0 20px ${glowColor}` }}
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
              <div
                className="vhs-title text-center mt-2"
                style={{ color: isMovie ? '#00f3ff' : '#ff006e', fontSize: '10px', letterSpacing: '1px', lineHeight: 1.3 }}
              >
                {title}
              </div>
            </div>
          )}

          {imgSrc && !imgError && (
            <div
              className="absolute bottom-0 left-0 right-0 px-1 py-1"
              style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
            >
              <div
                className="vhs-title text-center"
                style={{ color: '#fff', fontSize: '9px', letterSpacing: '1px', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
              >
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
            <span
              className="vhs-title"
              style={{ color: '#fff', fontSize: '12px', letterSpacing: '2px', textShadow: '0 0 8px rgba(255,255,255,0.5)' }}
            >
              {isMovie ? 'READ BACK ▶' : 'PRESS START ▶'}
            </span>
          </div>
        </div>
      </div>

      {showModal && isMovie && (
        <MovieModal
          movie={item}
          tmdbKey={tmdbKey}
          onClose={() => setShowModal(false)}
          inWatchlist={inWatchlist}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}
      {showModal && !isMovie && (
        <GameModal game={item} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
