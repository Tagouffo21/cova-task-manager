import React, { useState, useEffect, useCallback } from 'react';
import type { Task, TaskRequest, TaskStatus } from '../types';
import { taskService } from '../services/taskService';
import { Navbar } from '../components/Navbar';
import { StatCards } from '../components/StatCards';
import { TaskFilters } from '../components/TaskFilters';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import type { ToastMessage } from '../components/Toast';
import { Loader2, Plus, Inbox } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal & Dialog States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchAllTasks = useCallback(async () => {
    try {
      const fullList = await taskService.getTasks('ALL', '');
      setAllTasks(fullList);
    } catch (err: any) {
      console.error('Erreur chargement des stats:', err);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks(currentStatus, searchQuery);
      setTasks(data);
      await fetchAllTasks();
    } catch (err: any) {
      addToast('error', err.message || 'Impossible de charger la liste des tâches');
    } finally {
      setIsLoading(false);
    }
  }, [currentStatus, searchQuery, fetchAllTasks]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTasks]);

  // Task Handlers
  const handleCreateOrUpdateTask = async (request: TaskRequest) => {
    if (editingTask) {
      const updated = await taskService.updateTask(editingTask.id, request);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      addToast('success', 'Tâche mise à jour avec succès !');
    } else {
      const created = await taskService.createTask(request);
      setTasks((prev) => [created, ...prev]);
      addToast('success', 'Nouvelle tâche créée avec succès !');
    }
    fetchTasks();
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      const updated = await taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        dueDate: task.dueDate,
      });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      addToast('success', `Statut changé vers "${newStatus}"`);
    } catch (err: any) {
      addToast('error', err.message || 'Échec du changement de statut');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      addToast('success', 'Tâche supprimée avec succès');
      setDeletingTask(null);
    } catch (err: any) {
      addToast('error', err.message || 'Impossible de supprimer la tâche');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        
        {/* Banner */}
        <div className="glass-panel dashboard-banner animate-fade-in" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(217, 70, 239, 0.08) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              Espace de Gestion des Tâches
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Organisez, filtrez et synchronisez vos priorités en temps réel.
            </p>
          </div>
          <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} />
            <span>Créer une Tâche</span>
          </button>
        </div>

        {/* Summary Stat Cards */}
        <StatCards tasks={allTasks} />

        {/* Search & Filter bar */}
        <TaskFilters
          currentStatus={currentStatus}
          onStatusChange={setCurrentStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreateModal={() => { setEditingTask(null); setIsModalOpen(true); }}
        />

        {/* Task Grid */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem', color: 'var(--text-muted)' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
            <span>Chargement de vos tâches...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--text-muted)' }}>
              <Inbox size={28} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Aucune tâche trouvée</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
              {searchQuery || currentStatus !== 'ALL'
                ? 'Aucune tâche ne correspond à vos filtres actuels. Essayez de réinitialiser la recherche.'
                : 'Vous n’avez encore créé aucune tâche. Cliquez ci-dessous pour ajouter votre première tâche !'}
            </p>
            <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="btn-primary">
              <Plus size={18} />
              <span>Créer ma première tâche</span>
            </button>
          </div>
        ) : (
          <div className="task-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                onDelete={(t) => setDeletingTask(t)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        editingTask={editingTask}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Supprimer la tâche"
        message={`Êtes-vous sûr de vouloir supprimer "${deletingTask?.title}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTask(null)}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
