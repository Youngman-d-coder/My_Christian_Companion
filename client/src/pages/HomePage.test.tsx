import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import HomePage from './HomePage';
import * as store from '../store';

// Mock the auth store
vi.mock('../store', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = {
      user: { name: 'Test User', denomination: 'catholic' },
      token: 'test-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    };
    return selector ? selector(state) : state;
  }),
  useAppStore: vi.fn((selector) => {
    const state = {
      reminders: [],
      setReminders: vi.fn(),
      addReminder: vi.fn(),
      updateReminder: vi.fn(),
      deleteReminder: vi.fn(),
      currentBibleTranslation: 'KJV',
      setCurrentBibleTranslation: vi.fn(),
      offlineMode: false,
      setOfflineMode: vi.fn()
    };
    return selector ? selector(state) : state;
  })
}));

describe('HomePage', () => {
  it('should render welcome message with user name', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Welcome, Test User!/i)).toBeInTheDocument();
  });

  it('should render quick actions section', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Read Bible/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Daily Prayers/i })).toBeInTheDocument();
    expect(screen.getByText(/Set Reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
  });

  it('should render verse of the day', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Verse of the Day/i)).toBeInTheDocument();
    expect(screen.getByText(/John 3:16/i)).toBeInTheDocument();
  });

  it('should render denomination-specific information', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Your Faith Tradition: Catholic/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning Offering/i)).toBeInTheDocument();
  });

  it('should render features overview', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/App Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete Bible/i)).toBeInTheDocument();
    expect(screen.getByText(/Prayer Library/i)).toBeInTheDocument();
  });

  it('should handle other denomination', () => {
    vi.mocked(store.useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: { name: 'Test User', denomination: 'other' },
        token: 'test-token',
        isAuthenticated: true
      };
      return selector ? selector(state) : state;
    });

    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Your Faith Tradition: Other/i)).toBeInTheDocument();
  });
});
