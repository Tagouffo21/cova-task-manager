import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel nav-header" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.9rem 1.5rem', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <CheckSquare size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <h1 className="nav-brand-title" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                COVA Task Manager
              </h1>
              <span className="badge badge-medium" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                <Sparkles size={9} /> PRO
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Plateforme d'organisation & synchronisation</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="nav-user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.7rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserIcon size={14} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.fullName}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            </div>

            <button onClick={logout} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }} title="Déconnexion">
              <LogOut size={15} />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
