import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdminDashboard } from './pages/AdminDashboard';

// Simple client-side routing
function Router() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminDashboard />;
  }

  return <App />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);