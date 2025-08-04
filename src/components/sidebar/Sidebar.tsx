import React, { useState, useMemo } from 'react';
import AddressSearchBar from './AddressSearchBar';
import OrderManager from './OrderManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

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

interface SidebarProps {
  setSelectedPublication: (publication: Publication | null) => void;
  highlightedPublications: Publication[];
  selectedPublication: Publication | null;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedPublication, highlightedPublications, selectedPublication }) => {
  const { mapLocations, loadingLocations } = useGoogleMaps();
  const [sortedPublications, setSortedPublications] = useState<Publication[]>([]);

  // Extraer todas las publicaciones de las ubicaciones del mapa
  const allPublications = useMemo(() => 
    mapLocations.flatMap(location => 
      location.publications_test.map(pub => ({
        ...pub,
        price: pub.price || 0
      }))
    ), [mapLocations]
  );

  // Actualizar las publicaciones ordenadas cuando cambien las publicaciones originales
  React.useEffect(() => {
    setSortedPublications(allPublications);
  }, [allPublications]);

  const publicationsToShow = sortedPublications;

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        <OrderManager 
          publications={allPublications}
          onPublicationsChange={setSortedPublications}
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mi-scrollbar">
        {loadingLocations ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Cargando publicaciones...</div>
          </div>
        ) : publicationsToShow.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">No hay publicaciones disponibles</div>
          </div>
        ) : (
          publicationsToShow
            .map((pub: Publication) => {
              const isHighlighted = highlightedPublications.some(hp => hp.id === pub.id);
              const isSelected = selectedPublication ? selectedPublication.id === pub.id : false;
              return {
                ...pub,
                isHighlighted,
                isSelected
              };
            })
            .map((pub) => {
              const { isHighlighted, isSelected, ...publicationData } = pub;
              return (
                <PublicationCard 
                  key={pub.id} 
                  onClick={() => {
                    // Si la publicación ya está seleccionada, la deseleccionamos
                    if (isSelected) {
                      setSelectedPublication(null);
                    } else {
                      // Si no está seleccionada, la seleccionamos
                      setSelectedPublication(pub);
                    }
                  }}
                  isHighlighted={isHighlighted}
                  isSelected={isSelected}
                  {...publicationData}
                />
              );
            })
        )}
      </div>
      <div>
        <NewPublicationCard />
      </div>
    </div>
  );
};

export default Sidebar; 