import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Chargement de l'application...</span>
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
