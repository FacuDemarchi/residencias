# Configuración de Postgrestools

## ¿Qué es Postgrestools?

Postgrestools es una herramienta que te permite:
- Generar tipos TypeScript automáticamente desde tu base de datos PostgreSQL
- Crear y gestionar migraciones de base de datos
- Generar seeders para datos de prueba
- Explorar tu base de datos con una interfaz visual

## Configuración Inicial

### 1. Variables de Entorno

Copia el archivo `env.example` a `.env` y configura tus credenciales:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus datos reales:

```env
# Para PostgreSQL local
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db

# Para Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### 2. Configuración del Archivo

El archivo `postgrestools.config.ts` ya está configurado con:
- Generación de tipos TypeScript en `./src/types`
- Migraciones en `./migrations`
- Seeders en `./seeders`

## Comandos Disponibles

### Generar Tipos TypeScript
```bash
npm run db:types
```
Genera tipos TypeScript basados en tu esquema de base de datos.

### Crear Migración
```bash
npm run db:generate
```
Genera una nueva migración basada en los cambios detectados.

### Ejecutar Migraciones
```bash
npm run db:migrate
```
Aplica las migraciones pendientes a la base de datos.

### Ejecutar Seeders
```bash
npm run db:seed
```
Ejecuta los seeders para poblar la base de datos con datos de prueba.

### Abrir Studio
```bash
npm run db:studio
```
Abre la interfaz visual para explorar y gestionar tu base de datos.

## Uso con Supabase

Si estás usando Supabase, asegúrate de:

1. Configurar las variables de entorno de Supabase en `.env`
2. Usar la URL y keys correctas de tu proyecto
3. Tener permisos adecuados en tu base de datos

## Estructura de Archivos

```
├── postgrestools.config.ts    # Configuración principal
├── src/
│   └── types/                 # Tipos TypeScript generados
├── migrations/                # Archivos de migración
├── seeders/                   # Archivos de seeder
└── .env                       # Variables de entorno
```

## Próximos Pasos

1. Configura tus credenciales en `.env`
2. Ejecuta `npm run db:types` para generar tipos
3. Usa `npm run db:studio` para explorar tu base de datos
4. Crea migraciones según necesites con `npm run db:generate`

## Comandos Adicionales

También puedes usar comandos directos de Postgrestools:

```bash
# Ver ayuda
npx postgrestools --help

# Generar tipos específicos
npx postgrestools types --table usuarios

# Crear migración específica
npx postgrestools generate --name crear_tabla_usuarios
```
