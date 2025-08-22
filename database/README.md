# 📊 Base de Datos - Residencias

Este directorio contiene todos los scripts y herramientas para gestionar la base de datos del proyecto de residencias.

## 📁 Estructura de Carpetas

```
database/
├── README.md                    # Este archivo
├── scripts/                     # Scripts de Node.js para gestión de BD
│   ├── data/                    # Datos de prueba separados por tabla
│   │   ├── locations.js         # Ubicaciones de prueba
│   │   ├── states.js           # Estados de publicaciones
│   │   ├── publications.js     # Publicaciones de prueba
│   │   ├── tags.js             # Tags del sistema
│   │   ├── amenities.js        # Amenidades disponibles
│   │   ├── rentals.js          # Alquileres de prueba
│   │   ├── pagos.js            # Pagos de prueba
│   │   ├── ratings.js          # Calificaciones de prueba
│   │   ├── contacts.js         # Contactos de prueba
│   │   ├── images.js           # Imágenes de prueba
│   │   ├── price-history.js    # Historial de precios
│   │   ├── availability.js     # Disponibilidad por fechas
│   │   └── state-history.js    # Historial de cambios de estado
│   ├── insert-data.js          # Script principal de inserción
│   ├── list-table-data.js      # Script para listar datos de tablas
│   └── check-table-structure.js # Script para verificar estructura
├── sql/                        # Consultas SQL
│   ├── describe_tables.sql     # Describir estructura de tablas
│   ├── get_all_table_structure.sql # Obtener estructura completa
│   ├── list_tables.sql         # Listar todas las tablas
│   ├── simple_list_tables.sql  # Lista simple de tablas
│   ├── example_queries.sql     # Ejemplos de consultas
│   └── test.sql               # Consultas de prueba
└── postgrestools.jsonc         # Configuración de PostgreSQL Tools
```

## 🚀 Comandos Disponibles

### 📋 **Listar y Explorar Datos**

```bash
# Listar todas las tablas del proyecto
npm run db:list-table-data

# Ver datos de una tabla específica
npm run db:list-table-data <tabla>
# Ejemplos:
npm run db:list-table-data publications
npm run db:list-table-data location
npm run db:list-table-data states
```

### 📝 **Insertar Datos de Prueba**

```bash
# Insertar datos en una tabla específica
npm run db:insert-data <tabla>

# Ejemplos:
npm run db:insert-data locations      # Ubicaciones
npm run db:insert-data states         # Estados
npm run db:insert-data publications   # Publicaciones
npm run db:insert-data tags           # Tags
npm run db:insert-data amenities      # Amenidades
npm run db:insert-data rentals        # Alquileres
npm run db:insert-data pagos          # Pagos
npm run db:insert-data ratings        # Calificaciones
npm run db:insert-data contacts       # Contactos
npm run db:insert-data images         # Imágenes
npm run db:insert-data price-history  # Historial de precios
npm run db:insert-data availability   # Disponibilidad
npm run db:insert-data state-history  # Historial de estados

# Insertar TODOS los datos de una vez
npm run db:insert-data all
```

### 🛠️ **Herramientas de Base de Datos**

```bash
# Gestión de PostgreSQL local
npm run db:start              # Iniciar PostgreSQL
npm run db:stop               # Detener PostgreSQL
npm run db:check              # Verificar estado
npm run db:init               # Inicializar
npm run db:clean              # Limpiar
```

## 📊 **Tablas del Sistema**

### 🏠 **Publicaciones y Ubicaciones**
- **`publications`** - Publicaciones principales
- **`location`** - Ubicaciones de las propiedades
- **`states`** - Estados de las publicaciones
- **`state_history`** - Historial de cambios de estado

### 🏷️ **Tags y Amenidades**
- **`tags`** - Etiquetas del sistema
- **`amenities`** - Amenidades disponibles
- **`publication_tags`** - Relación publicaciones-tags
- **`publication_amenities`** - Relación publicaciones-amenidades

### 🏡 **Alquileres y Pagos**
- **`rentals`** - Contratos de alquiler
- **`pagos`** - Registro de pagos
- **`ratings`** - Calificaciones y reseñas

### 📊 **Historial y Datos**
- **`price_history`** - Historial de cambios de precio
- **`images`** - Imágenes de las propiedades
- **`contacts`** - Información de contacto
- **`availability`** - Control de disponibilidad

## 🔧 **Características del Sistema**

### ✅ **Separación de Datos y Lógica**
- Los datos están separados en archivos individuales en `scripts/data/`
- La lógica de inserción está centralizada en `insert-data.js`
- Fácil mantenimiento y actualización de datos

### ✅ **Sistema de Comandos Simplificado**
- Un solo comando para todas las operaciones: `npm run db:insert-data <tabla>`
- Soporte para múltiples formatos de nombre (ej: `price-history` o `price_history`)
- Manejo automático de errores y duplicados

### ✅ **Datos Realistas**
- Datos coherentes entre tablas
- Información realista para testing
- Relaciones correctas entre entidades

### ✅ **Manejo de Errores**
- Detección automática de campos inexistentes
- Manejo de restricciones de unicidad
- Mensajes informativos de errores

## 🎯 **Ejemplos de Uso**

### **Escenario 1: Desarrollo Inicial**
```bash
# Insertar datos básicos para empezar
npm run db:insert-data locations
npm run db:insert-data states
npm run db:insert-data publications
```

### **Escenario 2: Testing Completo**
```bash
# Insertar todos los datos para testing completo
npm run db:insert-data all
```

### **Escenario 3: Verificar Datos**
```bash
# Ver qué datos tenemos
npm run db:list-table-data
npm run db:list-table-data publications
```

## 📝 **Notas Importantes**

1. **Estructura de Base de Datos**: Los datos están basados en el diagrama ER en `diagrams/code/entidad_relacion.puml`

2. **UUIDs de Prueba**: Se usa `00000000-0000-0000-0000-000000000001` como UUID de prueba

3. **Manejo de Duplicados**: El sistema detecta automáticamente si los datos ya existen

4. **Relaciones**: Las publicaciones se insertan con relaciones automáticas a `location` y `states`

5. **Formato de Datos**: Todos los datos están en formato ES modules (`.js`)

## 🚨 **Solución de Problemas**

### **Error: "Could not find column"**
- Verificar que los campos en los archivos de datos coincidan con la estructura real de la BD
- Revisar el diagrama ER para confirmar la estructura

### **Error: "Table not found"**
- Verificar que la tabla existe en la base de datos
- Usar `npm run db:list-table-data` para ver tablas disponibles

### **Error: "Duplicate key"**
- Normal, indica que los datos ya existen
- El sistema maneja esto automáticamente

---

**💡 Tip**: Usa `npm run db:insert-data` sin parámetros para ver todos los comandos disponibles.
