import React from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button
} from '@chakra-ui/react';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;

interface SidebarProps {
  userData?: {
    user_type: string;
  } | null;
  myRentals: any[];
  publications: Publication[];
}

const Sidebar: React.FC<SidebarProps> = ({ userData, myRentals, publications }) => {
  return (
    <VStack gap={4} align="stretch" p={4} h="full">
      <Text fontSize="xl" fontWeight="bold" color="gray.700">
        Residencias
      </Text>
      
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
            Mis Alquileres
          </Button>
        )}
      </VStack>

      {/* Buscador */}
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
          Buscar por ubicación
        </Text>
        <Button 
          variant="outline" 
          size="sm" 
          w="full"
          onClick={() => console.log('Abrir buscador')}
        >
          Nueva Córdoba, Córdoba
        </Button>
      </Box>

      {/* Lista de publicaciones */}
      <Box flex="1" overflowY="auto">
        <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
          Publicaciones disponibles
        </Text>
        <VStack gap={2} align="stretch">
          {publications.slice(0, 5).map((pub, index) => (
            <Box 
              key={index}
              p={3} 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
            >
              <Text fontSize="sm" fontWeight="medium">
                {`Publicación ${index + 1}`}
              </Text>
              <Text fontSize="xs" color="gray.500">
                ${pub.price || 'Precio no disponible'}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default Sidebar;
