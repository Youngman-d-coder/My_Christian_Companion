const request = require('supertest');
const app = require('../src/index');

describe('Saints API', () => {
  describe('GET /api/saints', () => {
    it('should return all saints', async () => {
      const response = await request(app)
        .get('/api/saints')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check structure of first saint
      const saint = response.body[0];
      expect(saint).toHaveProperty('id');
      expect(saint).toHaveProperty('name');
      expect(saint).toHaveProperty('title');
      expect(saint).toHaveProperty('tradition');
      expect(saint).toHaveProperty('feastDay');
      expect(saint).toHaveProperty('image');
    });

    it('should filter saints by Catholic tradition', async () => {
      const response = await request(app)
        .get('/api/saints?tradition=catholic')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(saint => {
        expect(['Catholic', 'Both']).toContain(saint.tradition);
      });
    });

    it('should filter saints by Orthodox tradition', async () => {
      const response = await request(app)
        .get('/api/saints?tradition=orthodox')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(saint => {
        expect(['Orthodox', 'Both']).toContain(saint.tradition);
      });
    });

    it('should filter saints by Both traditions', async () => {
      const response = await request(app)
        .get('/api/saints?tradition=both')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(saint => {
        expect(saint.tradition).toBe('Both');
      });
    });
  });

  describe('GET /api/saints/:id', () => {
    it('should return a specific saint by ID', async () => {
      const response = await request(app)
        .get('/api/saints/francis-of-assisi')
        .expect(200);

      expect(response.body).toHaveProperty('id', 'francis-of-assisi');
      expect(response.body).toHaveProperty('name', 'St. Francis of Assisi');
      expect(response.body).toHaveProperty('biography');
      expect(response.body).toHaveProperty('patronage');
      expect(response.body).toHaveProperty('attributes');
      expect(response.body.biography).toContain('Assisi');
    });

    it('should return 404 for non-existent saint', async () => {
      const response = await request(app)
        .get('/api/saints/non-existent-saint')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Saint not found');
    });

    it('should return full saint details including biography', async () => {
      const response = await request(app)
        .get('/api/saints/teresa-of-avila')
        .expect(200);

      expect(response.body).toHaveProperty('id', 'teresa-of-avila');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('biography');
      expect(response.body.biography.length).toBeGreaterThan(100);
      expect(response.body).toHaveProperty('born');
      expect(response.body).toHaveProperty('died');
      expect(response.body).toHaveProperty('location');
    });
  });

  describe('Saints Data Integrity', () => {
    it('should have saints from both Catholic and Orthodox traditions', async () => {
      const response = await request(app)
        .get('/api/saints')
        .expect(200);

      const traditions = [...new Set(response.body.map(s => s.tradition))];
      expect(traditions).toContain('Catholic');
      expect(traditions).toContain('Orthodox');
    });

    it('should have saints with Both tradition', async () => {
      const response = await request(app)
        .get('/api/saints')
        .expect(200);

      const bothSaints = response.body.filter(s => s.tradition === 'Both');
      expect(bothSaints.length).toBeGreaterThan(0);
    });
  });
});
