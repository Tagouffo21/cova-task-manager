import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel animate-modal-pop" style={{ width: '100%', maxWidth: '420px', background: '#111827', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <AlertOctagon size={28} />
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <button onClick={onCancel} className="btn-secondary" disabled={isDeleting}>
            Annuler
          </button>
          <button onClick={onConfirm} className="btn-danger" disabled={isDeleting}>
            {isDeleting ? 'Suppression...' : 'Supprimer Définitivement'}
          </button>
        </div>
      </div>
    </div>
  );
};
