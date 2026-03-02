const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

describe('Categories endpoints', () => {
  it('GET /api/categories devuelve listado', async () => {
    pool.query = jest.fn().mockResolvedValue({
      rows: [{ id: 1, name: 'Humor negro' }]
    });

    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Humor negro');
  });
});
