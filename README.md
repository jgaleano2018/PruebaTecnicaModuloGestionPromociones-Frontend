# PruebaTecnicaModuloGestionPromociones-Frontend

## Arranque con Docker

Requisito: Docker Desktop instalado y ejecutándose.

```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:8080`.

La URL del backend se configura mediante `VITE_API_URL`:

```bash
VITE_API_URL=http://localhost:3000 docker-compose up --build
```

En PowerShell:

```powershell
$env:VITE_API_URL = "http://localhost:3000"
docker-compose up --build
```

Para detener los contenedores:

```bash
docker-compose down
```

## Pipeline de GitHub Actions

El workflow `.github/workflows/ci.yml` ejecuta etapas dependientes:

`lint` -> `test` -> `build` -> `smoke-test`

Antes de construir, el pipeline valida que existan estas GitHub Variables:

- `VITE_API_URL`: URL que usará el frontend para comunicarse con el backend.
- `SMOKE_URL`: URL base del backend para verificar `/health`.

También requiere este GitHub Secret:

El pipeline falla explícitamente si alguna variable falta, si el contexto o Dockerfile del backend no existe, o si `$SMOKE_URL/health` no responde `HTTP 200`.