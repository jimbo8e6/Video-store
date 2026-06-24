export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { clientId, clientSecret, query } = req.body

    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: 'POST' }
    )
    if (!tokenRes.ok) throw new Error(`Token error: ${tokenRes.status}`)
    const { access_token } = await tokenRes.json()

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'text/plain',
      },
      body: query,
    })
    if (!igdbRes.ok) throw new Error(`IGDB error: ${igdbRes.status}`)

    const games = await igdbRes.json()
    res.status(200).json(games)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
