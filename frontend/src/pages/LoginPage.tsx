import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        if (!fullName.trim()) {
          setError('Le nom complet est obligatoire');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Échec de l’authentification. Vérifiez vos identifiants.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <CheckSquare size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {isRegisterMode ? 'Créer un compte' : 'Bienvenue sur COVA'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegisterMode
              ? 'Inscrivez-vous pour gérer vos tâches efficacement'
              : 'Connectez-vous pour accéder à votre espace de travail'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {isRegisterMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Nom complet
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.6rem' }}
                  required={isRegisterMode}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.6rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
          >
            <span>{isSubmitting ? 'Traitement...' : isRegisterMode ? 'S’inscrire' : 'Se Connecter'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegisterMode ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegisterMode ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
