FROM postgres:16-alpine

LABEL maintainer="Nicolás 🦝 <nicolas.patillas.bdn@gmail.com>"
LABEL description="PostgreSQL para Chistes-Nicolas"

# Copiar script de inicialización
# PostgreSQL ejecuta automáticamente los .sql de /docker-entrypoint-initdb.d/
# en orden alfabético al crear la BD por primera vez (volumen vacío)
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

# Verificar que el archivo se copió correctamente
RUN ls -la /docker-entrypoint-initdb.d/ && cat /docker-entrypoint-initdb.d/01-init.sql | head -5

EXPOSE 5432
