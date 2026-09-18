const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem('cova_auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('cova_auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('cova_auth_token');
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 24 || response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';
    if (isJson && data) {
      if (data.message) {
        errorMessage = data.message;
      }
      if (data.validationErrors) {
        const firstValidationErr = Object.values(data.validationErrors)[0];
        if (firstValidationErr) {
          errorMessage = firstValidationErr as string;
        }
      }
    }
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}
