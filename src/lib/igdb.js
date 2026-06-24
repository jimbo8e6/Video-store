export async function fetchGamesByDate(clientId, clientSecret, dateStr) {
  if (!clientId || !clientSecret) return []

  const date = new Date(dateStr)
  const toTs = Math.floor(date.getTime() / 1000)
  const fromTs = toTs - 2 * 365 * 24 * 3600

  const query = `
    fields name, cover.image_id, summary, first_release_date, genres.name, platforms.name;
    where first_release_date >= ${fromTs}
      & first_release_date <= ${toTs}
      & cover != null
      & rating_count > 5;
    sort rating desc;
    limit 40;
  `

  const res = await fetch('/api/igdb-games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret, query }),
  })

  if (!res.ok) return []
  const games = await res.json()
  return Array.isArray(games) ? games.filter(g => g.cover?.image_id) : []
}

export const igdbCoverUrl = (imageId, size = 'cover_big') =>
  imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null
