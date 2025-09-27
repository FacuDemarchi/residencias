import React from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button,
  HStack,
  Badge,
  Icon
} from '@chakra-ui/react';
import type { Tables } from '../types/database';
import AddressSearchBar from './AddressSearchBar';
import PublicationCard from './PublicationCard';

type Publication = Tables<'publications'>;

interface SidebarProps {
  userData?: {
    user_type: string;
  } | null;
  myRentals: any[];
  publications: Publication[];
  onLocationSearch?: (location: { lat: number; lng: number; address: string }) => void;
  currentLocation?: { lat: number; lng: number; address: string } | null;
  onPublicationSelect?: (publicationId: string) => void;
  publicacionSeleccionada?: Publication | null;
  grupoSeleccionado?: any[] | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userData, 
  myRentals, 
  publications, 
  onLocationSearch, 
  currentLocation,
  onPublicationSelect,
  publicacionSeleccionada,
  grupoSeleccionado
}) => {
  // Función para manejar selección de publicación
  const handlePublicationSelect = (publication: Publication) => {
    onPublicationSelect?.(publication.id);
  };



  return (
    <VStack gap={3} align="stretch" p={3} h="full" className="transparent-sidebar">
      {/* Buscador - Movido arriba */}
      <AddressSearchBar
        onLocationSelect={onLocationSearch || (() => {})}
        currentLocation={currentLocation}
      />
      

      {/* Botones de usuario */}
      <VStack gap={2} align="stretch">
        {userData?.user_type === 'cliente' && myRentals.length > 0 && (
          <Button 
            colorScheme="blue" 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Mis alquileres')}
          >
            Mis Alquileres ({myRentals.length})
          </Button>
        )}
      </VStack>
      {/* Lista de publicaciones */}
      <Box flex="1" overflowY="auto">
        <VStack gap={2} align="stretch">
          {publications.length > 0 ? (
            publications.map((pub) => (
              <PublicationCard
                key={pub.id}
                publication={pub}
                onSelect={handlePublicationSelect}
                isSelected={publicacionSeleccionada?.id === pub.id}
                isInSelectedGroup={grupoSeleccionado?.some(loc => loc.id === pub.location_id)}
              />
            ))
          ) : (
            <Box 
              p={4} 
              textAlign="center" 
              color="gray.500"
              fontSize="sm"
            >
              <Text>No hay publicaciones disponibles</Text>
              <Text fontSize="xs" mt={1}>
                Cambia la ubicación o ajusta los filtros
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};

export default Sidebar;
