const KEY = 'videostore_watchlist'

export function getWatchlist() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

export function saveWatchlist(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}
