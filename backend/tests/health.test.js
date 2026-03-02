const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  it('GET /health responde OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
