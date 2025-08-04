import React, { useState, useMemo } from 'react';

interface Image {
  id: number;
  publication_id: number;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  created_at: string;
}

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
  images?: Image[];
}

interface OrderManagerProps {
  publications: Publication[];
  onPublicationsChange: (sortedPublications: Publication[]) => void;
}

type OrderType = 'recomendados' | 'menor_precio' | 'mayor_precio' | 'recientes' | 'antiguos';

const OrderManager: React.FC<OrderManagerProps> = ({ publications, onPublicationsChange }) => {
  const [orderBy, setOrderBy] = useState<OrderType>('recomendados');

  const sortedPublications = useMemo(() => {
    const publicationsCopy = [...publications];
    
    switch (orderBy) {
      case 'menor_precio':
        return publicationsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
      
      case 'mayor_precio':
        return publicationsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));
      
      case 'recientes':
        return publicationsCopy.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      
      case 'antiguos':
        return publicationsCopy.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      
      case 'recomendados':
      default:
        // Para recomendados, mantenemos el orden original (que viene del contexto de Google Maps)
        return publicationsCopy;
    }
  }, [publications, orderBy]);

  // Notificar al componente padre cuando cambien las publicaciones ordenadas
  React.useEffect(() => {
    onPublicationsChange(sortedPublications);
  }, [sortedPublications, onPublicationsChange]);

  return (
    <div className="w-full rounded-b-2xl bg-gray-50 shadow-sm px-4 py-3 box-border flex items-center gap-2">
      <span className="text-primary font-semibold text-base flex items-center gap-1">
        Ordenar
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block">
          <path d="M7 14V6M7 14L4 11M7 14L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 6V14M13 6L16 9M13 6L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <select 
        value={orderBy} 
        onChange={(e) => setOrderBy(e.target.value as OrderType)}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="recomendados">Recomendados</option>
        <option value="menor_precio">Menor precio</option>
        <option value="mayor_precio">Mayor precio</option>
        <option value="recientes">Recientes</option>
        <option value="antiguos">Antiguos</option>
      </select>
    </div>
  );
};

export default OrderManager; 