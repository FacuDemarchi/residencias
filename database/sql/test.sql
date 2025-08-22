-- Archivo de prueba para Postgrestools
-- Este archivo te permitirá verificar que el autocompletado y diagnósticos funcionan

-- Consulta básica para obtener todas las publicaciones de prueba
SELECT * FROM publications_test;

-- Consulta con filtros básicos
SELECT 
    id,
    titulo,
    descripcion,
    price,
    created_at
FROM publications_test 
ORDER BY created_at DESC;

-- Consulta básica sin filtros
SELECT 
    id,
    titulo,
    descripcion,
    price,
    user_id
FROM publications_test;

-- Consulta para contar publicaciones por user_id
SELECT 
    user_id,
    COUNT(id) as total_publications
FROM publications_test
GROUP BY user_id
ORDER BY total_publications DESC;

-- Ejemplo de UPDATE en publications_test
UPDATE publications_test 
SET price = 180000, 
    updated_at = NOW() 
WHERE id = 1;

-- Ejemplo de DELETE en publications_test
DELETE FROM publications_test 
WHERE id = 999;
