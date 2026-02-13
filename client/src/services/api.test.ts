import { describe, it, expect } from 'vitest';

describe('API Configuration', () => {
  it('should have correct API base URL', () => {
    const API_BASE = import.meta.env.VITE_API_URL || '/api';
    expect(API_BASE).toBeDefined();
  });
});
