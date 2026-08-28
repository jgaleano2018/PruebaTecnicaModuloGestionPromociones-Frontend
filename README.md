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

- `BACKEND_CONTEXT`: ruta del contexto del backend dentro del checkout.
- `BACKEND_DOCKERFILE`: nombre o ruta del Dockerfile del backend.
- `VITE_API_URL`: URL que usará el frontend para comunicarse con el backend.
- `SMOKE_URL`: URL base del backend para verificar `/health`.

También requiere este GitHub Secret:

- `BACKEND_DATABASE_URL`: credencial de conexión que se inyecta al contenedor backend.

El pipeline falla explícitamente si alguna variable falta, si el contexto o Dockerfile del backend no existe, o si `$SMOKE_URL/health` no responde `HTTP 200`.

Este repositorio contiene el frontend. Para ejecutar la etapa de integración se debe agregar el backend al checkout o ajustar `BACKEND_CONTEXT` para apuntar a un contexto de backend disponible en el repositorio.