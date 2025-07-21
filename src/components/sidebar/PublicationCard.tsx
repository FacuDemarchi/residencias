import React from 'react';

interface PublicationCardProps {
  onClick?: () => void;
  id: number;
  user_id: number;
  location_id: number;
  estado: string;
  titulo: string;
  descripcion: string;
  precio: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen: string; // Added imagen to the interface
}

const PublicationCard: React.FC<PublicationCardProps> = ({ onClick, titulo, precio, direccion, estado, capacidad, metros_cuadrados, amenidades, imagen }) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-white shadow-md box-border p-0 grid grid-cols-5 grid-rows-4 gap-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      {/* Imagen ocupa todas las columnas y filas 1-3 */}
      <div className="relative col-start-1 col-end-6 row-start-1 row-end-4 w-full h-48">
        {/* Precio sobre la imagen, arriba a la izquierda */}
        <div className="absolute top-0 left-0 w-full z-20 flex items-start justify-end p-2">
          <span className="bg-white/80 text-blue-700 font-bold text-base px-2 py-1 rounded">${precio}</span>
        </div>
        {/* Imagen con z-10 */}
        <img src={imagen} alt={titulo} className="w-full h-full object-cover z-10" />
      </div>

      {/* Dirección, título, capacidad y metros cuadrados en la última fila, columnas 1-6 */}
      <div className="col-start-1 col-end-6 row-start-4 text-xs text-gray-700 font-semibold px-4 py-2 truncate flex flex-col gap-1 bg-white/80">
        <span className="text-base text-black font-bold truncate">{titulo}</span>
        <span>{direccion}</span>
        <span className="text-xs text-gray-600">Cap: {capacidad} · {metros_cuadrados} m²</span>
      </div>
    </button>
  );
};

export default PublicationCard; 