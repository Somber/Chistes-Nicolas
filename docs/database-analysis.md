# 🗄️ Análisis de Base de Datos — Chistes-Nicolas

## Índice

1. [Resumen](#resumen)
2. [Tablas](#tablas)
3. [Detalle de cada tabla](#detalle-de-cada-tabla)
4. [Relaciones](#relaciones)
5. [Diagrama ER](#diagrama-er)
6. [Índices recomendados](#índices-recomendados)
7. [Datos iniciales (seed)](#datos-iniciales-seed)

---

## Resumen

La base de datos es sencilla y está diseñada para soportar un CRUD completo de chistes organizados por categorías, con la posibilidad de obtener chistes aleatorios filtrados por categoría.

**Motor:** PostgreSQL  
**Esquema:** `public`  
**Tablas:** 2 (`categories`, `jokes`)

---

## Tablas

| Tabla | Descripción | Registros esperados |
|-------|-------------|---------------------|
| `categories` | Catálogo de categorías de chistes | Decenas |
| `jokes` | Chistes almacenados con su categoría | Cientos/Miles |

---

## Detalle de cada tabla

### 📁 `categories`

Almacena las categorías disponibles para clasificar los chistes.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único autoincremental |
| `name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Nombre de la categoría (ej: "Humor negro", "Dad jokes") |
| `description` | `TEXT` | `NULL` | Descripción opcional de la categoría |
| `created_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT NOW()` | Fecha de última modificación |

**Notas:**
- El campo `name` es único para evitar categorías duplicadas.
- `description` es opcional, permite dar contexto sobre qué tipo de chistes pertenecen a esa categoría.

---

### 🃏 `jokes`

Almacena los chistes con referencia a su categoría.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único autoincremental |
| `title` | `VARCHAR(200)` | `NOT NULL` | Título o resumen corto del chiste |
| `content` | `TEXT` | `NOT NULL` | El chiste completo |
| `category_id` | `INTEGER` | `NOT NULL`, `FOREIGN KEY → categories(id)` | Categoría a la que pertenece |
| `created_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT NOW()` | Fecha de última modificación |

**Notas:**
- `title` permite identificar rápidamente el chiste en listados sin mostrar el contenido completo.
- `content` almacena el chiste en texto plano. Puede contener saltos de línea para chistes con formato pregunta/respuesta.
- `category_id` es obligatorio: todo chiste debe pertenecer a una categoría.
- La foreign key tiene `ON DELETE RESTRICT` para evitar borrar categorías que tengan chistes asociados.

---

## Relaciones

```
categories (1) ──────── (N) jokes
    │                        │
    │ id ◄──── category_id   │
    │                        │
```

- **Una categoría** puede tener **muchos chistes** (1:N)
- **Un chiste** pertenece a **una sola categoría** (N:1)
- No se permite borrar una categoría si tiene chistes asociados (`ON DELETE RESTRICT`)

---

## Diagrama ER

```
┌─────────────────────────┐          ┌─────────────────────────────┐
│       categories        │          │           jokes             │
├─────────────────────────┤          ├─────────────────────────────┤
│ PK  id         SERIAL   │──┐       │ PK  id          SERIAL     │
│     name       VARCHAR   │  │       │     title       VARCHAR    │
│     description TEXT     │  │       │     content     TEXT       │
│     created_at TIMESTAMP │  └──────>│ FK  category_id INTEGER    │
│     updated_at TIMESTAMP │          │     created_at  TIMESTAMP  │
└─────────────────────────┘          │     updated_at  TIMESTAMP  │
                                     └─────────────────────────────┘
```

---

## Índices recomendados

| Índice | Tabla | Columna(s) | Tipo | Justificación |
|--------|-------|------------|------|---------------|
| `pk_categories` | `categories` | `id` | PRIMARY | Automático con PRIMARY KEY |
| `uq_categories_name` | `categories` | `name` | UNIQUE | Evitar duplicados |
| `pk_jokes` | `jokes` | `id` | PRIMARY | Automático con PRIMARY KEY |
| `idx_jokes_category_id` | `jokes` | `category_id` | B-TREE | Acelerar consultas filtradas por categoría y el chiste aleatorio |

El índice en `category_id` es clave para el rendimiento de la funcionalidad principal: **obtener un chiste aleatorio de una categoría**.

---

## Datos iniciales (seed)

Categorías sugeridas para el seed inicial:

| Nombre | Descripción |
|--------|-------------|
| Humor negro | Chistes de humor oscuro y políticamente incorrectos |
| Dad jokes | Chistes de padre, malos pero entrañables |
| Chistes malos | Tan malos que dan la vuelta y son buenos |
| Informática | Chistes de programadores y tecnología |
| Animales | Chistes con protagonistas del reino animal |
| Profesiones | Chistes sobre médicos, abogados, etc. |

---

## SQL de creación

```sql
-- Crear tabla de categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Crear tabla de chistes
CREATE TABLE jokes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_jokes_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
);

-- Índice para búsquedas por categoría
CREATE INDEX idx_jokes_category_id ON jokes(category_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_jokes_updated_at
    BEFORE UPDATE ON jokes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed de categorías iniciales
INSERT INTO categories (name, description) VALUES
    ('Humor negro', 'Chistes de humor oscuro y políticamente incorrectos'),
    ('Dad jokes', 'Chistes de padre, malos pero entrañables'),
    ('Chistes malos', 'Tan malos que dan la vuelta y son buenos'),
    ('Informática', 'Chistes de programadores y tecnología'),
    ('Animales', 'Chistes con protagonistas del reino animal'),
    ('Profesiones', 'Chistes sobre médicos, abogados, etc.');
```

---

*Documento generado por Nicolás 🦝 — Febrero 2026*
