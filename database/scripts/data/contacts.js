// Datos de contactos para insertar en la base de datos
// Estructura según diagrama ER: id, publication_id, contact_type, name, phone, email, is_primary, created_at, updated_at
const contactsData = [
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440022",
    contact_type: "owner",
    name: "María González",
    phone: "+54 351 123-4567",
    email: "maria@email.com",
    is_primary: true
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440023",
    contact_type: "emergency",
    name: "Carlos Rodríguez",
    phone: "+54 351 987-6543",
    email: "carlos@email.com",
    is_primary: true
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440024",
    contact_type: "owner",
    name: "Ana Martínez",
    phone: "+54 351 555-1234",
    email: "ana@email.com",
    is_primary: true
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440025",
    contact_type: "maintenance",
    name: "Luis Fernández",
    phone: "+54 351 777-8888",
    email: "luis@email.com",
    is_primary: true
  },
  {
    publication_id: "550e8400-e29b-41d4-a716-446655440026",
    contact_type: "emergency",
    name: "Sofía López",
    phone: "+54 351 444-5555",
    email: "sofia@email.com",
    is_primary: true
  }
];

export default contactsData;
