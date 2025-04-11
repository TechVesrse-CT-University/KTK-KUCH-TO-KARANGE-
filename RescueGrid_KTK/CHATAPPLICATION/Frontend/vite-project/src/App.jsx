import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Lazy load components for better initial load performance
const ChatRoom = lazy(() => import('./pages/ChatRoom'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, authToken, loading } = useAuth();

  // Show loading indicator while checking auth
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!currentUser || !authToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Suspense fallback={<LoadingScreen message="Loading application..." />}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
