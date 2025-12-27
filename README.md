# Residencias

Aplicación web para gestión y búsqueda de residencias estudiantiles. Proyecto principal de portafolio con enfoque en arquitectura limpia, integración de servicios y experiencia de usuario.

## Resumen
- SPA en `React + TypeScript` con `Vite`.
- UI con `Chakra UI` y utilidades `Tailwind CSS`.
- Datos y autenticación con `Supabase`.
- Mapas interactivos con `Google Maps`.
- Pasarela de pagos integrada con `Pago TIC` mediante `Supabase Edge Functions`.

## Cómo funciona
- Página principal: muestra el mapa y un panel lateral con publicaciones. La ubicación del mapa filtra resultados en tiempo real y permite seleccionar una publicación para ver su detalle.
- Búsqueda y filtros: barra de dirección, ordenamiento, precio y tags. Los filtros impactan el listado y los marcadores.
- Detalle y selección: al elegir una publicación, se muestra galería, ubicación, características y acciones.
- Checkout: crea un pago o suscripción con Pago TIC y registra la transacción. Se hace seguimiento del estado vía webhook o polling.
- Administración: panel para crear, editar y activar/desactivar publicaciones; manejo de imágenes en un bucket de Supabase.

## Arquitectura
- Enrutamiento: `react-router-dom` con rutas `"/"`, `"/checkout"`, `"/admin"` y formularios de publicaciones.
- Estado global: Contextos para `Auth`, `Google Maps` y `Tags` envuelven la aplicación.
- Servicios: capa de servicios sobre `@supabase/supabase-js` para consultas, joins y cache en memoria.
- Edge Functions: tres funciones para crear pagos, crear suscripciones y recibir el webhook de Pago TIC.
- Tipos: tipos de base generados desde Supabase y utilizados en páginas y servicios para seguridad de tipos.

## Stack técnico
- Frontend: `React 19`, `TypeScript`, `Chakra UI`, `Tailwind CSS`, `React Router`.
- Build: `Vite 7` con división de vendors.
- Datos: `Supabase` (DB, Auth, Storage, Edge Functions).
- Mapas: `Google Maps JavaScript API`.
- Pagos: `Pago TIC` (documentado en `docs/pagotic.md`).
- Calidad: `ESLint` y configuración estricta de TypeScript.

## Estructura del proyecto
- `src/components/` componentes de mapa, tarjetas, sidebar, filtros y rutas protegidas.
- `src/context/` `AuthContext`, `GoogleMapsContext`, `TagsContext`.
- `src/pages/` páginas principales y de administración.
- `src/services/` `publicationsService`, `locationsService`, `pagoticService`, `adminService`, `supabaseClient`.
- `src/types/` tipos generados y tipos de app.
- `supabase/functions/` funciones Edge para pagos y webhooks.
- `database/scripts/` utilidades para semillas y mantenimiento.
- `docs/` documentación complementaria (Pago TIC).
- Configuración: `vite.config.ts`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.cjs`, `eslint.config.js`.

## Proceso de creación
- Diseño de dominio: definición de entidades (`publications`, `locations`, `states`, `state_history`, `pagotic_transactions`) y reglas de negocio (RLS en Supabase).
- Tipado primero: generación de tipos de DB y uso de `Tables<'...'>` en toda la capa de datos para prevenir errores.
- UI y UX iterativas: mapa con marcadores agrupados, sidebar responsive, panel de detalle con galería y accesibilidad de componentes Chakra.
- Integración de servicios: Google Maps con carga segura del script y reintentos; Pago TIC encapsulado en Edge Functions para aislar secretos; almacenamiento de imágenes en buckets.
- Observabilidad básica: estados de carga y error en contextos y páginas, logs controlados en funciones Edge.
- Rendimiento: división de vendors en Vite, memoización y cache ligera en servicios, queries con filtros eficientes y paginación cuando aplica.

## Roadmap e ideas a futuro
- Búsqueda avanzada: por amenities, rango de fechas y distancia.
- Optimización móvil y rendimiento: virtualización de listas y lazy chunks.
- Sistema social: reseñas, calificaciones y verificación.
- Funcionalidades offline: cache de resultados y últimas búsquedas.
- Panel del usuario: reservas, pagos y publicaciones propias.
- Pruebas automatizadas: `vitest` para UI y servicios, tests de integración de Edge Functions.
- Observabilidad: métricas de uso y trazas de funciones.

## Scripts y desarrollo local
- Instalar dependencias:
  ```
  npm install
  ```
- Variables de entorno (`.env`):
  ```
  VITE_SUPABASE_URL=<url>
  VITE_SUPABASE_API_KEY=<anon_key>
  VITE_GOOGLE_MAPS_API_KEY=<api_key>
  ```
- Desarrollo:
  ```
  npm run dev
  ```
- Build y preview:
  ```
  npm run build
  npm run preview
  ```
- Lint:
  ```
  npm run lint
  ```
- Tipos de base:
  ```
  npm run db:types
  ```
- Verificación de datos:
  ```
  npm run test:db
  ```

## Despliegue y servicios
- Supabase: crear proyecto, configurar tablas y políticas; usar `env.example` como guía de variables.
- Edge Functions: desplegar funciones de Pago TIC y configurar el webhook para actualizar transacciones.
- Google Maps: restringir la clave de API por dominio y rutas.
- Storage: bucket de imágenes con reglas de acceso seguras.

## Capacidades demostradas
- Arquitectura de SPA con separación clara de responsabilidades.
- Integración de terceros segura (Pago TIC, Google Maps, Supabase).
- Tipado estricto y uso de generadores de tipos para DB.
- Diseño de experiencia de usuario con mapa, filtros y detalle.
- Automatización con scripts de base de datos y funciones.

## Recursos
- Documentación de pagos: `docs/pagotic.md`
- Próximos pasos y tareas: `next_steps.md`

---
Si este proyecto te resultó útil, considera dejar una estrella y visitar el código para ver cómo se estructura cada capa.
