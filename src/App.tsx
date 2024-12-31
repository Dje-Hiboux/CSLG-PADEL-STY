import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { BookingsPage } from './pages/BookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AdminProvider } from './contexts/AdminContext';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

export default function App() {
  const { user, error } = useAuth();

  if (error) {
    return (
      <div className="min-h-screen bg-dark-200 flex items-center justify-center p-4">
        <div className="bg-red-400/20 text-red-400 p-4 rounded-lg max-w-md w-full text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
          {user && <Navbar />}
          <div className={user ? 'pt-16' : ''}>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/news"
                element={
                  <PrivateRoute>
                    <NewsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <PrivateRoute>
                    <BookingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </ErrorBoundary>
  );
}