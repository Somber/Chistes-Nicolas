const pool = require('../src/config/db');

beforeEach(() => {
  pool.query = jest.fn();
});
