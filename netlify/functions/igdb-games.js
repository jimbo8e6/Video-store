exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { clientId, clientSecret, query } = JSON.parse(event.body)

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: await igdbRes.text(),
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
