import React from 'react';
import type { TaskStatus } from '../types';
import { Search, Plus, Filter } from 'lucide-react';

interface TaskFiltersProps {
  currentStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
}) => {
  const tabs: { label: string; value: TaskStatus | 'ALL' }[] = [
    { label: 'Toutes', value: 'ALL' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Terminées', value: 'COMPLETED' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher une tâche par titre ou description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.6rem' }}
          />
        </div>

        {/* Add Task Button */}
        <button onClick={onOpenCreateModal} className="btn-primary">
          <Plus size={18} />
          <span>Nouvelle Tâche</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Filter size={15} />
          <span>Filtrer par :</span>
        </div>
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                border: '1px solid',
                borderColor: isActive ? 'var(--primary-color)' : 'transparent',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
