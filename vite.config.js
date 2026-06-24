import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Proxy plugin: handles /api/igdb-games server-side in dev & preview,
// avoiding CORS restrictions on the Twitch token endpoint and IGDB API.
function igdbProxyPlugin() {
  const handler = async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end()
      return
    }
    try {
      const body = await new Promise((resolve, reject) => {
        let data = ''
        req.on('data', chunk => (data += chunk))
        req.on('end', () => { try { resolve(JSON.parse(data)) } catch(e) { reject(e) } })
        req.on('error', reject)
      })

      const { clientId, clientSecret, query } = body

      const tokenRes = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        { method: 'POST' }
      )
      if (!tokenRes.ok) throw new Error(`Token error ${tokenRes.status}`)
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
      if (!igdbRes.ok) throw new Error(`IGDB error ${igdbRes.status}`)
      const games = await igdbRes.json()

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.writeHead(200)
      res.end(JSON.stringify(games))
    } catch (err) {
      res.writeHead(500)
      res.end(JSON.stringify({ error: err.message }))
    }
  }

  const middleware = (middlewares) => {
    middlewares.use('/api/igdb-games', handler)
  }

  return {
    name: 'igdb-proxy',
    configureServer(server) { middleware(server.middlewares) },
    configurePreviewServer(server) { middleware(server.middlewares) },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), igdbProxyPlugin()],
})
