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
- Supabase (DB + Auth)
- Google Maps API
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

## 📦 Scripts útiles
- `npm run dev` – Modo desarrollo
- `npm run build` – Build de producción
- `npm run preview` – Previsualizar build
- `npm run lint` – Linter

## 🎯 Tareas principales pendientes

### 🔥 Prioridad alta
- [ ] **Crear ruta para el checkout**
  - [ ] Implementar página de checkout
  - [ ] Integrar pasarela de pagos
  - [ ] Manejar estados de pago y confirmación

- [ ] **Agregar mapa al contenedor principal**
  - [ ] Integrar Google Maps en el layout principal
  - [ ] Configurar controles y opciones del mapa
  - [ ] Implementar responsive design

- [ ] **Agregar marcadores al mapa**
  - [ ] Crear marcadores dinámicos para publicaciones
  - [ ] Implementar iconos personalizados por tipo
  - [ ] Agregar eventos click y hover

### 🔧 Funcionalidades core
- [x] **Agregar sidebar** ✅
  - [x] Crear componente de sidebar con Chakra UI
  - [x] Implementar navegación y filtros básicos
  - [x] Integrar con el layout principal responsive
  - [x] Solucionar problemas de compatibilidad Tailwind/Chakra
  - [x] Configurar sistema de temas de Chakra UI correctamente
  - [x] Extraer sidebar a componente separado (Sidebar.tsx)

- [ ] **Agregar buscador al sidebar**
  - [ ] Implementar búsqueda por ubicación
  - [ ] Agregar filtros avanzados
  - [ ] Conectar con la base de datos

- [ ] **Agregar publication cards**
  - [ ] Crear componente de tarjeta de publicación
  - [ ] Mostrar información relevante
  - [ ] Implementar acciones (ver detalles, reservar)

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
