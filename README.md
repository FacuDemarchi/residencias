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
- **Integración Pago TIC**: Sistema completo de pagos con Edge Functions ✅
- **Base de datos actualizada**: Tabla pagotic_transactions con políticas RLS ✅

## 🎯 Tareas pendientes

### 🔥 Prioridad alta - Correcciones urgentes
- [x] **Corregir zoom out al deseleccionar** ✅
- [x] **Mejorar autocomplete de búsqueda** ✅
- [x] **Botón de checkout en detalle** ✅ → [Ver detalles](integration-plan.plan.md#5-actualizar-checkoutpagetsx)

### 🔧 Funcionalidades core
- [ ] **Sistema de amenities** → [Ver detalles](integration-plan.plan.md#6-crear-servicio-de-pago-tic)
- [x] **Revisar procedimiento de checkout** ✅ → [Ver detalles](integration-plan.plan.md#5-actualizar-checkoutpagetsx)
- [ ] **Panel de publicaciones del usuario** → [Ver detalles](integration-plan.plan.md#6-crear-servicio-de-pago-tic)
- [x] **Actualizar base de datos** ✅ → [Ver detalles](integration-plan.plan.md#1-crear-tabla-para-transacciones-de-pago-tic)
- [ ] **Migrar Google Maps API** → [Ver detalles](integration-plan.plan.md#8-testing-local)

### 👤 Gestión de usuario
- [ ] **Botón "Mis Reservas"** → [Ver detalles](integration-plan.plan.md#implementar-botón-mis-reservas-en-panel-principal)
- [ ] **Botones de acción en detalle** → [Ver detalles](integration-plan.plan.md#agregar-botones-reservar-y-alquilar-en-detailcontainer)
- [ ] **Consultar publicaciones del usuario** → [Ver detalles](integration-plan.plan.md#crear-servicio-para-consultar-publicaciones-del-usuario)

### 💳 Sistema de pagos y reservas
- [x] **Sistema de reservas completo** ✅ → [Ver detalles](integration-plan.plan.md#4-crear-edge-function-para-webhooks)
- [x] **Sistema de pagos** ✅ → [Ver detalles](integration-plan.plan.md#3-crear-edge-function-para-iniciar-pago)
- [ ] **Pruebas de integración Pago TIC** → [Ver detalles](integration-plan.plan.md#probar-integración-completa-con-pago-tic)
- [ ] **Configurar webhook Pago TIC** → [Ver detalles](integration-plan.plan.md#configurar-webhook-de-pago-tic-para-notificaciones-automáticas)

### 🎨 Mejoras de UX/UI
- [ ] **Estados de carga y errores** → [Ver detalles](integration-plan.plan.md#5-actualizar-checkoutpagetsx)
- [ ] **Optimización móvil** → [Ver detalles](integration-plan.plan.md#8-testing-local)

### 🚀 Funcionalidades avanzadas
- [ ] **Búsqueda avanzada** → [Ver detalles](integration-plan.plan.md#6-crear-servicio-de-pago-tic)
- [ ] **Sistema social** → [Ver detalles](integration-plan.plan.md#4-crear-edge-function-para-webhooks)
- [ ] **Funcionalidades offline** → [Ver detalles](integration-plan.plan.md#8-testing-local)

⭐ Si te gusta este proyecto, ¡dale una estrella!