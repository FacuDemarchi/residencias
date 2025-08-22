// Datos de disponibilidad para insertar en la base de datos
// Estructura según diagrama ER: id, publication_id, start_date, end_date, is_available, reason, created_at, updated_at, created_by, updated_by, deleted_at
const availabilityData = [
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440047",
    start_date: "2025-01-01",
    end_date: "2025-01-31",
    is_available: true,
    reason: "Disponible para alquiler"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440048",
    start_date: "2025-02-01",
    end_date: "2025-02-28",
    is_available: true,
    reason: "Disponible para alquiler"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440049",
    start_date: "2025-03-01",
    end_date: "2025-03-31",
    is_available: false,
    reason: "Ocupado por inquilino actual"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440050",
    start_date: "2025-04-01",
    end_date: "2025-04-30",
    is_available: true,
    reason: "Disponible para alquiler"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440051",
    start_date: "2025-05-01",
    end_date: "2025-05-31",
    is_available: true,
    reason: "Disponible para alquiler"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440052",
    start_date: "2025-06-01",
    end_date: "2025-06-30",
    is_available: false,
    reason: "En mantenimiento"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440053",
    start_date: "2025-07-01",
    end_date: "2025-07-31",
    is_available: true,
    reason: "Disponible para alquiler"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440054",
    start_date: "2025-08-01",
    end_date: "2025-08-31",
    is_available: true,
    reason: "Disponible para alquiler"
  }
];

export default availabilityData;
