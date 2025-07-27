import MainPage from './pages/MainPage'
import { GoogleMapsProvider } from './context/GoogleMapsContext'
import { AuthProvider } from './context/AuthContext'
import { TagsProvider } from './context/TagsContext'
import { PublicationsProvider } from './context/PublicationsContext'
import './App.css'

function App() {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <TagsProvider>
          <PublicationsProvider>
            <MainPage />
          </PublicationsProvider>
        </TagsProvider>
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
