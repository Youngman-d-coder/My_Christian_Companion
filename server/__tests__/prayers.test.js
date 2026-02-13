const request = require('supertest');
const { createTestApp } = require('./testSetup');

describe('Prayers API', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /api/prayers', () => {
    test('should return all prayers', async () => {
      const response = await request(app)
        .get('/api/prayers')
        .expect(200);

      expect(response.body).toHaveProperty('catholic');
      expect(response.body).toHaveProperty('protestant');
      expect(response.body).toHaveProperty('orthodox');
      expect(response.body).toHaveProperty('common');
    });
  });

  describe('GET /api/prayers/:denomination', () => {
    test('should return Catholic prayers', async () => {
      const response = await request(app)
        .get('/api/prayers/catholic')
        .expect(200);

      expect(response.body).toHaveProperty('daily');
      expect(response.body).toHaveProperty('rosary');
      expect(Array.isArray(response.body.daily)).toBe(true);
    });

    test('should return Protestant prayers', async () => {
      const response = await request(app)
        .get('/api/prayers/protestant')
        .expect(200);

      expect(response.body).toHaveProperty('daily');
      expect(Array.isArray(response.body.daily)).toBe(true);
    });

    test('should return Orthodox prayers', async () => {
      const response = await request(app)
        .get('/api/prayers/orthodox')
        .expect(200);

      expect(response.body).toHaveProperty('daily');
      expect(Array.isArray(response.body.daily)).toBe(true);
    });

    test('should return 404 for invalid denomination', async () => {
      const response = await request(app)
        .get('/api/prayers/invalid')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Denomination not found');
    });

    test('should return common prayers', async () => {
      const response = await request(app)
        .get('/api/prayers/common')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
