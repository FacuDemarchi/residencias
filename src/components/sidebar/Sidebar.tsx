import React, { useState, useMemo } from 'react';
import AddressSearchBar from './AddressSearchBar';
import OrderManager from './OrderManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useAuth } from '../../context/AuthContext';
import { useUserPublications } from '../../hooks/useUserPublications';

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
  showUserPublications: boolean;
  onNewPublicationClick: () => void;
  onSelectPublication: (publication: Publication) => void; // Nueva prop para manejar selección con lógica de edición
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedPublication, highlightedPublications, selectedPublication, showUserPublications, onNewPublicationClick, onSelectPublication }) => {
  const { mapLocations, loadingLocations } = useGoogleMaps();
  const { userData } = useAuth();
  const { publications: userPublications, loading: userPublicationsLoading, error: userPublicationsError } = useUserPublications();
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

  // Determinar qué publicaciones mostrar
  const publicationsToShow = showUserPublications ? userPublications : sortedPublications;
  const isLoading = showUserPublications ? userPublicationsLoading : loadingLocations;
  const hasError = showUserPublications ? userPublicationsError : null;

  // Actualizar las publicaciones ordenadas cuando cambien las publicaciones originales
  React.useEffect(() => {
    if (!showUserPublications) {
      setSortedPublications(allPublications);
    }
  }, [allPublications, showUserPublications]);

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        {!showUserPublications && (
          <OrderManager 
            publications={allPublications}
            onPublicationsChange={setSortedPublications}
          />
        )}
        {showUserPublications && (
          <div className="text-sm text-gray-600 font-medium">
            Mis publicaciones ({userPublications.length})
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mi-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">
              {showUserPublications ? 'Cargando mis publicaciones...' : 'Cargando publicaciones...'}
            </div>
          </div>
        ) : hasError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Error: {hasError}</div>
          </div>
        ) : publicationsToShow.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">
              {showUserPublications ? 'No tienes publicaciones creadas' : 'No hay publicaciones disponibles'}
            </div>
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
                      // Si no está seleccionada, la seleccionamos usando la función que maneja el modo de edición
                      onSelectPublication(pub);
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
      {/* Mostrar el botón "+ crear nueva publicación" solo para usuarios con user_type "residencia" */}
      {userData?.user_type === 'residencia' && (
        <div>
          <NewPublicationCard onClick={onNewPublicationClick} />
        </div>
      )}
    </div>
  );
};

export default Sidebar; 