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
  // Estado para controlar si se están mostrando las publicaciones del usuario
  const [showUserPublications, setShowUserPublications] = useState(false);

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

  // Función para deseleccionar publicación y limpiar highlights
  const handleClearSelectedPublication = () => {
    console.log('❌ Deseleccionando publicación y limpiando highlights');
    setSelectedPublication(null);
    setHighlightedPublications([]);
    // Nota: El ContentArea se encarga de restaurar el mapa a través de restoreMapToOriginal()
  };

  // Función para manejar el clic en "Mis publicaciones"
  const handleMyPublicationsClick = () => {
    console.log('📝 Cambiando a modo "Mis publicaciones"');
    setShowUserPublications(!showUserPublications);
    // Limpiar selección y highlights al cambiar de modo
    setSelectedPublication(null);
    setHighlightedPublications([]);
  };

  return (
    <div className="grid grid-cols-5 grid-rows-[3.5rem_1fr] w-screen h-screen min-w-screen min-h-screen p-0 m-0">
      {/* Sidebar ocupa ambas filas, pegado al techo */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 h-full">
        <Sidebar 
          setSelectedPublication={setSelectedPublication}
          highlightedPublications={highlightedPublications}
          selectedPublication={selectedPublication}
          showUserPublications={showUserPublications}
        />
      </div>
      {/* ContentArea en la segunda fila y columnas 2-6 */}
      <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full">
        <ContentArea 
          selectedPublication={selectedPublication}
          highlightedPublications={highlightedPublications}
          onHighlightPublications={handleHighlightPublications}
          onSelectPublication={handleSelectPublication}
          onClearSelectedPublication={handleClearSelectedPublication}
          onMyPublicationsClick={handleMyPublicationsClick}
          showUserPublications={showUserPublications}
        />
      </div>
    </div>
  );
};

export default MainPage; 