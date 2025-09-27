import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import PublicationForm from './pages/PublicationForm.tsx';
import EditPublicationPage from './pages/EditPublicationPage.tsx';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import { AuthProvider } from './context/AuthContext';
import { TagsProvider } from './context/TagsContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <TagsProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredUserType="residencia">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/publications/new" 
                element={
                  <ProtectedRoute requiredUserType="residencia">
                    <PublicationForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/publications/:id/edit" 
                element={
                  <ProtectedRoute requiredUserType="residencia">
                    <EditPublicationPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </TagsProvider>
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
