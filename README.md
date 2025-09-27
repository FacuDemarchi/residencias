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
- **Tooltip de Marcadores**: Información básica en hover con datos de publicación ✅
- **Sistema de Filtros**: Panel de filtros con ordenamiento y filtro de precio funcional ✅
- **Corrección de Google Maps**: Solucionado error de inicialización de la API ✅

## 🎯 Tareas pendientes

### 🔥 Prioridad alta - Correcciones urgentes
- [x] **Corregir zoom out al deseleccionar** ✅
  - [x] Implementar zoom automático cuando se deselecciona una publicación
  - [x] Ajustar el nivel de zoom para mostrar todas las publicaciones
  - [x] Mantener el centro del mapa apropiado

- [x] **Mejorar autocomplete de búsqueda** ✅
  - [x] Expandir tipos de lugares en Google Places API
  - [x] Agregar más opciones de búsqueda (lugares, establecimientos)
  - [x] Mejorar relevancia de resultados
  - [x] Optimizar performance del autocomplete

- [ ] **Botón de checkout en detalle**
  - [ ] Agregar botón "Reservar" en el panel de detalle
  - [ ] Redireccionar correctamente al checkout con ID de publicación
  - [ ] Validar disponibilidad antes de redireccionar

### 🔧 Funcionalidades core
- [ ] **Sistema de amenities**
  - [ ] Agregar campo de amenities en creación de publicaciones
  - [ ] Configurar asociación de amenities con publicaciones
  - [ ] Mostrar amenities en el detalle de publicación
  - [ ] Filtros por amenities en el sidebar

- [ ] **Revisar procedimiento de checkout**
  - [ ] Analizar flujo actual de checkout
  - [ ] Verificar integración con Pago TIC
  - [ ] Mejorar validaciones y confirmaciones
  - [ ] Optimizar experiencia de usuario

- [ ] **Panel de publicaciones del usuario**
  - [ ] Botón para buscar publicaciones alquiladas
  - [ ] Historial de alquileres del usuario
  - [ ] Estado de reservas activas
  - [ ] Acceso rápido a publicaciones contratadas

- [ ] **Actualizar base de datos**
  - [ ] Truncar datos existentes
  - [ ] Crear datos más realistas
  - [ ] Distribuir mejor las ubicaciones en el mapa

- [ ] **Migrar Google Maps API**
  - [ ] Reemplazar `google.maps.Marker` por `google.maps.marker.AdvancedMarkerElement`
  - [ ] Reemplazar `google.maps.places.AutocompleteService` por `google.maps.places.AutocompleteSuggestion`
  - [ ] Actualizar componentes Map, Marker y GroupMarker

### 👤 Panel de cliente
- [ ] **Gestión de usuario**
  - [ ] Historial de alquileres
  - [ ] Favoritos/guardados
  - [ ] Notificaciones de reservas
  - [ ] Perfil y configuración

### 💳 Sistema de pagos y reservas
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

### 🎨 Mejoras de UX/UI
- [ ] **Estados de carga y errores**
  - [ ] Loading states en todos los componentes
  - [ ] Manejo de errores con mensajes claros
  - [ ] Animaciones y transiciones suaves

- [ ] **Optimización móvil**
  - [ ] Mejoras específicas para dispositivos móviles
  - [ ] Accesibilidad (a11y)
  - [ ] Performance optimizations

### 🚀 Funcionalidades avanzadas
- [ ] **Búsqueda avanzada**
  - [ ] Filtros más específicos (amenities, ubicación exacta)
  - [ ] Búsqueda por texto con autocompletado mejorado

- [ ] **Sistema social**
  - [ ] Sistema de calificaciones y reseñas
  - [ ] Chat entre cliente y residencia
  - [ ] Notificaciones push

- [ ] **Funcionalidades offline**
  - [ ] Modo offline básico
  - [ ] Cache de datos esenciales

⭐ Si te gusta este proyecto, ¡dale una estrella!