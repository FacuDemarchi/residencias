-- Script para borrar la función antigua y crear la nueva
DROP FUNCTION IF EXISTS get_publications_for_sidebar(center_lat double precision, center_lng double precision, limit_count integer, offset_count integer, order_type text, radius_km double precision);

-- Función SQL corregida para usar la tabla publications real
CREATE OR REPLACE FUNCTION get_publications_by_locations(
  location_ids text[],
  max_results integer DEFAULT 20,
  sort_by text DEFAULT ''created_at'',
  sort_order text DEFAULT ''desc'',
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id text,
  user_id text,
  location_id text,
  estado text,
  titulo text,
  descripcion text,
  price numeric,
  direccion text,
  capacidad integer,
  metros_cuadrados integer,
  amenidades text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  imagen text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.location_id,
    s.nombre as estado,
    p.titulo,
    p.descripcion,
    p.price,
    l.direccion,
    p.capacidad,
    p.metros_cuadrados,
    ARRAY[]::text[] as amenidades, -- Por ahora vacío, se puede expandir después
    p.created_at,
    p.updated_at,
    '''' as imagen -- Por ahora vacío, se puede expandir después
  FROM publications p
  JOIN location l ON p.location_id = l.id
  JOIN states s ON p.current_state_id = s.id
  WHERE p.location_id = ANY(location_ids)
    AND s.nombre = ''disponible''
    AND p.is_active = true
    AND p.deleted_at IS NULL
  ORDER BY 
    CASE 
      WHEN sort_by = ''price'' AND sort_order = ''asc'' THEN p.price
    END ASC,
    CASE 
      WHEN sort_by = ''price'' AND sort_order = ''desc'' THEN p.price
    END DESC,
    CASE 
      WHEN sort_by = ''capacidad'' AND sort_order = ''asc'' THEN p.capacidad
    END ASC,
    CASE 
      WHEN sort_by = ''capacidad'' AND sort_order = ''desc'' THEN p.capacidad
    END DESC,
    CASE 
      WHEN sort_by = ''created_at'' AND sort_order = ''asc'' THEN p.created_at
    END ASC,
    CASE 
      WHEN sort_by = ''created_at'' AND sort_order = ''desc'' THEN p.created_at
    END DESC
  LIMIT max_results
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
