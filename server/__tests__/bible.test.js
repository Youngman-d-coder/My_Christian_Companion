const request = require('supertest');
const { createTestApp } = require('./testSetup');

describe('Bible API', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /api/bible/translations', () => {
    test('should return list of Bible translations', async () => {
      const response = await request(app)
        .get('/api/bible/translations')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check structure of first translation
      const firstTranslation = response.body[0];
      expect(firstTranslation).toHaveProperty('id');
      expect(firstTranslation).toHaveProperty('name');
      expect(firstTranslation).toHaveProperty('language');
    });

    test('should include KJV translation', async () => {
      const response = await request(app)
        .get('/api/bible/translations')
        .expect(200);

      const kjv = response.body.find(t => t.id === 'KJV');
      expect(kjv).toBeDefined();
      expect(kjv.name).toBe('King James Version');
    });
  });

  describe('GET /api/bible/books', () => {
    test('should return list of Bible books', async () => {
      const response = await request(app)
        .get('/api/bible/books')
        .expect(200);

      expect(response.body).toHaveProperty('oldTestament');
      expect(response.body).toHaveProperty('newTestament');
      expect(Array.isArray(response.body.oldTestament)).toBe(true);
      expect(Array.isArray(response.body.newTestament)).toBe(true);
    });

    test('should include Genesis in Old Testament', async () => {
      const response = await request(app)
        .get('/api/bible/books')
        .expect(200);

      expect(response.body.oldTestament).toContain('Genesis');
    });

    test('should include Matthew in New Testament', async () => {
      const response = await request(app)
        .get('/api/bible/books')
        .expect(200);

      expect(response.body.newTestament).toContain('Matthew');
    });
  });
});
