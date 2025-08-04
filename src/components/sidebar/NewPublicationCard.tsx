import React from 'react';
import { useUserPublications } from '../../hooks/useUserPublications';

const NewPublicationCard: React.FC = () => {
  const { publications, loading, error } = useUserPublications();

  return (
    <div className="w-full h-16 rounded-xl bg-white grid place-items-center cursor-pointer hover:bg-green-50 transition box-border">
      <div className="text-center">
        <span className="text-green-600 font-semibold">+ Crear nueva publicación</span>
        {loading ? (
          <div className="text-xs text-gray-500 mt-1">Cargando...</div>
        ) : error ? (
          <div className="text-xs text-red-500 mt-1">Error al cargar</div>
        ) : (
          <div className="text-xs text-gray-500 mt-1">
            {publications.length} publicación{publications.length !== 1 ? 'es' : ''} creada{publications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPublicationCard; 