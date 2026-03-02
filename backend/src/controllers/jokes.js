const pool = require('../config/db');

// GET /api/jokes - Obtener todos los chistes (con filtro opcional por categoría)
exports.getAllJokes = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    
    let query = `
      SELECT j.*, c.name as category_name 
      FROM jokes j 
      LEFT JOIN categories c ON j.category_id = c.id
    `;
    const params = [];
    
    if (category_id) {
      query += ' WHERE j.category_id = $1';
      params.push(category_id);
    }
    
    query += ' ORDER BY j.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/jokes/:id - Obtener un chiste por ID
exports.getJokeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT j.*, c.name as category_name 
       FROM jokes j 
       LEFT JOIN categories c ON j.category_id = c.id 
       WHERE j.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chiste no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// GET /api/jokes/random - Obtener un chiste aleatorio (con filtro opcional por categoría)
exports.getRandomJoke = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    
    let query = `
      SELECT j.*, c.name as category_name 
      FROM jokes j 
      LEFT JOIN categories c ON j.category_id = c.id
    `;
    const params = [];
    
    if (category_id) {
      query += ' WHERE j.category_id = $1';
      params.push(category_id);
    }
    
    query += ' ORDER BY RANDOM() LIMIT 1';
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron chistes' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /api/jokes - Crear un nuevo chiste
exports.createJoke = async (req, res, next) => {
  try {
    const { title, content, category_id } = req.body;
    
    if (!title || !content || !category_id) {
      return res.status(400).json({ 
        error: 'Los campos title, content y category_id son obligatorios' 
      });
    }
    
    // Verificar que la categoría existe
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );
    
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'La categoría especificada no existe' });
    }
    
    const result = await pool.query(
      'INSERT INTO jokes (title, content, category_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, category_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// PUT /api/jokes/:id - Actualizar un chiste
exports.updateJoke = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category_id } = req.body;
    
    if (!title || !content || !category_id) {
      return res.status(400).json({ 
        error: 'Los campos title, content y category_id son obligatorios' 
      });
    }
    
    // Verificar que la categoría existe
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );
    
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'La categoría especificada no existe' });
    }
    
    const result = await pool.query(
      'UPDATE jokes SET title = $1, content = $2, category_id = $3 WHERE id = $4 RETURNING *',
      [title, content, category_id, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chiste no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jokes/:id - Eliminar un chiste
exports.deleteJoke = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM jokes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chiste no encontrado' });
    }
    
    res.json({ message: 'Chiste eliminado correctamente', joke: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
