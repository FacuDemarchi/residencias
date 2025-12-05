import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, VStack, HStack, Button, Icon } from '@chakra-ui/react';
import { FiMapPin, FiCheck } from 'react-icons/fi';
import { useGoogleMaps } from '../context/GoogleMapsContext';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string } | null;
  height?: string;
  center?: { lat: number; lng: number } | null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = null,
  height = "400px",
  center = null
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  
  const { isLoaded, google, error } = useGoogleMaps();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(initialLocation);

  // Inicializar el mapa
  useEffect(() => {
    if (!isLoaded || !google || !mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = { lat: -31.4167, lng: -64.1833 }; // Córdoba por defecto

    const map = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();

    // Listener para clic en el mapa
    const clickListener = map.addListener('click', async (event: google.maps.MapMouseEvent) => {
      if (event.latLng && geocoderRef.current) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        try {
          const results = await geocoderRef.current.geocode({
            location: { lat, lng }
          });

          const address = results.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          // Actualizar o crear marcador
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
            markerRef.current.setTitle(address);
          } else {
            const marker = new google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: true,
              title: address
            });
            markerRef.current = marker;
          }

          const newLocation = { lat, lng, address };
          setSelectedLocation(newLocation);
        } catch (error) {
          console.error('Error al geocodificar:', error);
          const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          const newLocation = { lat, lng, address };
          setSelectedLocation(newLocation);
        }
      }
    });

    // Cleanup
    return () => {
      if (clickListener) {
        google.maps.event.removeListener(clickListener);
      }
    };
  }, [isLoaded, google]);

  // Crear marcador cuando se selecciona una ubicación
  useEffect(() => {
    if (!isLoaded || !google || !mapInstanceRef.current || !selectedLocation || markerRef.current) return;

    const marker = new google.maps.Marker({
      position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      map: mapInstanceRef.current,
      draggable: true,
      title: selectedLocation.address
    });
    markerRef.current = marker;

    // Listener para arrastre del marcador
    const dragListener = marker.addListener('dragend', async () => {
      if (markerRef.current && geocoderRef.current) {
        const position = markerRef.current.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();

          try {
            const results = await geocoderRef.current.geocode({
              location: { lat, lng }
            });

            const address = results.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            markerRef.current.setTitle(address);

            const newLocation = { lat, lng, address };
            setSelectedLocation(newLocation);
          } catch (error) {
            console.error('Error al geocodificar:', error);
          }
        }
      }
    });

    return () => {
      if (dragListener && google && google.maps && google.maps.event) {
        google.maps.event.removeListener(dragListener);
      }
    };
  }, [isLoaded, google, selectedLocation?.lat, selectedLocation?.lng]);

  // Actualizar centro del mapa cuando cambie
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.panTo(center);
      mapInstanceRef.current.setZoom(16);
    }
  }, [center]);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  if (!isLoaded) {
    return (
      <Box h={height} bg="gray.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={2}>
          <Text color="gray.600">Cargando mapa...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box h={height} bg="red.50" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={2}>
          <Text color="red.600">Error al cargar el mapa: {error}</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <Box h={height} borderRadius="lg" overflow="hidden" border="1px" borderColor="gray.200">
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '400px',
            backgroundColor: '#f0f0f0'
          }} 
        />
      </Box>
      
      {selectedLocation && (
        <Box bg="blue.50" p={4} borderRadius="lg" border="1px" borderColor="blue.200">
          <VStack align="start" gap={3}>
            <HStack gap={2}>
              <Icon as={FiMapPin} color="blue.500" />
              <Text fontWeight="medium" color="blue.800">
                Ubicación seleccionada:
              </Text>
            </HStack>
            <Text fontSize="sm" color="blue.700" pl={6}>
              {selectedLocation.address}
            </Text>
            <Text fontSize="xs" color="blue.600" pl={6}>
              Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </Text>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleConfirmLocation}
              alignSelf="flex-start"
              ml={6}
            >
              <HStack gap={2}>
                <Icon as={FiCheck} />
                <Text>Confirmar ubicación</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      )}
      
      <Text fontSize="sm" color="gray.600" textAlign="center">
        Haz clic en el mapa para seleccionar la ubicación exacta de tu residencia
      </Text>
    </VStack>
  );
};

export default LocationPicker;