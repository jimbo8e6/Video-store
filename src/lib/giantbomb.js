const BASE = 'https://www.giantbomb.com/api'

export async function fetchGamesByDate(apiKey, dateStr) {
  if (!apiKey) return []

  const to = new Date(dateStr)
  const from = new Date(dateStr)
  from.setFullYear(from.getFullYear() - 2)

  const fmt = (d) => d.toISOString().slice(0, 10) + ' 00:00:00'

  const params = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    filter: `original_release_date:${fmt(from)}|${fmt(to)}`,
    sort: 'original_release_date:desc',
    field_list: 'id,name,image,original_release_date,genres,deck,platforms',
    limit: '40',
  })

  const res = await fetch(`${BASE}/games/?${params}`)
  if (!res.ok) throw new Error(`GiantBomb error: ${res.status}`)
  const data = await res.json()
  if (data.status_code !== 1) throw new Error(data.error || 'GiantBomb API error')
  return (data.results || []).filter(g => g.image?.medium_url || g.image?.screen_url)
}

export const gbCoverUrl = (game) =>
  game?.image?.medium_url || game?.image?.screen_url || null
