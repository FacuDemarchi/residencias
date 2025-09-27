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

## ✅ Logros recientes
- **Mapa implementado**: Google Maps integrado con pantalla completa
- **Layout optimizado**: Sidebar compacto (250px) para mejor UX
- **Interfaz limpia**: Controles del mapa removidos para diseño minimalista
- **Responsive design**: Funciona perfectamente en desktop y móvil
- **Marcadores funcionando**: Sistema de marcadores dinámicos con clustering automático
- **Zoom ajustado**: Mapa con zoom inicial optimizado (13) para mejor visualización
- **Estructura modular**: Componentes Map, Marker y GroupMarker organizados
- **Checkout implementado**: Página de checkout con iframe de Pago TIC integrado
- **Sistema de rutas**: React Router configurado para navegación entre páginas
- **PublicationCard implementado**: Componente compacto para mostrar publicaciones en sidebar
- **Integración de datos**: Sistema de consultas a base de datos funcionando
- **Compatibilidad Chakra UI v3**: Errores de compatibilidad corregidos

## 🎯 Tareas principales pendientes

### 🔥 Prioridad alta
- [x] **Crear ruta para el checkout** ✅
  - [x] Implementar página de checkout
  - [x] Integrar pasarela de pagos (Pago TIC con iframe)
  - [x] Manejar estados de pago y confirmación
  - [x] Configurar React Router para navegación
  - [ ] Crear una publicación en estado disponible para testear pasarela de pagos

- [x] **Agregar mapa al contenedor principal** ✅
  - [x] Integrar Google Maps en el layout principal
  - [x] Configurar controles y opciones del mapa
  - [x] Implementar responsive design

- [x] **Agregar marcadores al mapa** ✅
  - [x] Crear marcadores dinámicos para publicaciones
  - [x] Implementar iconos personalizados por tipo
  - [x] Agregar eventos click y hover
  - [x] Implementar clustering automático para ubicaciones cercanas
  - [x] Crear componentes modulares (Map, Marker, GroupMarker)
  - [ ] Corregir panTo y zoom al deseleccionar un marcador

- [ ] **Configurar Pago TIC**
  - [ ] Crear usuario en Pago TIC
  - [ ] Obtener credenciales de la API
  - [ ] Testear funcionamiento en /checkout

### 🔧 Funcionalidades core
- [x] **sidebar** ✅
  - [x] Crear componente de sidebar con Chakra UI
  - [x] Implementar navegación y filtros básicos
  - [x] Integrar con el layout principal responsive
  - [x] Solucionar problemas de compatibilidad Tailwind/Chakra
  - [x] Configurar sistema de temas de Chakra UI correctamente
  - [x] Extraer sidebar a componente separado (Sidebar.tsx)
  - [ ] Mejorar UI del sidebar

- [x] **Buscador del sidebar** ✅
  - [x] Implementar búsqueda por ubicación
  - [x] Agregar filtros avanzados
  - [x] Conectar con la base de datos
  - [ ] Mejorar UI del buscador

- [x] **Agregar publication cards** ✅
  - [x] Crear componente de tarjeta compacta (PublicationCard)
  - [x] Mostrar información básica en sidebar optimizado
  - [x] Integrar con sistema de estados y ubicaciones
  - [x] Conectar con marcadores del mapa
  - [ ] Crear PublicationDetail para vista expandida

- [ ] **Agregar manejador de filtros y orden**
  - [ ] Implementar sistema de filtros
  - [ ] Agregar opciones de ordenamiento
  - [ ] Conectar con el estado global

### 🧪 Testing y calidad
- [ ] **Construir sistema de testeo**
  - [ ] Configurar Jest y React Testing Library
  - [ ] Escribir tests unitarios para componentes
  - [ ] Implementar tests de integración
  - [ ] Configurar CI/CD con tests automáticos

⭐ Si te gusta este proyecto, ¡dale una estrella!
