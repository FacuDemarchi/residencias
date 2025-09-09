import MainPage from './pages/MainPage.tsx'
import { GoogleMapsProvider } from './context/GoogleMapsContext'
import { AuthProvider } from './context/AuthContext'
import { TagsProvider } from './context/TagsContext'
import './App.css'

function App() {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <TagsProvider>
          <MainPage />
        </TagsProvider>
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
