const pool = require('../config/db');

// GET /api/categories - Obtener todas las categorías
exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id - Obtener una categoría por ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories - Crear una nueva categoría
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    next(error);
  }
};

// PUT /api/categories/:id - Actualizar una categoría
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    next(error);
  }
};

// DELETE /api/categories/:id - Eliminar una categoría
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay chistes con esta categoría
    const jokesCheck = await pool.query(
      'SELECT COUNT(*) FROM jokes WHERE category_id = $1',
      [id]
    );
    
    if (parseInt(jokesCheck.rows[0].count) > 0) {
      return res.status(409).json({ 
        error: 'No se puede eliminar la categoría porque tiene chistes asociados' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.json({ message: 'Categoría eliminada correctamente', category: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
