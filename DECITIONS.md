#Decisiones Técnicas — React.js + Vite + Node.js

##1. Contexto

La solución estará compuesta por:

Frontend: React.js + Vite + TypeScript.
Backend: Node.js + TypeScript.
API: REST/JSON.
Contenedores: Docker.
Orquestación: Docker Compose.
CI/CD: GitHub Actions.
Control de versiones: Git/GitHub.

El objetivo es construir una aplicación mantenible, escalable, testeable, segura y preparada para CI/CD.

##2. Frontend
ADR-001 — React.js

Estado: Aceptada

Decisión

Utilizar React.js como tecnología principal para el frontend.

Justificación

React permite:

Construir interfaces mediante componentes reutilizables.
Separar responsabilidades.
Facilitar el mantenimiento.
Integrar fácilmente librerías externas.
Utilizar TypeScript.
Implementar aplicaciones SPA.
Facilitar pruebas unitarias y de componentes.
Consecuencias

Positivas:

Componentización.
Ecosistema amplio.
Buena integración con TypeScript.
Facilidad para reutilizar componentes.

Negativas:

React no impone una arquitectura completa.
El equipo debe definir convenciones para estructura, estado y comunicación con APIs.

##3. Vite
ADR-002 — Vite como herramienta de build

Estado: Aceptada

Decisión

Utilizar Vite para el desarrollo y construcción del frontend.

Justificación

Vite proporciona:

Inicio rápido del servidor de desarrollo.
Hot Module Replacement (HMR).
Build optimizado para producción.
Configuración sencilla.
Integración con React y TypeScript.
Excelente experiencia de desarrollo.
Comandos principales
npm run dev
npm run build
npm run preview
Producción

El resultado del build será generado en:

dist/

El directorio dist/ será un artefacto generado y no deberá versionarse.

##4. TypeScript
ADR-003 — TypeScript para frontend y backend

Estado: Aceptada

Decisión

Utilizar TypeScript tanto en React como en Node.js.

Justificación

TypeScript proporciona:

Tipado estático.
Detección temprana de errores.
Autocompletado.
Refactoring más seguro.
Contratos explícitos.
Mayor mantenibilidad.
Regla

Se evitará el uso indiscriminado de:

any

Cuando sea necesario representar información desconocida se preferirá:

unknown

acompañado de una validación apropiada.

##5. Arquitectura del frontend
ADR-004 — Organización por responsabilidades/features

Estado: Aceptada

Decisión

Organizar el frontend separando componentes, funcionalidades, servicios y utilidades.

Ejemplo:

src/
├── app/
├── components/
├── features/
├── pages/
├── hooks/
├── services/
├── types/
├── utils/
├── config/
└── tests/
Principios

Los componentes React deberán enfocarse principalmente en la presentación.

La lógica de negocio compleja deberá estar fuera de los componentes cuando sea posible.

Las llamadas al backend deberán centralizarse en servicios.

##6. Routing
ADR-005 — React Router

Estado: Aceptada

Decisión

Utilizar React Router cuando la aplicación requiera navegación entre múltiples vistas.

Responsabilidades

Permitirá manejar:

Rutas.
Parámetros.
Rutas protegidas.
Navegación.
Redirecciones.
Layouts.

Ejemplo:

/login
/promotions
/promotions/:id
/promotions/create

##7. Comunicación HTTP
ADR-006 — API REST/JSON

Estado: Aceptada

Decisión

El frontend se comunicará con Node.js mediante una API REST utilizando JSON.

Ejemplo:

GET    /api/v1/promotions
GET    /api/v1/promotions/:id
POST   /api/v1/promotions
PUT    /api/v1/promotions/:id
DELETE /api/v1/promotions/:id
Justificación

REST permite:

Separar frontend y backend.
Facilitar integración con otros consumidores.
Utilizar HTTP estándar.
Facilitar testing mediante herramientas como Postman.
Mantener contratos claros.

##8. Cliente HTTP
ADR-007 — Capa centralizada para HTTP

Estado: Aceptada

Decisión

Las llamadas HTTP deberán centralizarse mediante una capa de servicios.

Se podrá utilizar:

fetch
Axios

La aplicación deberá mantener una única estrategia consistente.

Responsabilidades

La capa HTTP gestionará:

Base URL.
Headers.
Autenticación.
Timeouts.
Errores.
Serialización.
Respuestas HTTP.

Los componentes React no deberían contener llamadas HTTP dispersas.

##9. Manejo del estado
ADR-008 — Separar estado local y estado del servidor

Estado: Aceptada

Estado local

Se utilizarán herramientas de React como:

useState
useReducer
useContext

cuando el estado pertenezca exclusivamente a una funcionalidad o componente.

Estado del servidor

Para datos obtenidos desde la API se recomienda utilizar:

TanStack Query (React Query).

Justificación

Permite gestionar:

Cache.
Loading.
Error.
Refetch.
Invalidación.
Mutaciones.
Sincronización con el backend.

Se evitará utilizar un estado global para almacenar indiscriminadamente toda la información de la aplicación.

##10. Formularios
ADR-009 — React Hook Form + Zod

Estado: Aceptada

Decisión

Para formularios complejos se recomienda:

React Hook Form para manejo del formulario.
Zod para validación.
Justificación

Permite separar:

Formulario
    |
    +-- Estado
    +-- Validación
    +-- Errores
    +-- Transformación

La validación deberá realizarse también en backend.

##11. Variables de entorno del frontend
ADR-010 — Variables VITE_*

Estado: Aceptada

Vite utiliza variables de entorno con el prefijo:

VITE_

Ejemplo:

VITE_API_URL=http://localhost:3000/api/v1
Importante

Las variables VITE_* pueden terminar dentro del bundle generado.

Por lo tanto, no deben contener secretos.

Nunca almacenar en:

VITE_DB_PASSWORD=
VITE_JWT_SECRET=
VITE_PRIVATE_API_KEY=

Los secretos deberán mantenerse en mecanismos seguros del entorno de ejecución o CI/CD.

##12. Backend Node.js
ADR-011 — Node.js + TypeScript

Estado: Aceptada

Decisión

Utilizar Node.js + TypeScript para el backend.

Justificación

Node.js es apropiado para APIs REST debido a:

Modelo de I/O no bloqueante.
Buen rendimiento para operaciones de red.
Ecosistema npm.
Integración natural con TypeScript.
Facilidad para construir APIs HTTP.

Además, utilizar TypeScript en frontend y backend permite compartir conceptos, tipos y convenciones.

##13. Framework backend
ADR-012 — Express.js

Estado: Aceptada

Decisión

Utilizar Express.js como framework HTTP del backend.

Responsabilidades

Express será responsable principalmente de:

Routing.
Middleware.
Request/Response.
Manejo de errores HTTP.

La lógica de negocio no deberá estar directamente implementada en los controllers.

##14. Arquitectura backend
ADR-013 — Arquitectura por capas

Estado: Aceptada

Decisión

El backend utilizará separación de responsabilidades.

Ejemplo:

src/
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── domain/
├── dto/
├── validators/
├── middlewares/
├── infrastructure/
└── app.ts
Flujo
HTTP Request
      |
      v
   Route
      |
      v
 Controller
      |
      v
  Service
      |
      v
 Repository
      |
      v
 Database
Controller

Responsabilidades:

Recibir HTTP request.
Obtener parámetros.
Invocar servicios.
Construir la respuesta HTTP.

No deberá contener lógica de negocio compleja.

Service

Contiene:

Reglas de negocio.
Casos de uso.
Orquestación de operaciones.
Repository

Responsable de:

Acceso a base de datos.
Queries.
Persistencia.

Esto permite aislar la lógica de negocio de la tecnología de persistencia.

##15. Versionamiento de API
ADR-014 — API /api/v1

Estado: Aceptada

Decisión

Versionar la API utilizando:

/api/v1

Ejemplo:

/api/v1/promotions
Justificación

Permite evolucionar la API sin romper inmediatamente consumidores existentes.

En el futuro podría existir:

/api/v1
/api/v2

##16. Contrato de respuestas
ADR-015 — Respuestas HTTP consistentes

Estado: Aceptada

Las respuestas deberán mantener una estructura consistente.

Éxito
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
Error
{
  "success": false,
  "error": {
    "code": "PROMOTION_NOT_FOUND",
    "message": "Promotion not found"
  }
}
Códigos HTTP

Se deberán utilizar apropiadamente:

Código	Uso
200	OK
201	Created
204	No Content
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
422	Validation error
500	Internal Server Error

##17. Validación backend
ADR-016 — Validar todas las entradas

Estado: Aceptada

El backend nunca deberá confiar únicamente en las validaciones realizadas por React.

Se deberán validar:

Body
Query parameters
Route parameters
Headers

Se puede utilizar Zod, Joi u otra librería equivalente.

Ejemplo:

Request
   |
   v
Validation
   |
   +---- Error ---> 400/422
   |
   v
Controller

##18. Manejo de errores
ADR-017 — Middleware global de errores

Estado: Aceptada

Se implementará un mecanismo centralizado de manejo de errores.

Controller
     |
     v
 Service
     |
     +---- Error
             |
             v
      Error Middleware
             |
             v
       HTTP Response
Objetivos

Evitar:

try/catch repetitivos.
Respuestas inconsistentes.
Exposición de información interna.

En producción no se deberán retornar stack traces al cliente.

##19. CORS
ADR-018 — CORS restringido

Estado: Aceptada

El backend deberá permitir únicamente los orígenes autorizados.

Desarrollo:

http://localhost:5173

Producción:

https://app.example.com

Se evitará configurar indiscriminadamente:

Access-Control-Allow-Origin: *

especialmente cuando se utilicen credenciales.

##20. Seguridad
ADR-019 — Seguridad por capas

Estado: Aceptada

El backend deberá considerar:

Helmet.
CORS restringido.
Validación de entrada.
Rate limiting.
HTTPS en producción.
Gestión segura de credenciales.
Manejo seguro de tokens.
Logs sin información sensible.

Las contraseñas nunca deberán almacenarse en texto plano.

##21. Autenticación y autorización
ADR-020 — Autenticación en backend

Estado: Aceptada

La autenticación y autorización serán responsabilidades del backend.

Autenticación

Determina:

¿Quién es el usuario?
Autorización

Determina:

¿Qué puede hacer el usuario?

El frontend puede ocultar funcionalidades visualmente, pero la autorización real debe verificarse en backend.

##22. Base de datos
ADR-021 — Repository Pattern

Estado: Aceptada

El acceso a la base de datos deberá encapsularse mediante repositories.

Esto permitirá cambiar potencialmente:

SQL Server
PostgreSQL
MongoDB

sin modificar significativamente la lógica de negocio.

Principio
Service
   |
   v
Repository Interface
   |
   v
Database Implementation

##23. Transacciones
ADR-022 — Uso de transacciones

Estado: Aceptada

Las operaciones que modifiquen múltiples entidades relacionadas deberán utilizar transacciones cuando sea necesario garantizar atomicidad.

Ejemplo:

BEGIN TRANSACTION

Actualizar promoción
Actualizar estado
Registrar auditoría

COMMIT

En caso de error:

ROLLBACK

##24. Testing frontend
ADR-023 — Vitest + React Testing Library

Estado: Aceptada

El frontend utilizará:

Vitest.
React Testing Library.

Se deberán probar principalmente:

Componentes.
Hooks.
Funciones.
Validaciones.
Flujos importantes.

Los tests deberán validar comportamiento y no depender excesivamente de detalles internos de implementación.

##25. Testing backend
ADR-024 — Tests automatizados

Estado: Aceptada

Para backend se recomienda:

Vitest o Jest.
Supertest para endpoints HTTP.

Se deberán cubrir:

Services
Controllers
Validators
Repositories críticos
Endpoints
Error handling

##26. Smoke test
ADR-025 — Smoke test de integración

Estado: Aceptada

Después de construir las imágenes Docker se deberá levantar la aplicación y verificar que los servicios funcionan.

Flujo:

Docker Compose
      |
      v
Frontend
      |
      v
Backend
      |
      v
Health Check

Se recomienda implementar:

GET /health

Respuesta:

{
  "status": "ok"
}

##27. Docker
ADR-026 — Contenedores independientes

Estado: Aceptada

Frontend y backend tendrán imágenes Docker independientes.

project/
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
└── docker-compose.yml
Beneficios
Entornos reproducibles.
Separación de responsabilidades.
Facilita CI/CD.
Facilita despliegue.
Reduce diferencias entre entornos.

##28. Frontend en producción
ADR-027 — Build estático

Estado: Aceptada

El frontend será construido mediante:

npm run build

generando:

dist/

En producción se recomienda servir el contenido estático mediante un servidor como Nginx.

React/Vite
     |
     v
npm run build
     |
     v
dist/
     |
     v
Nginx

No se utilizará el servidor de desarrollo de Vite en producción.

##29. Backend en producción
ADR-028 — Node.js en modo producción

Estado: Aceptada

El backend deberá ejecutarse utilizando el código compilado.

Ejemplo:

npm ci
npm run build
npm prune --omit=dev
node dist/server.js

Se recomienda utilizar Docker multi-stage para reducir el tamaño de la imagen final.

##30. CI/CD
ADR-029 — GitHub Actions

Estado: Aceptada

El pipeline deberá tener etapas dependientes:

lint
  |
  v
test
  |
  v
build
  |
  v
smoke-test
Lint

Valida calidad del código.

Test

Ejecuta pruebas automatizadas.

Build

Construye:

Aplicación frontend.
Aplicación backend.
Imágenes Docker.
Smoke test

Levanta los servicios y comprueba la integración.

##31. Secretos
ADR-030 — Gestión segura de secretos

Estado: Aceptada

Los secretos no deberán almacenarse en:

.env versionado
Dockerfile
docker-compose.yml
Código fuente

Ejemplos:

DB_PASSWORD
JWT_SECRET
API_SECRET

deberán almacenarse mediante mecanismos seguros como GitHub Actions Secrets o el gestor de secretos utilizado por el entorno de despliegue.

El archivo:

.env.example

podrá incluir únicamente nombres de variables y valores no sensibles.

##32. ESLint
ADR-031 — ESLint

Estado: Aceptada

ESLint será utilizado para detectar:

Errores potenciales.
Código problemático.
Imports innecesarios.
Violaciones de convenciones.
Problemas de calidad.

El pipeline deberá fallar ante errores configurados como bloqueantes.

##33. Prettier
ADR-032 — Formateo automático

Estado: Aceptada

Se utilizará Prettier para mantener un formato consistente.

ESLint y Prettier deberán configurarse de forma compatible para evitar reglas contradictorias.

##34. Git Hooks
ADR-033 — Husky

Estado: Recomendada

Opcionalmente se podrá utilizar Husky para ejecutar validaciones antes de realizar commits.

Ejemplo:

git commit
     |
     v
lint
     |
     v
tests
     |
     v
commit

Las validaciones críticas deberán permanecer también en CI/CD, ya que los hooks locales pueden ser omitidos.

##35. Health Checks
ADR-034 — Endpoint de salud

Estado: Aceptada

El backend deberá proporcionar:

GET /health

Ejemplo:

{
  "status": "ok"
}

Opcionalmente:

GET /ready

podrá utilizarse para comprobar dependencias como la base de datos.

##36. Logging
ADR-035 — Logging estructurado

Estado: Aceptada

Los logs deberán incluir información útil para troubleshooting:

timestamp
level
requestId
method
url
statusCode
responseTime

Nunca se deberán registrar:

passwords
JWT
API keys
secrets
información sensible

##37. Configuración por ambientes
ADR-036 — Configuración externa

Estado: Aceptada

La aplicación deberá soportar diferentes ambientes:

development
test
production

Ejemplo:

.env
.env.example

Las configuraciones específicas del ambiente no deberán estar hardcodeadas en el código.

##38. Principios SOLID
ADR-037 — SOLID

Estado: Aceptada

Se aplicarán principalmente:

Single Responsibility Principle: cada módulo debe tener una responsabilidad clara.
Open/Closed Principle: favorecer extensiones sin modificar innecesariamente código existente.
Dependency Inversion Principle: desacoplar lógica de negocio de infraestructura.

Se evitarán controllers y services excesivamente grandes.

##39. Separación de responsabilidades

La arquitectura seguirá conceptualmente:

┌─────────────────────────┐
│      Presentation       │
│ React / Controllers     │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│ Application / Services  │
│ Casos de uso            │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│         Domain          │
│ Reglas de negocio       │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│      Infrastructure     │
│ DB / HTTP / External    │
└─────────────────────────┘

El objetivo es evitar que la lógica de negocio dependa directamente de:

React.
Express.
Base de datos.
Librerías específicas de infraestructura.

##40. Resumen de decisiones
Área	Decisión
Frontend	React.js
Build	Vite
Lenguaje	TypeScript
Backend	Node.js
Framework HTTP	Express.js
API	REST/JSON
API Version	/api/v1
Routing	React Router
Estado servidor	TanStack Query
HTTP Client	Fetch o Axios
Formularios	React Hook Form
Validación	Zod
Testing frontend	Vitest + React Testing Library
Testing backend	Vitest/Jest + Supertest
Linter	ESLint
Formatter	Prettier
Containers	Docker
Orquestación	Docker Compose
CI/CD	GitHub Actions
Health Check	/health
Configuración	Variables de entorno
Seguridad	Helmet + CORS + validación + rate limiting
Arquitectura backend	Capas
Persistencia	Repository Pattern
API	REST
Documentación API	OpenAPI/Swagger
Control de versiones	Git/GitHub

##41. Arquitectura final propuesta
                         ┌─────────────────────┐
                         │       Browser       │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP/HTTPS
                                    v
                         ┌─────────────────────┐
                         │ React.js + Vite     │
                         │ TypeScript           │
                         └──────────┬──────────┘
                                    │
                                    │ REST/JSON
                                    v
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │ TypeScript           │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     v                             v
             ┌───────────────┐             ┌───────────────┐
             │    Services   │             │  Middleware   │
             │ Business Logic│             │ Auth / Errors │
             └───────┬───────┘             └───────────────┘
                     │
                     v
             ┌───────────────┐
             │  Repository   │
             └───────┬───────┘
                     │
                     v
             ┌───────────────┐
             │   Database    │
             └───────────────┘


                     CI/CD
                       │
                       v
              ┌─────────────────┐
              │ GitHub Actions  │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          v            v            v
       Lint          Test         Build
                                    │
                                    v
                              Docker Images
                                    │
                                    v
                               Smoke Test
##42. Conclusión

La combinación React.js + Vite + TypeScript para frontend y Node.js + Express.js + TypeScript para backend proporciona una solución moderna y consistente.

Las decisiones principales buscan garantizar:

Mantenibilidad mediante separación de responsabilidades.
Escalabilidad mediante una arquitectura modular.
Calidad mediante ESLint, Prettier y testing automatizado.
Seguridad mediante validación, CORS, gestión de secretos y autorización en backend.
Reproducibilidad mediante Docker.
Automatización mediante GitHub Actions.
Observabilidad mediante health checks y logging.
Evolución de la API mediante /api/v1.
Facilidad de testing mediante separación entre controllers, services y repositories.

La arquitectura resultante permite que frontend y backend evolucionen de forma independiente manteniendo un contrato claro mediante la API REST.