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

const PublicationCard: React.FC<PublicationCardProps> = ({ onClick, titulo, precio, direccion, capacidad, metros_cuadrados, imagen }) => {
  const hasValidImage = imagen && imagen.trim() !== '';
  
  return (
    <button
      onClick={onClick}
      className="group w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Header con imagen y overlay */}
      <div className="relative h-40 overflow-hidden">
        {hasValidImage ? (
          <img 
            src={imagen} 
            alt={titulo} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${hasValidImage ? 'hidden' : ''}`}>
          <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Badge de precio flotante */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm text-blue-600 font-bold text-lg px-3 py-2 rounded-full shadow-lg">
            ${precio}
          </div>
        </div>

        {/* Overlay de estado */}
        <div className="absolute top-3 left-3">
          <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Disponible
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate">{titulo}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{direccion}</p>
        
        {/* Características */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>{capacidad} personas</span>
            <span className="mx-1"> • </span>
            <span>{metros_cuadrados} m²</span>
          </div>
          
          {/* Botón de acción */}
          <div className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
            Ver detalles →
          </div>
        </div>
      </div>
    </button>
  );
};

export default PublicationCard; 