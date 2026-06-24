const BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

// Set VITE_TMDB_API_KEY in Vercel env vars to bake the key into the build.
// Falls back to whatever the user typed into the settings modal.
export const BAKED_TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || ''

export function detectCountry() {
  const lang = navigator.language || navigator.languages?.[0] || ''
  const parts = lang.split('-')
  if (parts.length >= 2) return parts[parts.length - 1].toUpperCase()
  const map = { en: 'US', fr: 'FR', de: 'DE', es: 'ES', it: 'IT', pt: 'BR', nl: 'NL', sv: 'SE', da: 'DK', no: 'NO', fi: 'FI', pl: 'PL', ja: 'JP', ko: 'KR', zh: 'CN' }
  return map[parts[0]] || 'US'
}

export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  53: 'Thriller', 10752: 'War', 37: 'Western',
}

export async function fetchWatchProviders(apiKey, movieId) {
  const key = apiKey || BAKED_TMDB_KEY
  if (!key) return null
  const country = detectCountry()
  const res = await fetch(`${BASE}/movie/${movieId}/watch/providers?api_key=${key}`)
  if (!res.ok) return null
  const data = await res.json()
  const result = data.results?.[country] || null
  // If nothing for detected country, fall back to US
  if (!result && country !== 'US') return data.results?.['US'] || null
  return result
}

export const providerLogoUrl = (path) =>
  path ? `${IMG_BASE}/w92${path}` : null

export const posterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null

export async function fetchMoviesByDate(apiKey, dateStr) {
  const key = apiKey || BAKED_TMDB_KEY
  if (!key) return []

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formatted = `${year}-${month}-${day}`

  const params = new URLSearchParams({
    api_key: key,
    sort_by: 'popularity.desc',
    'primary_release_date.lte': formatted,
    'primary_release_date.gte': `${year - 2}-01-01`,
    'vote_count.gte': '50',
    page: '1',
  })

  const res = await fetch(`${BASE}/discover/movie?${params}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  const data = await res.json()

  const params2 = new URLSearchParams({ ...Object.fromEntries(params), page: '2' })
  const res2 = await fetch(`${BASE}/discover/movie?${params2}`)
  const data2 = res2.ok ? await res2.json() : { results: [] }

  const all = [...(data.results || []), ...(data2.results || [])]
  return all.filter(m => m.poster_path).slice(0, 40)
}
