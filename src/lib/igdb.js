// IGDB requires server-side auth (Twitch OAuth).
// We use a CORS proxy approach: get token client-side then call IGDB.
// Note: IGDB blocks direct browser calls — we route through a public proxy.
const PROXY = 'https://api.igdb.com/v4'

let cachedToken = null
let tokenExpiry = 0

export async function getIgdbToken(clientId, clientSecret) {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  )
  if (!res.ok) throw new Error('Failed to get IGDB token')
  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

export async function fetchGamesByDate(clientId, clientSecret, dateStr) {
  if (!clientId || !clientSecret) return []

  let token
  try {
    token = await getIgdbToken(clientId, clientSecret)
  } catch {
    return []
  }

  const date = new Date(dateStr)
  const toTimestamp = Math.floor(date.getTime() / 1000)
  const fromTimestamp = toTimestamp - 2 * 365 * 24 * 3600

  const body = `
    fields name, cover.image_id, summary, first_release_date, genres.name, platforms.name;
    where first_release_date >= ${fromTimestamp}
      & first_release_date <= ${toTimestamp}
      & cover != null
      & rating_count > 5;
    sort rating desc;
    limit 40;
  `

  const res = await fetch(`${PROXY}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  })

  if (!res.ok) return []
  const games = await res.json()
  return Array.isArray(games) ? games.filter(g => g.cover?.image_id) : []
}

export const igdbCoverUrl = (imageId, size = 'cover_big') =>
  imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null
