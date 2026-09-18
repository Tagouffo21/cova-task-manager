import React from 'react';
import type { Task } from '../types';
import { CheckCircle2, Clock, ListTodo, PlayCircle } from 'lucide-react';

interface StatCardsProps {
  tasks: Task[];
}

export const StatCards: React.FC<StatCardsProps> = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
      
      {/* Total Card */}
      <div className="glass-panel stat-card-padding animate-fade-in" style={{ padding: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Tâches</span>
          <div style={{ padding: '0.45rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: '#818cf8' }}>
            <ListTodo size={18} />
          </div>
        </div>
        <div className="stat-card-number" style={{ fontSize: '1.7rem', fontWeight: 800 }}>{total}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {completionPercentage}% complétées
        </div>
      </div>

      {/* Pending Card */}
      <div className="glass-panel stat-card-padding animate-fade-in" style={{ padding: '1.1rem', animationDelay: '0.05s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>En attente</span>
          <div style={{ padding: '0.45rem', background: 'var(--status-pending-bg)', borderRadius: '8px', color: 'var(--status-pending-text)' }}>
            <Clock size={18} />
          </div>
        </div>
        <div className="stat-card-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{pending}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>À démarrer</div>
      </div>

      {/* In Progress Card */}
      <div className="glass-panel stat-card-padding animate-fade-in" style={{ padding: '1.1rem', animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>En cours</span>
          <div style={{ padding: '0.45rem', background: 'var(--status-progress-bg)', borderRadius: '8px', color: 'var(--status-progress-text)' }}>
            <PlayCircle size={18} />
          </div>
        </div>
        <div className="stat-card-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--status-progress-text)' }}>{inProgress}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>En traitement actif</div>
      </div>

      {/* Completed Card */}
      <div className="glass-panel stat-card-padding animate-fade-in" style={{ padding: '1.1rem', animationDelay: '0.15s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Terminées</span>
          <div style={{ padding: '0.45rem', background: 'var(--status-completed-bg)', borderRadius: '8px', color: 'var(--status-completed-text)' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stat-card-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--status-completed-text)' }}>{completed}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Tâches accomplies</div>
      </div>

    </div>
  );
};
