import { useEffect, useState } from 'react'
import { fetchMoviesByDate } from '../lib/tmdb'
import { fetchGamesByDate } from '../lib/igdb'
import CoverCard from './CoverCard'
import { format, parseISO } from 'date-fns'

function SectionLabel({ text, color, tapeDividerClass }) {
  return (
    <div className="mb-0">
      <div className={`tape-divider ${tapeDividerClass || ''}`} />
      <div
        className="flex items-center gap-4 px-6 py-4"
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
      >
        <h2
          className="vhs-title m-0"
          style={{ color, fontSize: '32px', letterSpacing: '6px', textShadow: `0 0 12px ${color}` }}
        >
          {text}
        </h2>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${color}40, transparent)` }} />
      </div>
    </div>
  )
}

function LoadingReel({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="flex gap-8">
        {[0, 1].map(i => (
          <div
            key={i}
            className="relative flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              border: '4px solid #333',
              borderRadius: '50%',
              animation: `spin ${i === 0 ? '1.2s' : '0.8s'} linear infinite`,
            }}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1a1a2e', border: '3px solid #444' }} />
            {[0, 120, 240].map(deg => (
              <div
                key={deg}
                style={{
                  position: 'absolute',
                  width: '3px',
                  height: '16px',
                  background: '#555',
                  borderRadius: '2px',
                  transform: `rotate(${deg}deg) translateY(-16px)`,
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="vhs-title" style={{ color: '#00f3ff', fontSize: '22px', letterSpacing: '4px', textShadow: '0 0 10px #00f3ff' }}>
        {label}
      </div>
      <div style={{ width: '240px', height: '4px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
        <div className="loading-bar" style={{ height: '100%', background: 'linear-gradient(90deg, #00f3ff, #ff006e)', borderRadius: '2px' }} />
      </div>
    </div>
  )
}

function EmptyShelf({ message, onSetup }) {
  return (
    <div className="flex flex-col items-center py-16 gap-4">
      <div className="vhs-title" style={{ color: '#333', fontSize: '20px', letterSpacing: '3px' }}>
        [ NO TAPES FOUND ]
      </div>
      <p className="special-elite" style={{ color: '#555', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
        {message}
      </p>
      {onSetup && (
        <button
          onClick={onSetup}
          className="mt-4 px-6 py-2 vhs-title"
          style={{
            background: 'transparent',
            border: '1px solid #00f3ff',
            color: '#00f3ff',
            fontSize: '16px',
            letterSpacing: '2px',
            cursor: 'pointer',
            borderRadius: '3px',
          }}
        >
          ⚙ ADD API KEY
        </button>
      )}
    </div>
  )
}

export default function VideoStore({ date, apiKeys, onBack, onSetup }) {
  const [movies, setMovies] = useState([])
  const [games, setGames] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [gamesLoading, setGamesLoading] = useState(false)
  const [moviesError, setMoviesError] = useState(null)

  const displayDate = format(parseISO(date), 'MMMM d, yyyy')

  useEffect(() => {
    if (!apiKeys.tmdb) return
    setMoviesLoading(true)
    setMoviesError(null)
    fetchMoviesByDate(apiKeys.tmdb, date)
      .then(setMovies)
      .catch(e => setMoviesError(e.message))
      .finally(() => setMoviesLoading(false))
  }, [date, apiKeys.tmdb])

  useEffect(() => {
    if (!apiKeys.igdb_client || !apiKeys.igdb_secret) return
    setGamesLoading(true)
    fetchGamesByDate(apiKeys.igdb_client, apiKeys.igdb_secret, date)
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setGamesLoading(false))
  }, [date, apiKeys.igdb_client, apiKeys.igdb_secret])

  return (
    <div>
      {/* Store banner */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #0a1a2e 100%)',
          borderBottom: '1px solid #1a1a3a',
        }}
      >
        <button
          onClick={onBack}
          className="vhs-title flex items-center gap-2 px-4 py-2 rounded"
          style={{
            background: 'rgba(255,0,110,0.1)',
            border: '1px solid rgba(255,0,110,0.4)',
            color: '#ff006e',
            fontSize: '18px',
            letterSpacing: '2px',
            cursor: 'pointer',
          }}
        >
          ◀ CHANGE DATE
        </button>

        <div className="text-center">
          <div className="vhs-title" style={{ color: '#ffe600', fontSize: '14px', letterSpacing: '4px', textShadow: '0 0 8px #ffe600' }}>
            YOU ARE BROWSING
          </div>
          <div className="vhs-title" style={{ color: '#fff', fontSize: '28px', letterSpacing: '2px' }}>
            {displayDate.toUpperCase()}
          </div>
        </div>

        <div className="vhs-title text-right" style={{ color: '#555', fontSize: '13px', letterSpacing: '2px', lineHeight: 1.8 }}>
          <div>BE KIND</div>
          <div>REWIND</div>
        </div>
      </div>

      {/* MOVIES SECTION */}
      <SectionLabel text="▶ VHS · MOVIES" color="#00f3ff" />

      {!apiKeys.tmdb ? (
        <EmptyShelf
          message="Add your free TMDB API key to browse the movie shelves. It only takes a minute to sign up."
          onSetup={onSetup}
        />
      ) : moviesLoading ? (
        <LoadingReel label="REWINDING TAPES..." />
      ) : moviesError ? (
        <EmptyShelf message={`Could not load movies: ${moviesError}`} />
      ) : movies.length === 0 ? (
        <EmptyShelf message="No movies found for this date range. Try a different date." />
      ) : (
        <div className="shelf-row px-4 py-6">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
          >
            {movies.map(movie => (
              <CoverCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        </div>
      )}

      {/* GAMES SECTION */}
      <SectionLabel text="▶ GAMES" color="#ff006e" tapeDividerClass="game-tape-divider" />

      {!apiKeys.igdb_client || !apiKeys.igdb_secret ? (
        <EmptyShelf
          message="Add your free Twitch/IGDB credentials to browse the games section. Great for retro classics."
          onSetup={onSetup}
        />
      ) : gamesLoading ? (
        <LoadingReel label="LOADING CARTRIDGES..." />
      ) : games.length === 0 ? (
        <EmptyShelf message="No games found for this date range." />
      ) : (
        <div className="shelf-row px-4 py-6">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
          >
            {games.map(game => (
              <CoverCard key={game.id} item={game} type="game" />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="text-center py-8 mt-8"
        style={{ borderTop: '1px solid #1a1a1a' }}
      >
        <div className="vhs-title" style={{ color: '#222', fontSize: '14px', letterSpacing: '4px' }}>
          ◆ PLEASE REWIND YOUR TAPES ◆
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
