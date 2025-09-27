import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface MarkerTooltipProps {
  publication: any;
  isVisible: boolean;
}

const MarkerTooltip: React.FC<MarkerTooltipProps> = ({ 
  publication, 
  isVisible
}) => {
  if (!isVisible || !publication) return null;

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      bg="white"
      border="1px solid gray"
      borderRadius="4px"
      p="8px"
      zIndex={9999}
      fontSize="12px"
    >
      <Text fontWeight="bold">{publication.titulo || 'Residencia'}</Text>
      <Text>Capacidad: {publication.capacidad}</Text>
      <Text>Precio: ${publication.price || 'N/A'}</Text>
      <Text>M²: {publication.metros_cuadrados || 'N/A'}</Text>
    </Box>
  );
};

export default MarkerTooltip;
