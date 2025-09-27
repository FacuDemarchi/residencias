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
import { FiFilter, FiX, FiUser, FiUsers } from 'react-icons/fi';

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
  amenities?: string[];
}

type SortOption = 'precio-asc' | 'precio-desc' | 'capacidad-asc' | 'capacidad-desc' | 'metros-asc' | 'metros-desc' | 'precio-por-metro-asc' | 'precio-por-persona-asc' | 'default';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
  sortOption?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters,
  sortOption = 'default',
  onSortChange
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

        {/* Métodos de ordenamiento */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
            Ordenar por
          </Text>
          <HStack gap={1} wrap="wrap">
            <Button
              size="xs"
              variant={sortOption === 'precio-asc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'precio-asc' ? 'green' : 'gray'}
              onClick={() => onSortChange?.('precio-asc')}
              color={sortOption === 'precio-asc' ? 'white' : 'green.500'}
              title="Menor precio"
            >
              $
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'precio-desc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'precio-desc' ? 'red' : 'gray'}
              onClick={() => onSortChange?.('precio-desc')}
              color={sortOption === 'precio-desc' ? 'white' : 'red.500'}
              title="Mayor precio"
            >
              $$$
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'capacidad-desc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'capacidad-desc' ? 'blue' : 'gray'}
              onClick={() => onSortChange?.('capacidad-desc')}
              color={sortOption === 'capacidad-desc' ? 'white' : 'blue.500'}
              title="Mayor capacidad"
            >
              <Icon as={FiUsers} />
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'metros-desc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'metros-desc' ? 'purple' : 'gray'}
              onClick={() => onSortChange?.('metros-desc')}
              color={sortOption === 'metros-desc' ? 'white' : 'purple.500'}
              title="Mayor superficie"
            >
              +m²
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'capacidad-asc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'capacidad-asc' ? 'orange' : 'gray'}
              onClick={() => onSortChange?.('capacidad-asc')}
              color={sortOption === 'capacidad-asc' ? 'white' : 'orange.500'}
              title="Menor capacidad"
            >
              <Icon as={FiUser} />
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'metros-asc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'metros-asc' ? 'teal' : 'gray'}
              onClick={() => onSortChange?.('metros-asc')}
              color={sortOption === 'metros-asc' ? 'white' : 'teal.500'}
              title="Menor superficie"
            >
              -m²
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'precio-por-metro-asc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'precio-por-metro-asc' ? 'cyan' : 'gray'}
              onClick={() => onSortChange?.('precio-por-metro-asc')}
              color={sortOption === 'precio-por-metro-asc' ? 'white' : 'cyan.500'}
              title="Mejor relación precio/m²"
            >
              $/m²
            </Button>
            <Button
              size="xs"
              variant={sortOption === 'precio-por-persona-asc' ? 'solid' : 'outline'}
              colorScheme={sortOption === 'precio-por-persona-asc' ? 'pink' : 'gray'}
              onClick={() => onSortChange?.('precio-por-persona-asc')}
              color={sortOption === 'precio-por-persona-asc' ? 'white' : 'pink.500'}
              title="Mejor relación precio/persona"
            >
              $/👤
            </Button>
            {sortOption !== 'default' && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="gray"
                onClick={() => onSortChange?.('default')}
                color="gray.500"
                title="Sin ordenar"
              >
                ↺
              </Button>
            )}
          </HStack>
        </Box>

        <Box h="1px" bg="rgba(0, 0, 0, 0.1)" />

        {/* Filtros de precio */}
        <Box>
          <HStack gap={2}>
            <Input
              placeholder="Precio desde"
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
              placeholder="Precio hasta"
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
