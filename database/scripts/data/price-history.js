// Datos de historial de precios para insertar en la base de datos
// Estructura según diagrama ER: id, publication_id, precio_anterior, precio_nuevo, motivo_cambio, user_id, created_at, updated_at, created_by, updated_by, deleted_at
const priceHistoryData = [
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440037",
    precio_anterior: 40000,
    precio_nuevo: 45000,
    motivo_cambio: "Ajuste por inflación",
    user_id: "550e8400-e29b-41d4-a716-446655440038"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440039",
    precio_anterior: 35000,
    precio_nuevo: 38000,
    motivo_cambio: "Mejoras en el inmueble",
    user_id: "550e8400-e29b-41d4-a716-446655440040"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440041",
    precio_anterior: 50000,
    precio_nuevo: 55000,
    motivo_cambio: "Ajuste de mercado",
    user_id: "550e8400-e29b-41d4-a716-446655440042"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440043",
    precio_anterior: 38000,
    precio_nuevo: 40000,
    motivo_cambio: "Actualización de servicios",
    user_id: "550e8400-e29b-41d4-a716-446655440044"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440045",
    precio_anterior: 45000,
    precio_nuevo: 48000,
    motivo_cambio: "Renovación de contrato",
    user_id: "550e8400-e29b-41d4-a716-446655440046"
  }
];

export default priceHistoryData;
