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
  precio: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen: string;
}

const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        <OrderManager />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mi-scrollbar">
        {examplePublications
          .filter((pub: Publication) => pub.estado !== 'ocupado' && pub.estado !== 'reservado')
          .map((pub: Publication, i: number) => (
            <PublicationCard 
              key={pub.id} 
              onClick={() => console.log(`Publication ${pub.id} clicked`)}
              {...pub}
            />
          ))}
      </div>
      <div>
        <NewPublicationCard />
      </div>
    </div>
  );
};

export default Sidebar; 