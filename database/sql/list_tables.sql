-- Consulta para listar todas las tablas existentes en la base de datos
-- Esta consulta muestra las tablas del esquema público

-- Listar todas las tablas del esquema público
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Listar tablas con más detalles
SELECT 
    t.table_name,
    t.table_type,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
  AND c.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- Contar el número total de tablas
SELECT 
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Listar solo tablas (excluyendo vistas)
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;


