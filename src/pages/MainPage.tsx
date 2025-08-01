import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ContentArea from '../components/contentArea/ContentArea';

// Definir el tipo de publicación
interface Publication {
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
  imagen?: string;
}

const MainPage: React.FC = () => {
  // Estado para la publicación seleccionada
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  // Estado para publicaciones a remarcar en el sidebar
  const [highlightedPublications, setHighlightedPublications] = useState<Publication[]>([]);

  // Función para manejar el click en una publicación del sidebar
  const handlePublicationClick = (publication: Publication) => {
    console.log('📋 Publicación seleccionada en Sidebar:', publication);
    setSelectedPublication(publication);
  };

  // Función para remarcar publicaciones en el sidebar
  const handleHighlightPublications = (publications: Publication[]) => {
    console.log('🎯 Publicaciones a remarcar en MainPage:', publications);
    setHighlightedPublications(publications);
  };

  // Nueva función para seleccionar publicación desde el mapa
  const handleSelectPublication = (publication: Publication) => {
    console.log('🗺️ Publicación seleccionada desde el mapa:', publication);
    setSelectedPublication(publication);
  };

  return (
    <div className="grid grid-cols-5 grid-rows-[3.5rem_1fr] w-screen h-screen min-w-screen min-h-screen p-0 m-0">
      {/* Sidebar ocupa ambas filas, pegado al techo */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 h-full">
        <Sidebar 
          onPublicationClick={handlePublicationClick}
          highlightedPublications={highlightedPublications}
        />
      </div>
      {/* ContentArea en la segunda fila y columnas 2-6 */}
      <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full">
        <ContentArea 
          selectedPublication={selectedPublication}
          onHighlightPublications={handleHighlightPublications}
          onSelectPublication={handleSelectPublication}
        />
      </div>
    </div>
  );
};

export default MainPage; 