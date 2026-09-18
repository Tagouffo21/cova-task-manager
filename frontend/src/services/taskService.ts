import { apiFetch } from './api';
import type { Task, TaskRequest, TaskStatus } from '../types';

export const taskService = {
  async getTasks(status?: TaskStatus | 'ALL', search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') {
      params.append('status', status);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<Task[]>(`/tasks${queryString}`);
  },

  async getTaskById(id: number): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}`);
  },

  async createTask(request: TaskRequest): Promise<Task> {
    return apiFetch<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async updateTask(id: number, request: TaskRequest): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  async deleteTask(id: number): Promise<void> {
    return apiFetch<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
