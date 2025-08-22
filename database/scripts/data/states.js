// Datos de estados para insertar en la base de datos
const statesData = [
  {
    nombre: "disponible",
    descripcion: "Publicación disponible para alquiler",
    es_final: false
  },
  {
    nombre: "reservada",
    descripcion: "Publicación reservada",
    es_final: false
  },
  {
    nombre: "alquilada",
    descripcion: "Publicación alquilada",
    es_final: false
  },
  {
    nombre: "pausada",
    descripcion: "Publicación pausada por el propietario",
    es_final: false
  },
  {
    nombre: "enMora",
    descripcion: "Alquiler en mora",
    es_final: false
  },
  {
    nombre: "cancelada",
    descripcion: "Reserva/alquiler cancelado",
    es_final: true
  },
  {
    nombre: "eliminada",
    descripcion: "Publicación eliminada",
    es_final: true
  }
];

export default statesData;
