import axios from 'axios';
import type {
  User,
  Reminder,
  Hymn,
  HymnLibrary,
  HymnCategory,
  BibleTranslation,
  BibleChapter,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Bookmark
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  }
};

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>('/user/profile');
    return data;
  },

  updatePreferences: async (preferences: Partial<User['preferences']>): Promise<User> => {
    const { data } = await api.put<User>('/user/preferences', preferences);
    return data;
  },

  addBookmark: async (bookmark: Omit<Bookmark, '_id' | 'createdAt'>): Promise<Bookmark[]> => {
    const { data } = await api.post<Bookmark[]>('/user/bookmarks', bookmark);
    return data;
  },

  removeBookmark: async (bookmarkId: string): Promise<Bookmark[]> => {
    const { data } = await api.delete<Bookmark[]>(`/user/bookmarks/${bookmarkId}`);
    return data;
  },

  addToHistory: async (entry: { book: string; chapter: number }) => {
    const { data } = await api.post('/user/history', entry);
    return data;
  }
};

// Reminders API
export const remindersAPI = {
  getAll: async (): Promise<Reminder[]> => {
    const { data } = await api.get<Reminder[]>('/reminders');
    return data;
  },

  create: async (reminder: Omit<Reminder, '_id'>): Promise<Reminder> => {
    const { data } = await api.post<Reminder>('/reminders', reminder);
    return data;
  },

  update: async (id: string, reminder: Partial<Reminder>): Promise<Reminder> => {
    const { data } = await api.put<Reminder>(`/reminders/${id}`, reminder);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  }
};

// Prayers API
export const prayersAPI = {
  getAll: async (): Promise<Record<string, unknown>> => {
    const { data } = await api.get('/prayers');
    return data;
  },

  getByDenomination: async (denomination: string): Promise<Record<string, unknown>> => {
    const { data } = await api.get(`/prayers/${denomination}`);
    return data;
  }
};

// Hymns API
export const hymnsAPI = {
  getAll: async (): Promise<HymnLibrary> => {
    const { data } = await api.get('/hymns');
    return data;
  },

  getByCategory: async (category: string): Promise<HymnCategory> => {
    const { data } = await api.get(`/hymns/category/${category}`);
    return data;
  },

  search: async (query: string): Promise<Hymn[]> => {
    const { data } = await api.get('/hymns/search', { params: { q: query } });
    return data;
  },

  getFeatured: async (): Promise<Hymn[]> => {
    const { data } = await api.get('/hymns/featured');
    return data;
  }
};

// Bible API
export const bibleAPI = {
  getTranslations: async (): Promise<BibleTranslation[]> => {
    const { data } = await api.get<BibleTranslation[]>('/bible/translations');
    return data;
  },

  getBooks: async (): Promise<{ oldTestament: string[]; newTestament: string[] }> => {
    const { data } = await api.get('/bible/books');
    return data;
  },

  getChapter: async (translation: string, book: string, chapter: number): Promise<BibleChapter> => {
    const { data } = await api.get<BibleChapter>(`/bible/${translation}/${book}/${chapter}`);
    return data;
  },

  search: async (query: string, translation: string = 'KJV'): Promise<any> => {
    const { data } = await api.get('/bible/search', { params: { query, translation } });
    return data;
  }
};

export default api;
