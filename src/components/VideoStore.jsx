import { useEffect, useState, useMemo } from 'react'
import { fetchMoviesByDate, BAKED_TMDB_KEY } from '../lib/tmdb'
import { fetchGamesByDate } from '../lib/igdb'
import CoverCard from './CoverCard'
import { format, parseISO } from 'date-fns'

const SORT_OPTIONS = [
  { id: 'popular', label: 'POPULAR' },
  { id: 'az',      label: 'A – Z'   },
  { id: 'newest',  label: 'NEWEST'  },
  { id: 'oldest',  label: 'OLDEST'  },
]

function sortMovies(movies, sortBy) {
  const arr = [...movies]
  if (sortBy === 'az')      return arr.sort((a, b) => a.title.localeCompare(b.title))
  if (sortBy === 'newest')  return arr.sort((a, b) => b.release_date.localeCompare(a.release_date))
  if (sortBy === 'oldest')  return arr.sort((a, b) => a.release_date.localeCompare(b.release_date))
  return arr.sort((a, b) => b.popularity - a.popularity)
}

function sortGames(games, sortBy) {
  const arr = [...games]
  if (sortBy === 'az')      return arr.sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy === 'newest')  return arr.sort((a, b) => (b.first_release_date || 0) - (a.first_release_date || 0))
  if (sortBy === 'oldest')  return arr.sort((a, b) => (a.first_release_date || 0) - (b.first_release_date || 0))
  return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
}

function FilterBar({ sortBy, onSort, filmsFirst, onToggleOrder }) {
  const btn = (active) => ({
    fontFamily: "'VT323', monospace",
    fontSize: '15px',
    letterSpacing: '2px',
    cursor: 'pointer',
    border: '1px solid',
    borderRadius: '3px',
    padding: '4px 10px',
    transition: 'all 0.15s',
    background: active ? 'rgba(255,230,0,0.15)' : 'transparent',
    borderColor: active ? '#ffe600' : '#333',
    color: active ? '#ffe600' : '#555',
    boxShadow: active ? '0 0 8px rgba(255,230,0,0.3)' : 'none',
  })

  const toggleStyle = (active) => ({
    fontFamily: "'VT323', monospace",
    fontSize: '15px',
    letterSpacing: '2px',
    cursor: 'pointer',
    border: '1px solid',
    borderRadius: '3px',
    padding: '4px 10px',
    transition: 'all 0.15s',
    background: active ? 'rgba(0,243,255,0.12)' : 'transparent',
    borderColor: active ? '#00f3ff' : '#333',
    color: active ? '#00f3ff' : '#555',
    boxShadow: active ? '0 0 8px rgba(0,243,255,0.25)' : 'none',
  })

  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid #1a1a2e',
      }}
    >
      {/* Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="vhs-title" style={{ color: '#444', fontSize: '13px', letterSpacing: '3px' }}>SORT</span>
        <div className="flex gap-1 flex-wrap">
          {SORT_OPTIONS.map(o => (
            <button key={o.id} onClick={() => onSort(o.id)} style={btn(sortBy === o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#222' }} className="hidden sm:block" />

      {/* Order toggle */}
      <div className="flex items-center gap-2">
        <span className="vhs-title" style={{ color: '#444', fontSize: '13px', letterSpacing: '3px' }}>SHOW</span>
        <div className="flex gap-1">
          <button onClick={() => onToggleOrder(true)}  style={toggleStyle(filmsFirst)}>📼 FILMS</button>
          <button onClick={() => onToggleOrder(false)} style={toggleStyle(!filmsFirst)}>🕹 GAMES</button>
        </div>
      </div>
    </div>
  )
}

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

function Shelf({ items, type, loading, loadingLabel, error, noKeyMessage, onSetup, sortBy, sorter }) {
  const sorted = useMemo(() => sorter(items, sortBy), [items, sortBy, sorter])
  const isMovie = type === 'movie'
  const color = isMovie ? '#00f3ff' : '#ff006e'
  const label = isMovie ? '▶ VHS · MOVIES' : '▶ GAMES'
  const tapeDividerClass = isMovie ? '' : 'game-tape-divider'

  return (
    <>
      <SectionLabel text={label} color={color} tapeDividerClass={tapeDividerClass} />
      {!onSetup && noKeyMessage ? (
        <EmptyShelf message={noKeyMessage} />
      ) : noKeyMessage ? (
        <EmptyShelf message={noKeyMessage} onSetup={onSetup} />
      ) : loading ? (
        <LoadingReel label={loadingLabel} />
      ) : error ? (
        <EmptyShelf message={`Could not load: ${error}`} />
      ) : sorted.length === 0 ? (
        <EmptyShelf message="Nothing found for this date range." />
      ) : (
        <div className="shelf-row px-4 py-6">
          <div
            className="grid gap-2 sm:gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
          >
            {sorted.map(item => (
              <CoverCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default function VideoStore({ date, apiKeys, serverConfig, onBack, onSetup }) {
  const [movies, setMovies] = useState([])
  const [games, setGames] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [gamesLoading, setGamesLoading] = useState(false)
  const [moviesError, setMoviesError] = useState(null)
  const [sortBy, setSortBy] = useState('popular')
  const [filmsFirst, setFilmsFirst] = useState(true)

  const displayDate = format(parseISO(date), 'MMMM d, yyyy')
  const tmdbKey = apiKeys.tmdb || BAKED_TMDB_KEY
  const hasIgdb = !!(serverConfig?.igdbConfigured || apiKeys.igdb_client)

  useEffect(() => {
    if (!tmdbKey) return
    setMoviesLoading(true)
    setMoviesError(null)
    fetchMoviesByDate(tmdbKey, date)
      .then(setMovies)
      .catch(e => setMoviesError(e.message))
      .finally(() => setMoviesLoading(false))
  }, [date, tmdbKey])

  useEffect(() => {
    if (!hasIgdb) return
    setGamesLoading(true)
    fetchGamesByDate(apiKeys.igdb_client || '', apiKeys.igdb_secret || '', date)
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setGamesLoading(false))
  }, [date, hasIgdb, apiKeys.igdb_client, apiKeys.igdb_secret])

  const movieShelf = (
    <Shelf
      key="movies"
      items={movies}
      type="movie"
      loading={moviesLoading}
      loadingLabel="REWINDING TAPES..."
      error={moviesError}
      noKeyMessage={!tmdbKey ? "Add your free TMDB API key to browse the movie shelves." : null}
      onSetup={!tmdbKey ? onSetup : null}
      sortBy={sortBy}
      sorter={sortMovies}
    />
  )

  const gameShelf = (
    <Shelf
      key="games"
      items={games}
      type="game"
      loading={gamesLoading}
      loadingLabel="LOADING CARTRIDGES..."
      noKeyMessage={!hasIgdb ? "Add your Twitch Client ID and Secret to browse the games section." : null}
      onSetup={!hasIgdb ? onSetup : null}
      sortBy={sortBy}
      sorter={sortGames}
    />
  )

  return (
    <div>
      {/* Store banner */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #0a1a2e 100%)',
          borderBottom: '1px solid #1a1a3a',
        }}
      >
        <button
          onClick={onBack}
          className="vhs-title flex items-center gap-1 px-3 sm:px-4 py-2 rounded"
          style={{
            background: 'rgba(255,0,110,0.1)',
            border: '1px solid rgba(255,0,110,0.4)',
            color: '#ff006e',
            fontSize: 'clamp(13px, 3.5vw, 18px)',
            letterSpacing: '2px',
            cursor: 'pointer',
          }}
        >
          ◀ <span className="hidden sm:inline">CHANGE </span>DATE
        </button>

        <div className="text-center">
          <div className="vhs-title" style={{ color: '#ffe600', fontSize: 'clamp(10px, 2.5vw, 14px)', letterSpacing: '4px', textShadow: '0 0 8px #ffe600' }}>
            YOU ARE BROWSING
          </div>
          <div className="vhs-title" style={{ color: '#fff', fontSize: 'clamp(16px, 4.5vw, 28px)', letterSpacing: '2px' }}>
            {displayDate.toUpperCase()}
          </div>
        </div>

        <div className="vhs-title text-right hidden sm:block" style={{ color: '#555', fontSize: '13px', letterSpacing: '2px', lineHeight: 1.8 }}>
          <div>BE KIND</div>
          <div>REWIND</div>
        </div>
        {/* Spacer on mobile to keep date centred */}
        <div className="sm:hidden w-16" />
      </div>

      {/* Filter bar */}
      <FilterBar
        sortBy={sortBy}
        onSort={setSortBy}
        filmsFirst={filmsFirst}
        onToggleOrder={setFilmsFirst}
      />

      {filmsFirst ? [movieShelf, gameShelf] : [gameShelf, movieShelf]}

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
