import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingAnimation from './components/common/LoadingAnimation';
import PrivateRoute from './components/auth/PrivateRoute';
import InstallPrompt from './components/common/InstallPrompt';
import NetworkStatus from './components/common/NetworkStatus';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SOSPortal from './pages/SOSPortal';
import AgencyDirectory from './pages/AgencyDirectory';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

const App = () => {
  const { loading } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading/splash screen
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <LoadingAnimation onLoadingComplete={() => setInitialLoading(false)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/sos" element={
            <PrivateRoute>
              <SOSPortal />
            </PrivateRoute>
          } />
          
          <Route path="/agencies" element={
            <PrivateRoute>
              <AgencyDirectory />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          } />
          
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
      
      {/* PWA Components */}
      <InstallPrompt />
      <NetworkStatus />
    </div>
  );
};

export default App;