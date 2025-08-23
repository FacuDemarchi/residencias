import React from 'react';
import type { Publication } from '../../types/app';

interface PublicationCardProps {
  onClick?: () => void;
  isHighlighted?: boolean;
  isSelected?: boolean;
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ 
  onClick, 
  isHighlighted = false,
  isSelected = false,
  publication
}) => {
  const { titulo, price, direccion, capacidad, metros_cuadrados, imagen, estado } = publication;
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl shadow-md box-border p-0 grid grid-cols-5 grid-rows-4 gap-0 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
        isSelected ? 'ring-4 ring-green-500 shadow-xl scale-[1.03] bg-green-100' :
        isHighlighted ? 'ring-4 ring-blue-400 shadow-lg scale-[1.02] bg-blue-100' : 
        'bg-white'
      }`}
    >
      {/* Imagen ocupa todas las columnas y filas 1-3 */}
      <div className="relative col-start-1 col-end-6 row-start-1 row-end-4 w-full h-48">
        {/* Precio sobre la imagen, arriba a la izquierda */}
        <div className="absolute top-0 left-0 w-full z-20 flex items-start justify-end p-2">
          <span className="bg-white/80 text-blue-700 font-bold text-base px-2 py-1 rounded">${price}</span>
        </div>
        {/* Indicador de estado especial */}
        {(isSelected || isHighlighted) && (
          <div className="absolute top-2 left-2 z-30">
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
              isSelected ? 'bg-green-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {isSelected ? 'SELECCIONADA' : 'DESTACADA'}
            </span>
          </div>
        )}
        {/* Imagen con z-10 */}
        <img 
          src={imagen || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'} 
          alt={titulo} 
          className="w-full h-full object-cover z-10" 
        />
      </div>

      {/* Dirección, título, capacidad y metros cuadrados en la última fila, columnas 1-6 */}
      <div className={`col-start-1 col-end-6 row-start-4 text-xs text-gray-700 font-semibold px-4 py-2 truncate flex flex-col gap-1 ${
        isSelected ? 'bg-green-100/90' :
        isHighlighted ? 'bg-blue-100/90' : 
        'bg-white/80'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-base text-black font-bold truncate">{titulo}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            estado === 'disponible' ? 'bg-green-100 text-green-800' :
            estado === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
            estado === 'ocupado' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {estado}
          </span>
        </div>
        <span>{direccion}</span>
        <span className="text-xs text-gray-600">Cap: {capacidad} · {metros_cuadrados} m²</span>
      </div>
    </button>
  );
};

export default PublicationCard; 