import React, { useState, useMemo } from 'react';
import AddressSearchBar from './AddressSearchBar';
import OrderManager from './OrderManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useAuth } from '../../context/AuthContext';
import { getMyPublications } from '../../hooks/getMyPublications';
import { getPublications } from '../../hooks/getPublications';
import type { Publication } from '../../types/app';

interface SidebarProps {
  setSelectedPublication: (publication: Publication | null) => void;
  highlightedPublications: Publication[];
  selectedPublication: Publication | null;
  showUserPublications: boolean;
  onNewPublicationClick: () => void;
  onSelectPublication: (publication: Publication) => void;
  activeFilter: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  setSelectedPublication, 
  highlightedPublications, 
  selectedPublication, 
  showUserPublications, 
  onNewPublicationClick, 
  onSelectPublication, 
  activeFilter 
}) => {
  const { mapLocations, loadingLocations } = useGoogleMaps();
  const { userData } = useAuth();
  const { publications: userPublications, loading: userPublicationsLoading, error: userPublicationsError } = getMyPublications();
  
  // Estado para ordenamiento
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'capacidad'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Extraer IDs de ubicaciones para el hook de publicaciones
  const locationIds = useMemo(() => 
    mapLocations.map(location => location.id), 
    [mapLocations]
  );
  
  // Usar el hook de publicaciones con ordenamiento dinámico
  const { 
    publications: sortedPublications, 
    loading: publicationsLoading, 
    error: publicationsError,
    hasMore,
    loadMore,
    refresh: refreshPublications
  } = getPublications({
    locationIds,
    sortBy,
    sortOrder,
    pageSize: 20
  });

  // Definir los filtros (mismos que en ContentArea)
  const predefinedFilters = {
    'Individual': (pub: Publication) => pub.capacidad === 1,
    'Doble': (pub: Publication) => pub.capacidad === 2,
    'Triple': (pub: Publication) => pub.capacidad === 3,
    'Cuádruple': (pub: Publication) => pub.capacidad === 4,
    'Residencia': (pub: Publication) => pub.metros_cuadrados >= 80,
    'Departamento': (pub: Publication) => pub.metros_cuadrados < 80
  };

  // Aplicar filtro si hay uno activo
  const filteredPublications = useMemo(() => {
    if (!activeFilter || !predefinedFilters[activeFilter as keyof typeof predefinedFilters]) {
      console.log(' Sidebar: Sin filtro activo, mostrando todas las publicaciones:', sortedPublications.length);
      return sortedPublications;
    }
    const filtered = sortedPublications.filter(predefinedFilters[activeFilter as keyof typeof predefinedFilters]);
    console.log(' Sidebar: Filtro activo:', activeFilter, 'publicaciones filtradas:', filtered.length);
    return filtered;
  }, [sortedPublications, activeFilter]);

  // Determinar qué publicaciones mostrar
  const publicationsToShow = showUserPublications ? userPublications : filteredPublications;
  const isLoading = showUserPublications ? userPublicationsLoading : (publicationsLoading || loadingLocations);
  const hasError = showUserPublications ? userPublicationsError : publicationsError;

  // Función para manejar cambios de ordenamiento desde OrderManager
  const handleOrderChange = (orderType: string) => {
    console.log(' Sidebar: Cambiando ordenamiento a:', orderType);
    
    switch (orderType) {
      case 'recientes':
        setSortBy('created_at');
        setSortOrder('desc');
        break;
      case 'antiguos':
        setSortBy('created_at');
        setSortOrder('asc');
        break;
      case 'menor_precio':
        setSortBy('price');
        setSortOrder('asc');
        break;
      case 'mayor_precio':
        setSortBy('price');
        setSortOrder('desc');
        break;
      case 'recomendados':
      default:
        setSortBy('created_at');
        setSortOrder('desc');
        break;
    }
  };

  // Función para manejar scroll infinito
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !publicationsLoading) {
      console.log(' Sidebar: Cargando más publicaciones...');
      loadMore();
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        {!showUserPublications && (
          <OrderManager 
            publications={filteredPublications}
            onPublicationsChange={handleOrderChange}
          />
        )}
        {showUserPublications && (
          <div className="text-sm text-gray-600 font-medium">
            Mis publicaciones ({userPublications.length})
          </div>
        )}
      </div>
      <div 
        className="flex-1 overflow-y-auto space-y-2 mi-scrollbar"
        onScroll={!showUserPublications ? handleScroll : undefined}
      >
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
                    if (isSelected) {
                      setSelectedPublication(null);
                    } else {
                      onSelectPublication(pub);
                    }
                  }}
                  isHighlighted={isHighlighted}
                  isSelected={isSelected}
                  publication={publicationData}
                />
              );
            })
        )}
        {!showUserPublications && hasMore && (
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500 text-sm">
              {publicationsLoading ? 'Cargando más...' : 'Desliza para cargar más'}
            </div>
          </div>
        )}
      </div>
      {userData?.user_type === 'residencia' && (
        <div>
          <NewPublicationCard onClick={onNewPublicationClick} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
