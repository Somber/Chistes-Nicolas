-- =============================================
-- Chistes-Nicolas — Script de creación de BD
-- Motor: PostgreSQL
-- =============================================

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de chistes
CREATE TABLE IF NOT EXISTS jokes (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jokes_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
);

-- Índice para optimizar búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_jokes_category_id ON jokes(category_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_jokes_updated_at
    BEFORE UPDATE ON jokes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Datos iniciales de ejemplo
INSERT INTO categories (name, description) VALUES
    ('Humor negro', 'Chistes de humor oscuro y políticamente incorrectos'),
    ('Dad jokes', 'Chistes de padre: malos pero entrañables'),
    ('Chistes malos', 'Tan malos que dan la vuelta y hacen gracia'),
    ('De Lepe', 'Los clásicos chistes de Lepe de toda la vida'),
    ('Informáticos', 'Chistes para programadores y técnicos');

INSERT INTO jokes (title, content, category_id) VALUES
    ('El colmo', '¿Cuál es el colmo de un electricista? Que su mujer se llame Luz y sus hijos le sigan la corriente.', 4),
    ('SQL', 'Un programador entra en un bar y pide 1 cerveza, 2 cervezas, 3 cervezas... DROP TABLE cervezas;', 5);
