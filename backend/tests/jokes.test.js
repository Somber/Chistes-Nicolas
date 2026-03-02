const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

describe('Jokes endpoints', () => {
  it('GET /api/jokes devuelve listado', async () => {
    pool.query = jest.fn().mockResolvedValue({
      rows: [{ id: 1, title: 'SQL', content: 'DROP TABLE...' }]
    });

    const res = await request(app).get('/api/jokes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('SQL');
  });
});
