# 🏠 Residencias

Aplicación web para gestión y búsqueda de residencias estudiantiles. Construida con React, TypeScript, Tailwind CSS, Google Maps y Supabase.

## 🚀 ¿Qué hace?
- Autenticación con Google (Supabase Auth)
- Búsqueda y visualización de residencias en mapa
- Sistema de reservas y contratos de alquiler
- Gestión de publicaciones para administradores
- Pagos automáticos integrados

## 🗂️ Estructura del Proyecto

```
src/
├── components/
│   ├── common/         # Componentes reutilizables (TagChip)
│   ├── contentArea/    # Área principal (mapa, tags, login)
│   └── sidebar/        # Barra lateral (buscador, orden, cards)
├── context/            # Contextos: Auth, GoogleMaps, Tags, MapLocations, Publications
├── hooks/              # Hooks personalizados (useProvideAuth)
├── pages/              # Páginas principales (MainPage)
├── services/           # Servicios externos (supabaseClient)
├── diagrams/           # Diagramas UML (PNG y PlantUML)
```

## 🛠️ Tecnologías
- React 19 + TypeScript
- Tailwind CSS
- Supabase (DB + Auth)
- Google Maps API
- Vite

## ⚡ Instalación rápida
1. Clona el repo y entra a la carpeta:
   ```bash
   git clone https://github.com/tu-usuario/residencias.git
   cd residencias
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz con:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_API_KEY=tu_api_key_de_supabase
   VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google
   VITE_REDIRECT_URL=http://localhost:5173
   ```
4. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📦 Scripts útiles
- `npm run dev` – Modo desarrollo
- `npm run build` – Build de producción
- `npm run preview` – Previsualizar build
- `npm run lint` – Linter

## 🧩 Componentes principales
- **Sidebar**: Buscador de direcciones, orden, cards de publicaciones, crear nueva publicación
- **ContentArea**: Mapa de Google, tags, login/logout
- **Contextos**: Manejo de sesión, tags, Google Maps, ubicaciones del mapa y publicaciones

## 🗄️ Diagrama y modelos
- Diagramas UML y de estados en `src/diagrams/` (PNG y PlantUML)
- Entidades principales: user, user_data, publicacion, reserva, alquiler, pago, tags

## 📋 Tareas por realizar

### ✅ Completadas recientemente
- [X] Implementar tablas del diagrama entidad-relación
- [X] Crear funciones SQL en Supabase para consultas de publicaciones
  - [X] `get_locations_for_map()` - Obtener ubicaciones para marcadores del mapa
  - [X] `get_publications_for_sidebar()` - Obtener publicaciones con ordenamiento y paginación
- [X] Implementar contextos separados para datos del mapa y sidebar
  - [X] `MapLocationsContext` - Manejo de ubicaciones para marcadores
  - [X] `PublicationsContext` - Manejo de publicaciones con ordenamiento y carga infinita
- [X] Conectar OrderManager con contexto de publicaciones
- [X] Actualizar estructura de providers en App.tsx
- [X] Crear función en Supabase para insertar registro en user_data
- [X] Crear trigger que se ejecuta al insertar usuario en auth.users
- [X] **Sistema de ubicaciones y marcadores en mapa** (NUEVO)
  - [X] Generar 100 ubicaciones de prueba alrededor de Nueva Córdoba con SQL
  - [X] Implementar fetch directo a tabla `location` en ContentArea
  - [X] Crear marcadores dinámicos en Google Maps con iconos personalizados
  - [X] Agregar eventos click a marcadores para futura funcionalidad
  - [X] Resolver problemas de RLS (Row Level Security) en Supabase
  - [X] Corregir tipos de datos (bigint vs integer) para compatibilidad

### 🔄 En progreso
- [ ] Actualizar Sidebar para usar datos reales de Supabase
  - [ ] Reemplazar `examplePublications` por datos del contexto
  - [ ] Implementar carga infinita con Intersection Observer
  - [ ] Mostrar estados de carga y error
- [ ] Conectar ContentArea con marcadores del mapa
  - [ ] Implementar InfoWindows con información básica
  - [ ] Mostrar detalles de publicaciones al hacer click en marcadores

### 📋 Pendientes
- [ ] Crear modal de detalle de publicación
  - [ ] Mostrar información completa de la publicación
  - [ ] Permitir efectuar reserva desde el modal
  - [ ] Permitir efectuar alquiler desde el modal
- [ ] ABM completo de publicaciones
- [ ] Integrar pagos reales
- [ ] Mejorar UI/UX en mobile
- [ ] Filtros avanzados por tags y ubicación
- [ ] Gestión de contratos de alquiler
- [ ] Expiración automática de reservas
- [ ] Tests automatizados
- [ ] Documentar endpoints y modelos
- [ ] Botón para ordenar primero las publicaciones propias y mostrar solo sus puntos en el mapa
  - [ ] Mostrar el botón solo a usuarios de residencia
  - [ ] El botón debe aparecer primero en el carrusel de tags, con estilo de tag pero color diferenciado
  - [ ] Al hacer clic, ordenar la lista poniendo primero las publicaciones propias
  - [ ] Actualizar el mapa mostrando solo los puntos de las publicaciones propias
- [ ] Botón (solo para clientes con alquiler activo) para ordenar y mostrar solo sus alquileres en la lista y el mapa
  - [ ] Mostrar el botón solo a clientes con alquiler activo
  - [ ] El botón debe aparecer primero en el carrusel de tags, con estilo de tag pero color diferenciado
  - [ ] Al hacer clic, ordenar la lista poniendo primero las publicaciones asociadas al cliente
  - [ ] Actualizar el mapa mostrando solo los puntos de los alquileres del cliente
- [ ] Implementar automatización (GitHub Action o n8n) que monitoree las tareas del README (creadas, modificadas, eliminadas) y envíe reportes a Microsoft Teams u otra plataforma de gestión

## 🎯 Próximas prioridades
1. **Actualizar Sidebar** - Conectar con datos reales y carga infinita
2. **InfoWindows** - Mostrar información al hacer click en marcadores
3. **Modal de detalle** - Vista completa de publicaciones
4. **Filtros geográficos** - Búsqueda por zona específica

⭐ Si te gusta este proyecto, ¡dale una estrella!
