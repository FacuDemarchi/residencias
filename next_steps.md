# Plan Unificado: Finalización del Prototipo

## Objetivo
Finalizar el prototipo para empezar a sumar residencias y habitaciones, mejorando la experiencia visual y agregando funcionalidades clave.

## Estado del Proyecto

### Completado
- Sistema de mapa con Google Maps y clustering básico
- Sistema de pagos con Pago TIC (Edge Functions)
- Base de datos con tabla `pagotic_transactions`
- Panel de detalle con carrusel de imágenes
- Sistema de filtros y ordenamiento
- Autenticación con Google OAuth
- Botones “Reservar/Alquilar” en Sidebar (PublicationCard) con navegación a checkout
- Botón “Mis Reservas” en desktop y móvil con modal de listado y gestión
- Estados de carga y errores unificados en la página principal

### Pendiente del Plan de Integración
- Actualizar CheckoutPage para manejar diferentes acciones (reserve/rent/cancel)
- Crear servicio dedicado para consultar publicaciones del usuario
- Configurar webhook de Pago TIC para notificaciones automáticas
- Probar integración completa con Pago TIC

## Nuevas Tareas

### 1. Mejorar Sistema de Markers

**Objetivo**: Hacer el sistema de markers más intuitivo, agrupando habitaciones de la misma residencia con un estilo visual similar a las máquinas vendedoras de Rust.

**Implementación**:
- Modificar lógica de clustering en `src/components/map/Map.tsx` para agrupar por `user_id` además de por proximidad
- Crear nuevo componente `ResidenceClusterMarker` que muestre un área visual conectando las habitaciones de la misma residencia
- Agregar iconos diferenciados:
  - Icono de edificio para clusters de residencia (múltiples habitaciones del mismo usuario)
  - Icono de cama para habitaciones individuales
  - Colores diferentes para distinguir visualmente
- Implementar clustering híbrido: primero por `user_id`, luego por proximidad geográfica
- Actualizar `src/components/map/GroupMarker.tsx` o crear nuevo componente para el estilo Rust

**Archivos a modificar**:
- `src/components/map/Map.tsx` - Lógica de clustering
- `src/components/map/GroupMarker.tsx` - Estilo visual
- `src/components/map/Marker.tsx` - Iconos diferenciados
- `src/pages/MainPage.tsx` - Pasar información de user_id a los markers

### 2. Sistema de Imágenes 3D para Residencias

**Objetivo**: Permitir almacenar y mostrar imágenes 3D de las residencias, accesibles desde las habitaciones que pertenecen a esa residencia.

**Base de Datos**:
- Crear migración para tabla `residence_3d_images`:
  ```sql
  CREATE TABLE residence_3d_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    url_imagen text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  ```
- Agregar índices y políticas RLS
- Actualizar diagrama de entidad-relación en `src/diagrams/code/entidad_relacion.puml`:
  - Agregar tabla `residence_3d_images` en la sección de imágenes
  - Agregar relación `users ||--o{ residence_3d_images : "1:N"`
  - Regenerar imagen PNG del diagrama si es necesario
- Regenerar tipos TypeScript con `npm run db:types`

**Backend/Servicios**:
- Crear servicio `src/services/residence3DService.ts`:
  - `getResidence3DImages(userId: string)` - Obtener imágenes 3D por user_id
  - `uploadResidence3DImage(userId: string, file: File)` - Subir imagen a Supabase Storage
  - `deleteResidence3DImage(imageId: string)` - Eliminar imagen

**Frontend - Visualización**:
- Modificar `src/components/DetailContainer.tsx`:
  - Agregar sección para mostrar imágenes 3D de la residencia
  - Obtener `user_id` de la publicación y cargar imágenes 3D asociadas
  - Implementar visor de imágenes 3D (puede ser un carrusel o galería)
  - Agregar indicador visual cuando hay imágenes 3D disponibles

**Frontend - Configuración**:
- Crear página o sección en panel de administración para gestionar imágenes 3D
- Integrar con Supabase Storage para subida de archivos
- Agregar validación de formato y tamaño de archivos

**Archivos a crear/modificar**:
- `database/migrations/create_residence_3d_images.sql` - Nueva migración
- `src/diagrams/code/entidad_relacion.puml` - Actualizar diagrama ER
- `src/services/residence3DService.ts` - Nuevo servicio
- `src/components/DetailContainer.tsx` - Agregar visualización
- `src/types/database.ts` - Regenerar después de migración

### 3. Cartel de Contacto para Residencias

**Objetivo**: Agregar un cartel informativo visible que permita a las residencias contactarse para ser agregadas a la aplicación.

**Implementación**:
- Crear componente `ResidenceContactBanner.tsx` o agregar directamente en MainPage
- Cartel con texto informativo: "Comunicate a este número" + número de contacto
- Ubicación: sobre el mapa, en la parte inferior, al lado del sidebar
- Diseño compacto y visible, que no interfiera con la funcionalidad del mapa
- Número de contacto configurable mediante variable de entorno `VITE_CONTACT_NUMBER` o constante
- Estilo visual atractivo pero discreto, usando Chakra UI
- Responsive: ajustar posición en móviles si es necesario

**Archivos a crear/modificar**:
- `src/components/ResidenceContactBanner.tsx` - Componente del cartel (opcional, puede integrarse directamente)
- `src/pages/MainPage.tsx` - Agregar cartel sobre el mapa, posicionado en la parte inferior al lado del sidebar
- Agregar variable de entorno `VITE_CONTACT_NUMBER` (opcional)

### 4. Finalizar Funcionalidades Pendientes

**Botones de Acción en Sidebar**:
- Modificar `src/components/PublicationCard.tsx`:
  - Agregar botón "Reservar" para publicaciones disponibles
  - Agregar botón "Alquilar" para publicaciones reservadas por el usuario
  - Redireccionar a `/checkout?id=123&action=reserve|rent`

**Servicio de Publicaciones del Usuario**:
- Crear `src/services/userPublicationsService.ts`:
  - `getUserPublications(userId: string)` - Obtener publicaciones del usuario
  - `getUserRentals(userId: string)` - Obtener alquileres activos
  - `getUserReservations(userId: string)` - Obtener reservas pendientes

**Panel "Mis Reservas"**:
- Modificar `src/components/Sidebar.tsx`:
  - Agregar botón "Mis Reservas" para usuarios autenticados
  - Mostrar lista de publicaciones del usuario
  - Permitir click en publicación para ver detalle

**CheckoutPage - Múltiples Acciones**:
- Modificar `src/pages/CheckoutPage.tsx`:
  - Leer parámetro `action` de la URL (reserve/rent/cancel)
  - Manejar diferentes flujos según la acción
  - Mostrar información específica para cada tipo de operación

**Configuración Webhook**:
- Configurar webhook en Pago TIC Dashboard
- URL: `https://pxjeifzojuckaknwlwgp.supabase.co/functions/v1/pagotic-webhook`
- Eventos: `payment.completed`, `payment.failed`, `payment.cancelled`

### 5. Preparación para Producción - Limpieza de Base de Datos

**Objetivo**: Limpiar la base de datos de datos de prueba antes de empezar a agregar residencias y habitaciones reales.

**Implementación**:
- Crear script SQL o migración para truncar tablas con datos de prueba
- Identificar tablas que contienen datos de prueba:
  - `publications` - Publicaciones de prueba
  - `locations` - Ubicaciones de prueba
  - `images` - Imágenes de prueba
  - `rentals` - Alquileres de prueba
  - `pagos` - Pagos de prueba
  - `ratings` - Calificaciones de prueba
  - `contacts` - Contactos de prueba
  - `availability` - Disponibilidad de prueba
  - `price_history` - Historial de precios de prueba
  - `state_history` - Historial de estados de prueba
  - `pagotic_transactions` - Transacciones de prueba
- Mantener tablas maestras si aplica (states, amenities, tags)
- Considerar hacer backup antes de truncar
- Verificar integridad referencial antes de ejecutar

**Archivos a crear**:
- `database/migrations/truncate_test_data.sql` - Script de limpieza
- `database/scripts/truncate-db.js` - Script Node.js opcional para ejecutar la limpieza

## Archivos Principales a Modificar

### Nuevos
- `database/migrations/create_residence_3d_images.sql`
- `src/services/residence3DService.ts`
- `src/services/userPublicationsService.ts`
- `src/components/ResidenceContactBanner.tsx` (opcional, puede integrarse directamente en MainPage)
- `src/components/map/ResidenceClusterMarker.tsx` (opcional, si se crea componente separado)

### Modificar
- `src/components/map/Map.tsx`
- `src/components/map/GroupMarker.tsx`
- `src/components/map/Marker.tsx`
- `src/components/DetailContainer.tsx`
- `src/components/Sidebar.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/MainPage.tsx` - Agregar cartel de contacto
- `src/types/database.ts` - Regenerar después de migración

## Orden de Implementación Recomendado

1. **Sistema de Markers Mejorado** - Mejora inmediata de UX
2. **Base de Datos para Imágenes 3D** - Fundación para la funcionalidad
3. **Servicios y Visualización de Imágenes 3D** - Completar funcionalidad
4. **Cartel de Contacto para Residencias** - Permitir que residencias se contacten
5. **Funcionalidades Pendientes** - Completar integración de pagos
6. **Testing y Validación** - Verificar que todo funcione correctamente
7. **Preparación para Producción** - Truncar base de datos y limpiar datos de prueba
8. **Unificación de Documentación** - Limpiar y organizar (ya completado)

## Notas Técnicas

- El clustering por `user_id` debe ser prioritario sobre el clustering por proximidad
- Las imágenes 3D se almacenan en Supabase Storage, las URLs en la base de datos
- El sistema debe manejar casos donde una residencia no tiene imágenes 3D
- Los markers deben actualizarse dinámicamente cuando cambian las publicaciones
- Las habitaciones se agrupan por residencia mediante el `user_id` de la publicación

## Tareas Detalladas

### Tarea 1: Unificar Documentación
- [ ] Limpiar README.md de tareas pendientes
- [ ] Crear archivo next_steps.md con plan completo

### Tarea 2: Mejorar Sistema de Markers
- [ ] Modificar lógica de clustering en Map.tsx para agrupar por user_id
- [ ] Crear componente ResidenceClusterMarker con estilo visual tipo Rust
- [ ] Agregar iconos diferenciados (edificio para clusters, cama para individuales)
- [ ] Implementar colores diferentes para distinguir visualmente
- [ ] Actualizar MainPage.tsx para pasar información de user_id

### Tarea 3: Sistema de Imágenes 3D
- [ ] Crear migración SQL para tabla residence_3d_images
- [ ] Configurar políticas RLS y índices
- [ ] Actualizar diagrama de entidad-relación en `src/diagrams/code/entidad_relacion.puml`
- [ ] Regenerar tipos TypeScript
- [ ] Crear servicio residence3DService.ts
- [ ] Integrar visor de imágenes 3D en DetailContainer.tsx
- [ ] Crear interfaz de administración para gestionar imágenes 3D

### Tarea 4: Cartel de Contacto para Residencias
- [ ] Crear componente ResidenceContactBanner.tsx o integrar directamente en MainPage
- [ ] Agregar texto "Comunicate a este número" + número de contacto
- [ ] Posicionar cartel sobre el mapa, en la parte inferior, al lado del sidebar
- [ ] Configurar número de contacto (variable de entorno o constante)
- [ ] Diseñar cartel con estilo compacto y visible usando Chakra UI
- [ ] Asegurar que sea responsive y no interfiera con la funcionalidad del mapa

### Tarea 5: Funcionalidades Pendientes
- [x] Agregar botones "Reservar" y "Alquilar" en Sidebar (PublicationCard)
- [ ] Crear servicio userPublicationsService.ts
- [x] Implementar botón "Mis Reservas" en Sidebar y header móvil
- [ ] Actualizar CheckoutPage.tsx para manejar múltiples acciones
- [ ] Configurar webhook de Pago TIC en el dashboard

### Tarea 6: Testing y Validación
- [ ] Probar integración completa con Pago TIC
- [ ] Validar sistema de markers mejorado
- [ ] Probar carga y visualización de imágenes 3D
- [ ] Verificar flujo completo de reservas y alquileres

### Tarea 7: Preparación para Producción - Limpieza de Base de Datos
- [ ] Crear script o migración para truncar tablas de datos de prueba
- [ ] Identificar tablas que contienen datos de prueba (publications, locations, images, etc.)
- [ ] Truncar tablas manteniendo la estructura (DELETE o TRUNCATE según corresponda)
- [ ] Verificar que las tablas maestras (states, amenities, tags) se mantengan si aplica
- [ ] Documentar el proceso de limpieza para futuras referencias
- [ ] Backup de datos de prueba antes de truncar (opcional pero recomendado)

