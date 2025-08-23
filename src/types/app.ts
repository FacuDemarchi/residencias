// Tipos específicos para la aplicación basados en la estructura real que se usa

export interface Image {
  id: string;
  publication_id: string;
  url_imagen: string;
  tipo: string;
  created_at: string | null;
}

export interface Publication {
  id: number;
  user_id: number;
  location_id: number;
  estado: string;
  titulo: string;
  descripcion: string;
  price: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen?: string; // Campo legacy
  images?: Image[];
}

export interface MapLocation {
  id: bigint;
  latitud: number;
  longitud: number;
  estado: string;
  direccion: string;
  publications_test: Publication[];
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: number;
  publication_id: number;
  user_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  precio_total: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: number;
  publication_id: number;
  user_id: number;
  puntuacion: number;
  comentario?: string;
  created_at: string;
}
