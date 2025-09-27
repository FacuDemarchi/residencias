# 🏠 Residencias

Aplicación web para gestión y búsqueda de residencias estudiantiles. Construida con React, TypeScript, Tailwind CSS, Google Maps y Supabase.

## 🚀 ¿Qué hace?
- Autenticación con Google (Supabase Auth)
- Búsqueda y visualización de residencias en mapa
- Sistema de reservas y contratos de alquiler
- Gestión de publicaciones para administradores
- Pagos automáticos integrados

## 🛠️ Tecnologías
- React 19 + TypeScript
- **Tailwind CSS** (Layout responsive)
- **Chakra UI** (Componentes UI) ✅
- **React Router DOM** (Navegación entre páginas) ✅
- Supabase (DB + Auth)
- Google Maps API
- **Pago TIC** (Pasarela de pagos con iframe) ✅
- Vite

## ⚡ Instalación rápida
1. Clona el repo y entra a la carpeta:
   ```bash
   git clone https://github.com/FacuDemarchi/residencias.git
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
   ```
4. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🛣️ Rutas disponibles
- **`/`** - Página principal con mapa y sidebar
- **`/checkout?id=123`** - Página de checkout con iframe de Pago TIC

## 📦 Scripts útiles
- `npm run dev` – Modo desarrollo
- `npm run build` – Build de producción
- `npm run preview` – Previsualizar build
- `npm run lint` – Linter
- `npm run test:db` – Script de testing para verificar datos de la base de datos

## ✅ Estado actual
- **Mapa**: Google Maps integrado con marcadores dinámicos y clustering
- **Layout**: Sidebar compacto responsive con navegación
- **Checkout**: Página de checkout con iframe de Pago TIC
- **Componentes**: PublicationCard, Map, Marker, GroupMarker implementados
- **Datos**: Sistema de consultas a base de datos funcionando
- **Rutas**: React Router configurado para navegación
- **Sistema de Selección**: Selección de publicaciones desde sidebar y mapa ✅
- **Panel de Detalle**: Carrusel de imágenes con navegación y información completa ✅
- **UX Mejorada**: Destacado visual, pan to automático, layout optimizado ✅

## 🎯 Próximas tareas

### 🔥 Prioridad alta
- [x] **Sistema de selección de publicaciones** ✅
  - [x] Configurar variables `publicacionSeleccionada` y `grupoSeleccionado`
  - [x] Click en publicación del sidebar → seleccionar publicación
  - [x] Click en marcador simple → seleccionar publicación
  - [x] Click en marcador de grupo → seleccionar grupo
  - [x] Destacar publicación seleccionada en sidebar
  - [x] Pan to automático hacia publicación seleccionada
  - [x] Contenedor de detalle al lado del sidebar

- [x] **Mejorar PublicationCard** ✅
  - [x] Remover botón "ver y reservar"
  - [x] Hacer toda la card clickeable
  - [x] Invitar a hacer click para ver más información

- [ ] **Mejorar filtros del sidebar**
  - [ ] Quitar títulos innecesarios
  - [ ] Agregar métodos de ordenamiento como fichas
  - [ ] Implementar: menor precio, más grandes, etc.

### 🔧 Funcionalidades core
- [ ] **Actualizar base de datos**
  - [ ] Truncar datos existentes
  - [ ] Crear datos más realistas
  - [ ] Distribuir mejor las ubicaciones en el mapa

- [ ] **Migrar Google Maps API**
  - [ ] Reemplazar `google.maps.Marker` por `google.maps.marker.AdvancedMarkerElement`
  - [ ] Reemplazar `google.maps.places.AutocompleteService` por `google.maps.places.AutocompleteSuggestion`
  - [ ] Actualizar componentes Map, Marker y GroupMarker

- [ ] **Panel de administración para residencias**
  - [ ] Dashboard para gestionar publicaciones
  - [ ] Formulario para crear/editar publicaciones
  - [ ] Gestión de imágenes de publicaciones
  - [ ] Vista de reservas y alquileres
  - [ ] Estadísticas de publicaciones

- [ ] **Panel de cliente**
  - [ ] Historial de alquileres
  - [ ] Favoritos/guardados
  - [ ] Notificaciones de reservas
  - [ ] Perfil y configuración

- [ ] **Sistema de reservas completo**
  - [ ] Flujo de reserva paso a paso
  - [ ] Calendario de disponibilidad
  - [ ] Confirmación de reservas
  - [ ] Notificaciones por email
  - [ ] Gestión de estados de reserva

- [ ] **Sistema de pagos**
  - [ ] Integración completa con Pago TIC
  - [ ] Historial de pagos
  - [ ] Reembolsos y cancelaciones
  - [ ] Facturación automática

- [ ] **Mejoras de UX/UI**
  - [ ] Loading states en todos los componentes
  - [ ] Manejo de errores con mensajes claros
  - [ ] Animaciones y transiciones
  - [ ] Optimización para móviles
  - [ ] Accesibilidad (a11y)

- [ ] **Funcionalidades avanzadas**
  - [ ] Búsqueda con filtros avanzados
  - [ ] Sistema de calificaciones y reseñas
  - [ ] Chat entre cliente y residencia
  - [ ] Notificaciones push
  - [ ] Modo offline básico

⭐ Si te gusta este proyecto, ¡dale una estrella!