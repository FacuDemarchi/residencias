import MainPage from './pages/MainPage'
import { GoogleMapsProvider } from './context/GoogleMapsContext'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <MainPage />
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
