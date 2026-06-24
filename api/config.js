export default function handler(req, res) {
  res.status(200).json({
    igdbConfigured: !!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET),
  })
}
