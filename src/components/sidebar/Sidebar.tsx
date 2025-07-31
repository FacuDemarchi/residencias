import React from 'react';
import AddressSearchBar from './AddressSearchBar';
import OrderManager from './OrderManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';
import examplePublications from './examplePublications';

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
  onPublicationClick: (publication: Publication) => void;
  highlightedPublications: Publication[];
}

const Sidebar: React.FC<SidebarProps> = ({ onPublicationClick, highlightedPublications }) => {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        <OrderManager />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mi-scrollbar">
        {examplePublications
          .filter((pub: any) => pub.estado !== 'ocupado' && pub.estado !== 'reservado')
          .map((pub: any) => {
            const isHighlighted = highlightedPublications.some(hp => hp.id === pub.id);
                          const mappedPub = {
                ...pub,
                price: pub.precio, // Convertir precio a price
                precio: pub.precio // Mantener precio para PublicationCard
              };
              return (
                <PublicationCard 
                  key={pub.id} 
                  onClick={() => {
                    console.log('🖱️ Click en publicación del sidebar:', mappedPub);
                    onPublicationClick(mappedPub);
                  }}
                  isHighlighted={isHighlighted}
                  {...mappedPub}
                />
              );
          })}
      </div>
      <div>
        <NewPublicationCard />
      </div>
    </div>
  );
};

export default Sidebar; 