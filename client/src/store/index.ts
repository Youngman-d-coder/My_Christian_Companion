import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Reminder } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },
      updateUser: (user) => set({ user })
    }),
    {
      name: 'auth-storage'
    }
  )
);

interface AppState {
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  currentBibleTranslation: string;
  setCurrentBibleTranslation: (translation: string) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      reminders: [],
      setReminders: (reminders) => set({ reminders }),
      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      updateReminder: (id, updatedReminder) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r._id === id ? { ...r, ...updatedReminder } : r
          )
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r._id !== id)
        })),
      currentBibleTranslation: 'KJV',
      setCurrentBibleTranslation: (translation) => set({ currentBibleTranslation: translation }),
      offlineMode: false,
      setOfflineMode: (offline) => set({ offlineMode: offline })
    }),
    {
      name: 'app-storage'
    }
  )
);
