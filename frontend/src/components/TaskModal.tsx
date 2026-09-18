import React, { useState, useEffect } from 'react';
import type { Task, TaskPriority, TaskRequest, TaskStatus } from '../types';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: TaskRequest) => Promise<void>;
  editingTask: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('PENDING');
      setPriority('MEDIUM');
      setDueDate('');
    }
    setError(null);
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Le titre de la tâche est obligatoire.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? `${dueDate}T23:59:59` : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l’enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel modal-container animate-modal-pop" style={{ width: '100%', maxWidth: '520px', background: '#111827', padding: '1.75rem', border: '1px solid var(--border-color)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {editingTask ? 'Modifier la Tâche' : 'Créer une Nouvelle Tâche'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Title Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Titre <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Rédiger le rapport d'architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Description (optionnel)
            </label>
            <textarea
              rows={3}
              placeholder="Détails supplémentaires concernant cette tâche..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Status & Priority Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="input-field"
              >
                <option value="PENDING" style={{ background: '#111827' }}>En attente</option>
                <option value="IN_PROGRESS" style={{ background: '#111827' }}>En cours</option>
                <option value="COMPLETED" style={{ background: '#111827' }}>Terminée</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="input-field"
              >
                <option value="LOW" style={{ background: '#111827' }}>Basse</option>
                <option value="MEDIUM" style={{ background: '#111827' }}>Moyenne</option>
                <option value="HIGH" style={{ background: '#111827' }}>Haute</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Date d'échéance (optionnel)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <CheckCircle size={16} />
              <span>{isSubmitting ? 'Enregistrement...' : editingTask ? 'Mettre à jour' : 'Créer Tâche'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
