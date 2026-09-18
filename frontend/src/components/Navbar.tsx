import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <CheckSquare size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                COVA Task Manager
              </h1>
              <span className="badge badge-medium" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                <Sparkles size={10} /> PRO
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plateforme d'organisation & synchronisation</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                <UserIcon size={16} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.fullName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            </div>

            <button onClick={logout} className="btn-secondary" title="Déconnexion">
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
