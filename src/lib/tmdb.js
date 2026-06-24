const BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

// Set VITE_TMDB_API_KEY in Vercel env vars to bake the key into the build.
// Falls back to whatever the user typed into the settings modal.
export const BAKED_TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || ''

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
