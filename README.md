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


## Frontend (React + Vite)

Desde `frontend/`:

```bash
npm install
npm run dev
npm test
npm run build
```

Con Docker Compose:

```bash
docker compose up -d --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## CI Frontend

Workflow en `.github/workflows/frontend-ci.yml`:
- install
- test
- build
