import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Icon,
  Input,
  Badge
} from '@chakra-ui/react';
import { FiFilter, FiX } from 'react-icons/fi';

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
  amenities?: string[];
}

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters
}) => {
  const [tempFilters, setTempFilters] = useState<SearchFilters>(currentFilters);

  // Aplicar filtros
  const applyFilters = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  // Limpiar filtros
  const clearFilters = () => {
    const clearedFilters: SearchFilters = {};
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(tempFilters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null
  ).length;

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="5px"
      left="255px" // Pegado al sidebar
      w="320px"
      bg="rgba(255, 255, 255, 0.95)"
      backdropFilter="blur(10px)"
      border="1px"
      borderColor="rgba(255, 255, 255, 0.2)"
      borderRadius="lg"
      boxShadow="xl"
      zIndex={999}
      p={4}
    >
      <VStack gap={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            color="gray.500"
            _hover={{ color: "gray.700" }}
          >
            <Icon as={FiX} />
          </Button>
          <HStack gap={2}>
            <Icon as={FiFilter} color="blue.500" />
            <Text fontSize="md" fontWeight="semibold">
              Filtros
            </Text>
            {activeFiltersCount > 0 && (
              <Badge
                colorScheme="blue"
                borderRadius="full"
                fontSize="xs"
                minW="5"
                h="5"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </HStack>
        </HStack>

        {/* Filtros de precio */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
            Rango de precio (mensual)
          </Text>
          <HStack gap={2}>
            <Input
              placeholder="Mínimo"
              type="number"
              size="sm"
              value={tempFilters.minPrice || ''}
              onChange={(e) => setTempFilters({
                ...tempFilters,
                minPrice: e.target.value ? Number(e.target.value) : undefined
              })}
              bg="rgba(255, 255, 255, 0.8)"
              border="1px"
              borderColor="rgba(0, 0, 0, 0.1)"
            />
            <Input
              placeholder="Máximo"
              type="number"
              size="sm"
              value={tempFilters.maxPrice || ''}
              onChange={(e) => setTempFilters({
                ...tempFilters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined
              })}
              bg="rgba(255, 255, 255, 0.8)"
              border="1px"
              borderColor="rgba(0, 0, 0, 0.1)"
            />
          </HStack>
        </Box>

        <Box h="1px" bg="rgba(0, 0, 0, 0.1)" />

        {/* Filtros de capacidad */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
            Capacidad (personas)
          </Text>
          <HStack gap={2}>
            <Input
              placeholder="Mínimo"
              type="number"
              size="sm"
              value={tempFilters.minCapacity || ''}
              onChange={(e) => setTempFilters({
                ...tempFilters,
                minCapacity: e.target.value ? Number(e.target.value) : undefined
              })}
              bg="rgba(255, 255, 255, 0.8)"
              border="1px"
              borderColor="rgba(0, 0, 0, 0.1)"
            />
            <Input
              placeholder="Máximo"
              type="number"
              size="sm"
              value={tempFilters.maxCapacity || ''}
              onChange={(e) => setTempFilters({
                ...tempFilters,
                maxCapacity: e.target.value ? Number(e.target.value) : undefined
              })}
              bg="rgba(255, 255, 255, 0.8)"
              border="1px"
              borderColor="rgba(0, 0, 0, 0.1)"
            />
          </HStack>
        </Box>

        <Box h="1px" bg="rgba(0, 0, 0, 0.1)" />

        {/* Botones de acción */}
        <HStack gap={2} justify="space-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            color="gray.600"
            _hover={{ color: "red.500" }}
          >
            Limpiar
          </Button>
          <HStack gap={2}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              borderColor="rgba(0, 0, 0, 0.1)"
              color="gray.600"
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              size="sm" 
              onClick={applyFilters}
              bg="rgba(66, 153, 225, 0.9)"
              _hover={{ bg: "rgba(66, 153, 225, 1)" }}
            >
              Aplicar
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default FiltersPanel;
