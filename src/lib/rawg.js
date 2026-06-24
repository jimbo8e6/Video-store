const BASE = 'https://api.rawg.io/api'

export async function fetchGamesByDate(apiKey, dateStr) {
  if (!apiKey) return []

  const toDate = dateStr
  const from = new Date(dateStr)
  from.setFullYear(from.getFullYear() - 2)
  const fromDate = from.toISOString().slice(0, 10)

  const params = new URLSearchParams({
    key: apiKey,
    dates: `${fromDate},${toDate}`,
    ordering: '-rating',
    page_size: '40',
    page: '1',
  })

  const res = await fetch(`${BASE}/games?${params}`)
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`)
  const data = await res.json()
  return (data.results || []).filter(g => g.background_image)
}

export const rawgCoverUrl = (game) => game?.background_image || null
