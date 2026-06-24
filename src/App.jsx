import { useState } from 'react'
import Header from './components/Header'
import DateSelector from './components/DateSelector'
import VideoStore from './components/VideoStore'
import ApiSetup from './components/ApiSetup'

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

  const handleSaveKeys = (keys) => {
    localStorage.setItem('videostore_keys', JSON.stringify(keys))
    setApiKeys(keys)
    setShowSetup(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Header onSetup={() => setShowSetup(true)} />

      {showSetup && (
        <ApiSetup
          initialKeys={apiKeys}
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
          onBack={() => setSelectedDate(null)}
          onSetup={() => setShowSetup(true)}
        />
      )}
    </div>
  )
}

export default App
