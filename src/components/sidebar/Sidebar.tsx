import React from 'react';
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
  images?: any[];
}

const Sidebar: React.FC = () => {
  const { mapLocations, loadingLocations, errorLocations } = useGoogleMaps();

  // Extraer todas las publicaciones de todas las ubicaciones
  const allPublications = mapLocations.flatMap(location => 
    location.publications_test || []
  );

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        <OrderManager />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mi-scrollbar">
        {loadingLocations ? (
          <div className="text-center text-gray-500">Cargando publicaciones...</div>
        ) : errorLocations ? (
          <div className="text-center text-red-500">Error: {errorLocations}</div>
        ) : allPublications.length === 0 ? (
          <div className="text-center text-gray-500">No hay publicaciones disponibles</div>
        ) : (
          allPublications
            .filter((pub: Publication) => pub.estado !== 'ocupado' && pub.estado !== 'reservado')
            .map((pub: Publication) => {
              // Mapear las propiedades para que coincidan con PublicationCard
              const mappedPub = {
                ...pub,
                precio: pub.price, // Convertir price a precio
                imagen: pub.imagen || (pub.images && pub.images.length > 0 ? pub.images[0].url : '') || ''
              };
              return (
                <PublicationCard 
                  key={pub.id} 
                  onClick={() => console.log(`Publication ${pub.id} clicked`)}
                  {...mappedPub}
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