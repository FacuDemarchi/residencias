// Datos de pagos para insertar en la base de datos
// Estructura según diagrama ER: id, rental_id, monto, fecha_vencimiento, fecha_pago, created_at, updated_at, created_by, updated_by, deleted_at
const pagosData = [
  {
    rental_id: "550e8400-e29b-41d4-a716-446655440007",
    monto: 45000,
    fecha_vencimiento: "2025-02-15",
    fecha_pago: "2025-01-15"
  },
  {
    rental_id: "550e8400-e29b-41d4-a716-446655440008",
    monto: 35000,
    fecha_vencimiento: "2025-03-01",
    fecha_pago: "2025-02-01"
  },
  {
    rental_id: "550e8400-e29b-41d4-a716-446655440009",
    monto: 55000,
    fecha_vencimiento: "2025-02-01",
    fecha_pago: "2025-01-01"
  },
  {
    rental_id: "550e8400-e29b-41d4-a716-446655440010",
    monto: 40000,
    fecha_vencimiento: "2025-03-15",
    fecha_pago: "2025-02-15"
  },
  {
    rental_id: "550e8400-e29b-41d4-a716-446655440011",
    monto: 48000,
    fecha_vencimiento: "2025-04-01",
    fecha_pago: "2025-03-01"
  }
];

export default pagosData;
