import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import { AuthProvider } from './context/AuthContext';
import { TagsProvider } from './context/TagsContext';
import './App.css'

function App() {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <TagsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </Router>
        </TagsProvider>
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
