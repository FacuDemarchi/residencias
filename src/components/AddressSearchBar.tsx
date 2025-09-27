import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  VStack,
  Text,
  Button,
  HStack,
  Icon
} from '@chakra-ui/react';
import { FiMapPin, FiX } from 'react-icons/fi';
import { useGoogleMaps } from '../context/GoogleMapsContext';

interface SearchResult {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface AddressSearchBarProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  currentLocation?: { lat: number; lng: number; address: string } | null;
  placeholder?: string;
  isInvalid?: boolean;
}

const AddressSearchBar: React.FC<AddressSearchBarProps> = ({
  onLocationSelect,
  currentLocation,
  placeholder = "Buscar ubicación...",
  isInvalid = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  
  // Contexto de Google Maps
  const { google, isLoaded } = useGoogleMaps();

  // Inicializar servicios de Google Places cuando esté disponible
  useEffect(() => {
    if (isLoaded && google && google.maps && google.maps.places) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      
      // Crear un div oculto para el PlacesService (requerido por Google)
      const hiddenDiv = document.createElement('div');
      placesServiceRef.current = new google.maps.places.PlacesService(hiddenDiv);
    }
  }, [isLoaded, google]);

  // Inicializar con ubicación actual
  useEffect(() => {
    if (currentLocation) {
      setSearchTerm(currentLocation.address);
    }
  }, [currentLocation]);

  // Enfocar el input por defecto al cargar el componente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Función para buscar ubicaciones usando Google Places API
  const searchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Si Google Places está disponible, usarlo
      if (autocompleteServiceRef.current && google) {
        const request: google.maps.places.AutocompleteRequest = {
          input: query,
        };

        autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            // Convertir predicciones a nuestro formato
            const results: SearchResult[] = predictions.map(prediction => ({
              place_id: prediction.place_id,
              formatted_address: prediction.description,
              geometry: {
                location: { lat: 0, lng: 0 } // Se llenará con getDetails
              },
              address_components: []
            }));
            setSearchResults(results);
          } else {
            // Fallback a resultados simulados si falla la API
            setSearchResults(getMockResults(query));
          }
          setIsLoading(false);
        });
      } else {
        // Fallback a resultados simulados si Google Places no está disponible
        setSearchResults(getMockResults(query));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error);
      setSearchResults(getMockResults(query));
      setIsLoading(false);
    }
  };

  // Función auxiliar para resultados simulados
  const getMockResults = (query: string): SearchResult[] => {
    const mockResults: SearchResult[] = [
      {
        place_id: '1',
        formatted_address: 'Nueva Córdoba, Córdoba, Argentina',
        geometry: {
          location: { lat: -31.4167, lng: -64.1833 }
        },
        address_components: [
          { long_name: 'Nueva Córdoba', short_name: 'Nueva Córdoba', types: ['sublocality'] },
          { long_name: 'Córdoba', short_name: 'Córdoba', types: ['locality'] },
          { long_name: 'Argentina', short_name: 'AR', types: ['country'] }
        ]
      },
      {
        place_id: '2',
        formatted_address: 'Centro, Córdoba, Argentina',
        geometry: {
          location: { lat: -31.4201, lng: -64.1888 }
        },
        address_components: [
          { long_name: 'Centro', short_name: 'Centro', types: ['sublocality'] },
          { long_name: 'Córdoba', short_name: 'Córdoba', types: ['locality'] },
          { long_name: 'Argentina', short_name: 'AR', types: ['country'] }
        ]
      },
      {
        place_id: '3',
        formatted_address: 'Güemes, Córdoba, Argentina',
        geometry: {
          location: { lat: -31.4089, lng: -64.1792 }
        },
        address_components: [
          { long_name: 'Güemes', short_name: 'Güemes', types: ['sublocality'] },
          { long_name: 'Córdoba', short_name: 'Córdoba', types: ['locality'] },
          { long_name: 'Argentina', short_name: 'AR', types: ['country'] }
        ]
      }
    ].filter(result => 
      result.formatted_address.toLowerCase().includes(query.toLowerCase())
    );

    return mockResults;
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowResults(true);
    
    // Debounce para evitar muchas búsquedas
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  // Seleccionar una ubicación
  const handleLocationSelect = (result: SearchResult) => {
    setSearchTerm(result.formatted_address);
    setShowResults(false);
    
    // Si tenemos las coordenadas, usarlas directamente
    if (result.geometry.location.lat !== 0 && result.geometry.location.lng !== 0) {
      onLocationSelect({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address
      });
    } else {
      // Si no tenemos las coordenadas, obtenerlas usando getDetails
      getPlaceDetails(result.place_id, result.formatted_address);
    }
  };

  // Obtener detalles de un lugar específico
  const getPlaceDetails = (placeId: string, address: string) => {
    if (placesServiceRef.current && google) {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: placeId,
        fields: ['geometry']
      };

      placesServiceRef.current.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          onLocationSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: address
          });
        } else {
          // Fallback a coordenadas por defecto de Córdoba
          onLocationSelect({
            lat: -31.4167,
            lng: -64.1833,
            address: address
          });
        }
      });
    } else {
      // Fallback a coordenadas por defecto de Córdoba
      onLocationSelect({
        lat: -31.4167,
        lng: -64.1833,
        address: address
      });
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <Box position="relative">
      <VStack gap={2} align="stretch">
        <Box position="relative">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowResults(searchResults.length > 0)}
            size="sm"
            pr="8"
            bg="transparent"
            border="1px"
            borderColor={isInvalid ? "red.300" : "rgba(0, 0, 0, 0.1)"}
            _focus={{
              bg: "transparent",
              borderColor: isInvalid ? "red.400" : "blue.400",
              boxShadow: isInvalid ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : "0 0 0 1px rgba(66, 153, 225, 0.3)"
            }}
          />
          {searchTerm && (
            <Button
              size="xs"
              variant="ghost"
              position="absolute"
              right="1"
              top="1"
              onClick={clearSearch}
              color="gray.400"
              _hover={{ color: "gray.600" }}
            >
              <Icon as={FiX} />
            </Button>
          )}
          
          {/* Resultados de búsqueda */}
          {showResults && (searchResults.length > 0 || isLoading) && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              bg="transparent"
              backdropFilter="blur(10px)"
              border="1px"
              borderColor="rgba(0, 0, 0, 0.1)"
              borderRadius="md"
              boxShadow="lg"
              zIndex={1000}
              maxH="200px"
              overflowY="auto"
              mt={1}
            >
              {isLoading ? (
                <Box p={3} textAlign="center" color="gray.500">
                  <Text fontSize="sm">Buscando...</Text>
                </Box>
              ) : (
                searchResults.map((result) => (
                  <Box
                    key={result.place_id}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: "rgba(0, 0, 0, 0.05)" }}
                    onClick={() => handleLocationSelect(result)}
                  >
                    <HStack gap={2}>
                      <Icon as={FiMapPin} color="gray.400" />
                      <Text fontSize="sm">{result.formatted_address}</Text>
                    </HStack>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default AddressSearchBar;
