// Datos de alquileres para insertar en la base de datos
// Estructura según diagrama ER: id, publication_id, user_id, fecha_inicio, fecha_fin, check_in_time, check_out_time, total_personas, monto_total, deposit_paid, cleaning_fee, currency, contrato_aceptado, normas_aceptadas, porcentaje_actualizacion, fecha_actualizacion, created_at, updated_at, created_by, updated_by, deleted_at
const rentalsData = [
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440001",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
    fecha_inicio: "2025-01-15",
    fecha_fin: "2025-12-31",
    check_in_time: "14:00",
    check_out_time: "11:00",
    total_personas: 2,
    monto_total: 45000,
    deposit_paid: true,
    cleaning_fee: 5000,
    currency: "ARS",
    contrato_aceptado: true,
    normas_aceptadas: true,
    porcentaje_actualizacion: 10,
    fecha_actualizacion: "2025-01-15"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440003",
    user_id: "550e8400-e29b-41d4-a716-446655440004",
    fecha_inicio: "2025-02-01",
    fecha_fin: "2025-07-31",
    check_in_time: "15:00",
    check_out_time: "10:00",
    total_personas: 1,
    monto_total: 35000,
    deposit_paid: true,
    cleaning_fee: 3000,
    currency: "ARS",
    contrato_aceptado: true,
    normas_aceptadas: true,
    porcentaje_actualizacion: 5,
    fecha_actualizacion: "2025-02-01"
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440005",
    user_id: "550e8400-e29b-41d4-a716-446655440006",
    fecha_inicio: "2025-01-01",
    fecha_fin: "2025-06-30",
    check_in_time: "16:00",
    check_out_time: "12:00",
    total_personas: 4,
    monto_total: 55000,
    deposit_paid: false,
    cleaning_fee: 8000,
    currency: "ARS",
    contrato_aceptado: true,
    normas_aceptadas: true,
    porcentaje_actualizacion: 15,
    fecha_actualizacion: "2025-01-01"
  }
];

export default rentalsData;
