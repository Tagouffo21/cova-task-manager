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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      
      {/* Total Card */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Tâches</span>
          <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: '#818cf8' }}>
            <ListTodo size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{total}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {completionPercentage}% complétées au total
        </div>
      </div>

      {/* Pending Card */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', animationDelay: '0.05s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>En attente</span>
          <div style={{ padding: '0.5rem', background: 'var(--status-pending-bg)', borderRadius: '10px', color: 'var(--status-pending-text)' }}>
            <Clock size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{pending}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>À démarrer</div>
      </div>

      {/* In Progress Card */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>En cours</span>
          <div style={{ padding: '0.5rem', background: 'var(--status-progress-bg)', borderRadius: '10px', color: 'var(--status-progress-text)' }}>
            <PlayCircle size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-progress-text)' }}>{inProgress}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>En traitement actif</div>
      </div>

      {/* Completed Card */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', animationDelay: '0.15s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Terminées</span>
          <div style={{ padding: '0.5rem', background: 'var(--status-completed-bg)', borderRadius: '10px', color: 'var(--status-completed-text)' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-completed-text)' }}>{completed}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Tâches accomplies</div>
      </div>

    </div>
  );
};
