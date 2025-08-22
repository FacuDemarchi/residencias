-- Consultas útiles para explorar la estructura de la base de datos
-- Estas consultas te ayudarán a generar el diagrama de entidad-relación

-- 1. Listar todas las tablas existentes
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Obtener estructura completa de todas las tablas
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
  AND c.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- 3. Obtener claves primarias
SELECT 
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.ordinal_position;

-- 4. Obtener claves foráneas (relaciones)
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 5. Obtener tipos de datos personalizados (si existen)
SELECT 
    t.typname as type_name,
    e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY t.typname, e.enumsortorder;

-- 6. Obtener comentarios de tablas y columnas
SELECT 
    c.table_name,
    c.column_name,
    pgd.description as column_comment
FROM pg_catalog.pg_statio_all_tables st
JOIN pg_catalog.pg_description pgd ON pgd.objoid = st.relid
JOIN information_schema.columns c ON pgd.objsubid = c.ordinal_position 
    AND c.table_schema = st.schemaname 
    AND c.table_name = st.relname
WHERE c.table_schema = 'public'
ORDER BY c.table_name, c.ordinal_position;


