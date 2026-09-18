import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 70,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: '100%'
    }}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '12px',
              background: '#1f2937',
              border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isSuccess ? (
                <CheckCircle2 size={18} color="#34d399" />
              ) : (
                <AlertCircle size={18} color="#f87171" />
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
