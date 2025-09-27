import React, { useEffect, useRef } from 'react';
import { Box, Input } from '@chakra-ui/react';
import { useGoogleMaps } from '../context/GoogleMapsContext';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  // Contexto de Google Maps
  const { google, isLoaded } = useGoogleMaps();

  // Inicializar autocomplete cuando Google Maps esté disponible
  useEffect(() => {
    if (isLoaded && google && google.maps && google.maps.places && inputRef.current) {
      // Crear el autocomplete SIN RESTRICCIONES
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        // SIN RESTRICCIONES - busca cualquier cosa en cualquier lugar
      });

      // Escuchar cuando se selecciona un lugar
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (place && place.geometry && place.geometry.location) {
          onLocationSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || place.name || ''
          });
        }
      });
    }
  }, [isLoaded, google, onLocationSelect]);

  // Inicializar con ubicación actual
  useEffect(() => {
    if (currentLocation && inputRef.current) {
      inputRef.current.value = currentLocation.address;
    }
  }, [currentLocation]);

  return (
    <Box>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        size="sm"
        bg="transparent"
        border="1px"
        borderColor={isInvalid ? "red.300" : "rgba(0, 0, 0, 0.1)"}
        _focus={{
          bg: "transparent",
          borderColor: isInvalid ? "red.400" : "blue.400",
          boxShadow: isInvalid ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : "0 0 0 1px rgba(66, 153, 225, 0.3)"
        }}
      />
    </Box>
  );
};

export default AddressSearchBar;