const request = require('supertest');
const { createTestApp } = require('./testSetup');

describe('API Health Check', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('GET /health should return ok status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'Christian Companion API is running');
  });
});
