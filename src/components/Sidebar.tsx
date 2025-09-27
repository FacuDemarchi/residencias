import React from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button,
  Badge,
  HStack
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
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userData, 
  myRentals, 
  publications, 
  onLocationSearch, 
  currentLocation 
}) => {
  // Función para manejar selección de publicación
  const handlePublicationSelect = (publication: Publication) => {
    console.log('Publicación seleccionada:', publication);
    // Aquí puedes agregar lógica para centrar el mapa en la publicación
  };

  // Contar publicaciones por estado
  const publicationsByState = publications.reduce((acc, pub) => {
    const state = pub.current_state_id || 'sin estado';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <VStack gap={3} align="stretch" p={3} h="full">
      {/* Buscador - Movido arriba */}
      <AddressSearchBar
        onLocationSelect={onLocationSearch || (() => {})}
        currentLocation={currentLocation}
      />
      
      {/* Botones de filtro */}
      <VStack gap={2} align="stretch">
        {userData?.user_type === 'residencia' && (
          <Button 
            colorScheme="purple" 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Mis publicaciones')}
          >
            Mis Publicaciones
          </Button>
        )}
        
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

      <Box h="1px" bg="gray.200" />

      {/* Resumen de publicaciones */}
      <Box>
        <HStack justify="space-between" align="center" mb={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Publicaciones encontradas
          </Text>
          <Badge colorScheme="blue" variant="subtle">
            {publications.length}
          </Badge>
        </HStack>
        
        {/* Contador por estado */}
        {Object.keys(publicationsByState).length > 0 && (
          <HStack gap={1} wrap="wrap">
            {Object.entries(publicationsByState).map(([state, count]) => (
              <Badge 
                key={state} 
                size="sm" 
                variant="outline" 
                colorScheme={
                  state === 'disponible' ? 'green' :
                  state === 'reservada' ? 'yellow' :
                  state === 'alquilada' ? 'red' :
                  state === 'pausada' ? 'orange' :
                  'gray'
                }
                fontSize="xs"
              >
                {state}: {count}
              </Badge>
            ))}
          </HStack>
        )}
      </Box>

      <Box h="1px" bg="gray.200" />

      {/* Lista de publicaciones */}
      <Box flex="1" overflowY="auto">
        <VStack gap={2} align="stretch">
          {publications.length > 0 ? (
            publications.map((pub) => (
              <PublicationCard
                key={pub.id}
                publication={pub}
                onSelect={handlePublicationSelect}
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
