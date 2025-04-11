import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { MapProvider } from './contexts/MapContext';
import { EmergencyProvider } from './contexts/EmergencyContext';
import { ServiceWorkerProvider } from './contexts/ServiceWorkerContext';
import { createTestAccounts } from './utils/testAccounts';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create test accounts in development mode
if (import.meta.env.DEV) {
  createTestAccounts();
}

// Register the service worker
serviceWorkerRegistration.register();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ServiceWorkerProvider>
      <AuthProvider>
        <MapProvider>
          <EmergencyProvider>
            <App />
          </EmergencyProvider>
        </MapProvider>
      </AuthProvider>
    </ServiceWorkerProvider>
  </BrowserRouter>
);