import React from 'react';
import type { Task, TaskStatus } from '../types';
import { Calendar, CheckCircle2, Clock, Edit2, PlayCircle, Trash2, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="badge badge-pending">
            <Clock size={12} /> En attente
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-in_progress">
            <PlayCircle size={12} /> En cours
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge badge-completed">
            <CheckCircle2 size={12} /> Terminée
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <span className="badge badge-high"><AlertCircle size={10} /> Haute</span>;
      case 'MEDIUM':
        return <span className="badge badge-medium">Moyenne</span>;
      default:
        return <span className="badge badge-low">Basse</span>;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--text-primary)',
          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none'
        }}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {task.description}
          </p>
        )}
      </div>

      <div>
        {/* Due Date & Timestamp */}
        {task.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Calendar size={13} />
            <span>Échéance: {formatDate(task.dueDate)}</span>
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.75rem 0' }} />

        {/* Actions & Quick Status Select */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="PENDING" style={{ background: '#111827' }}>Changer: En attente</option>
            <option value="IN_PROGRESS" style={{ background: '#111827' }}>Changer: En cours</option>
            <option value="COMPLETED" style={{ background: '#111827' }}>Changer: Terminée</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => onEdit(task)}
              style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Modifier"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(task)}
              style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
