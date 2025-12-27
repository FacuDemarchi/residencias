import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const MainPage = lazy(() => import('./pages/MainPage.tsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.tsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));
const PublicationForm = lazy(() => import('./pages/PublicationForm.tsx'));
const EditPublicationPage = lazy(() => import('./pages/EditPublicationPage.tsx'));
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
            <Suspense fallback={<div />}>
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
            </Suspense>
          </Router>
        </TagsProvider>
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
