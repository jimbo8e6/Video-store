import { useState, useEffect } from 'react'
import Header from './components/Header'
import DateSelector from './components/DateSelector'
import VideoStore from './components/VideoStore'
import ApiSetup from './components/ApiSetup'
import { BAKED_TMDB_KEY } from './lib/tmdb'

function App() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [apiKeys, setApiKeys] = useState(() => {
    try {
      const stored = localStorage.getItem('videostore_keys')
      return stored ? JSON.parse(stored) : { tmdb: '', igdb_client: '', igdb_secret: '' }
    } catch {
      return { tmdb: '', igdb_client: '', igdb_secret: '' }
    }
  })
  const [showSetup, setShowSetup] = useState(false)
  const [serverConfig, setServerConfig] = useState({ igdbConfigured: false })

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(setServerConfig)
      .catch(() => {}) // silently fails in local dev without the function
  }, [])

  const handleSaveKeys = (keys) => {
    localStorage.setItem('videostore_keys', JSON.stringify(keys))
    setApiKeys(keys)
    setShowSetup(false)
  }

  const hasTmdb = !!(apiKeys.tmdb || BAKED_TMDB_KEY)
  const hasIgdb = !!(serverConfig.igdbConfigured || apiKeys.igdb_client)

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Header onSetup={() => setShowSetup(true)} showSetupButton={!hasTmdb || !hasIgdb} />

      {showSetup && (
        <ApiSetup
          initialKeys={apiKeys}
          serverConfig={serverConfig}
          onSave={handleSaveKeys}
          onClose={() => setShowSetup(false)}
        />
      )}

      {!selectedDate ? (
        <DateSelector onSelectDate={setSelectedDate} />
      ) : (
        <VideoStore
          date={selectedDate}
          apiKeys={apiKeys}
          serverConfig={serverConfig}
          onBack={() => setSelectedDate(null)}
          onSetup={() => setShowSetup(true)}
        />
      )}
    </div>
  )
}

export default App
