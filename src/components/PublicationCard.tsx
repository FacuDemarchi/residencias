import React from 'react';
import { 
  Box, 
  Text, 
  Image, 
  Badge, 
  VStack, 
  HStack,
  Flex
} from '@chakra-ui/react';
import { FiMapPin, FiUsers, FiMaximize2, FiWifi, FiTruck } from 'react-icons/fi';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;

interface PublicationCardProps {
  publication: Publication & {
    location?: {
      direccion?: string;
      latitud?: number;
      longitud?: number;
    };
    states?: {
      nombre?: string;
    };
    images?: Tables<'images'>[];
  };
  onSelect?: (publication: Publication) => void;
  isSelected?: boolean;
  isInSelectedGroup?: boolean;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onSelect,
  isSelected = false,
  isInSelectedGroup = false
}) => {
  // Función para formatear precios
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  // Función para obtener color de fondo según el estado
  const getStateBgColor = (stateName?: string) => {
    switch (stateName) {
      case 'disponible': return 'green.50';
      case 'reservada': return 'yellow.50';
      case 'alquilada': return 'red.50';
      case 'pausada': return 'orange.50';
      case 'eliminada': return 'gray.50';
      default: return 'blue.50';
    }
  };

  // Función para obtener color del borde según el estado
  const getStateBorderColor = (stateName?: string) => {
    switch (stateName) {
      case 'disponible': return 'green.200';
      case 'reservada': return 'yellow.200';
      case 'alquilada': return 'red.200';
      case 'pausada': return 'orange.200';
      case 'eliminada': return 'gray.200';
      default: return 'blue.200';
    }
  };

  // Función para obtener color del texto del estado
  const getStateTextColor = (stateName?: string) => {
    switch (stateName) {
      case 'disponible': return 'green.700';
      case 'reservada': return 'yellow.700';
      case 'alquilada': return 'red.700';
      case 'pausada': return 'orange.700';
      case 'eliminada': return 'gray.700';
      default: return 'blue.700';
    }
  };

  // Imagen por defecto
  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=120&fit=crop&crop=center';

  const stateName = publication.states?.nombre;
  const stateBorderColor = getStateBorderColor(stateName);
  const stateTextColor = getStateTextColor(stateName);

  // Estilos para selección
  const getSelectionStyles = () => {
    if (isSelected) {
      return {
        borderColor: 'blue.400',
        borderWidth: '2px',
        bg: 'blue.50',
        boxShadow: 'md'
      };
    }
    if (isInSelectedGroup) {
      return {
        borderColor: 'orange.300',
        borderWidth: '1px',
        bg: 'orange.50'
      };
    }
    return {
      borderColor: stateBorderColor,
      borderWidth: '1px',
      bg: 'transparent'
    };
  };

  const selectionStyles = getSelectionStyles();

  return (
    <Box
      {...selectionStyles}
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ 
        transform: 'translateY(-1px)',
        boxShadow: isSelected ? 'lg' : 'sm',
        borderColor: isSelected ? 'blue.500' : (isInSelectedGroup ? 'orange.400' : stateBorderColor.replace('200', '300'))
      }}
      onClick={() => onSelect?.(publication)}
      position="relative"
    >
      {/* Header con precio y estado */}
      <Flex justify="space-between" align="center" p={2} pb={1}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={stateTextColor}
        >
          {formatPrice(publication.price || 0)}
        </Text>
        
        {stateName && (
          <Badge
            colorScheme={
              stateName === 'disponible' ? 'green' :
              stateName === 'reservada' ? 'yellow' :
              stateName === 'alquilada' ? 'red' :
              stateName === 'pausada' ? 'orange' :
              'gray'
            }
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            variant="solid"
          >
            {stateName.toUpperCase()}
          </Badge>
        )}
      </Flex>

      {/* Imagen compacta */}
      <Box position="relative" h="80px" mx={2} mb={2}>
        <Image
          src={publication.images && publication.images.length > 0 
            ? publication.images[0].url_imagen 
            : defaultImage}
          alt={publication.titulo}
          w="full"
          h="full"
          objectFit="cover"
          borderRadius="sm"
        />
        
        {/* Iconos de amenities superpuestos */}
        <HStack 
          position="absolute" 
          top={1} 
          right={1} 
          gap={1}
        >
          <Box
            bg="rgba(255,255,255,0.9)"
            borderRadius="sm"
            p={0.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiWifi size={12} color="#4A5568" />
          </Box>
          <Box
            bg="rgba(255,255,255,0.9)"
            borderRadius="sm"
            p={0.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiTruck size={12} color="#4A5568" />
          </Box>
        </HStack>
      </Box>

      {/* Información principal */}
      <VStack align="stretch" p={2} pt={0} gap={1}>
        {/* Título */}
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.800"
          truncate
          lineHeight="shorter"
        >
          {publication.titulo}
        </Text>

        {/* Ubicación */}
        {publication.location?.direccion && (
          <HStack gap={1} fontSize="xs" color="gray.600">
            <FiMapPin size={10} />
            <Text truncate>
              {publication.location.direccion.split(',')[0]}
            </Text>
          </HStack>
        )}

        {/* Info compacta en una línea */}
        <HStack justify="space-between" fontSize="xs" color="gray.600">
          <HStack gap={2}>
            <HStack gap={0.5}>
              <FiUsers size={10} />
              <Text>{publication.capacidad}</Text>
            </HStack>
            
            {publication.metros_cuadrados && (
              <HStack gap={0.5}>
                <FiMaximize2 size={10} />
                <Text>{publication.metros_cuadrados}m²</Text>
              </HStack>
            )}
          </HStack>

          {/* Depósito si existe */}
          {publication.deposit_amount && (
            <Text fontSize="xs" color="gray.500">
              Dep: {formatPrice(publication.deposit_amount)}
            </Text>
          )}
        </HStack>

        {/* Texto de acción */}
        <Box
          bg={isSelected ? 'blue.100' : (isInSelectedGroup ? 'orange.100' : 'gray.100')}
          color={isSelected ? 'blue.700' : (isInSelectedGroup ? 'orange.700' : 'gray.600')}
          px={2}
          py={1}
          borderRadius="sm"
          textAlign="center"
          fontSize="xs"
          fontWeight="medium"
          cursor="pointer"
          _hover={{ opacity: 0.8 }}
        >
          {isSelected ? 'Seleccionada' : (isInSelectedGroup ? 'En grupo seleccionado' : 'Click para ver detalles')}
        </Box>
      </VStack>
    </Box>
  );
};

export default PublicationCard;