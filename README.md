# 🤣 Chistes-Nicolas

Repositorio de chistes con gestión completa (CRUD) y consulta aleatoria por categoría.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js
- **Base de datos:** PostgreSQL
- **Infraestructura:** Docker + docker-compose

## Estructura (próximamente)

```
├── frontend/       # React + Vite
├── backend/        # Node.js API REST
├── docker-compose.yml
└── README.md
```

## Autor

Desarrollado por Nicolás 🦝 con la supervisión de Moi.


## Tests backend

Desde `backend/`:

```bash
npm install
npm test
```

## CI

Hay un workflow de GitHub Actions en `.github/workflows/backend-ci.yml` que ejecuta los tests del backend en cada Pull Request.
