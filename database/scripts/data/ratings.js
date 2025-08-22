// Datos de calificaciones para insertar en la base de datos
// Estructura según diagrama ER: id, user_id, rental_id, cleanliness_score, communication_score, location_score, value_score, overall_score, would_recommend, is_anonymous, comentario, created_at, updated_at, created_by, updated_by, deleted_at
const ratingsData = [
  {
    user_id: "550e8400-e29b-41d4-a716-446655440012",
    rental_id: "550e8400-e29b-41d4-a716-446655440013",
    cleanliness_score: 5,
    communication_score: 4,
    location_score: 5,
    value_score: 4,
    overall_score: 4.5,
    would_recommend: true,
    is_anonymous: false,
    comentario: "Excelente experiencia, muy recomendable"
  },
  {
    user_id: "550e8400-e29b-41d4-a716-446655440014",
    rental_id: "550e8400-e29b-41d4-a716-446655440015",
    cleanliness_score: 4,
    communication_score: 5,
    location_score: 4,
    value_score: 5,
    overall_score: 4.5,
    would_recommend: true,
    is_anonymous: false,
    comentario: "Muy buena comunicación y excelente relación precio-calidad"
  },
  {
    user_id: "550e8400-e29b-41d4-a716-446655440016",
    rental_id: "550e8400-e29b-41d4-a716-446655440017",
    cleanliness_score: 3,
    communication_score: 4,
    location_score: 5,
    value_score: 3,
    overall_score: 3.75,
    would_recommend: false,
    is_anonymous: true,
    comentario: "Ubicación perfecta pero la limpieza podría mejorar"
  },
  {
    user_id: "550e8400-e29b-41d4-a716-446655440018",
    rental_id: "550e8400-e29b-41d4-a716-446655440019",
    cleanliness_score: 5,
    communication_score: 5,
    location_score: 4,
    value_score: 4,
    overall_score: 4.5,
    would_recommend: true,
    is_anonymous: false,
    comentario: "Todo perfecto, muy satisfecho con la estadía"
  },
  {
    user_id: "550e8400-e29b-41d4-a716-446655440020",
    rental_id: "550e8400-e29b-41d4-a716-446655440021",
    cleanliness_score: 4,
    communication_score: 3,
    location_score: 4,
    value_score: 5,
    overall_score: 4.0,
    would_recommend: true,
    is_anonymous: false,
    comentario: "Buena relación precio-calidad, comunicación mejorable"
  }
];

export default ratingsData;
