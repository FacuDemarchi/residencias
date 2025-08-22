-- Consulta detallada para describir la estructura de todas las tablas

-- Información completa de columnas para publications_test
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'publications_test' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Información completa de columnas para publications
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'publications' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Información completa de columnas para tags
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'tags' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Información completa de columnas para location
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'location' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Información completa de columnas para amenities
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'amenities' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Información completa de columnas para publication_amenities
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'publication_amenities' 
  AND table_schema = 'public'
ORDER BY ordinal_position;


