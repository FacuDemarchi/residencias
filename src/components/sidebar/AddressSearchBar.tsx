import React, { useRef } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const AddressSearchBar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { google, isLoaded, setCenter, setViewport } = useGoogleMaps();

  React.useEffect(() => {
    if (!isLoaded || !google || !inputRef.current) return;
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      // Sin filtro 'types' para permitir más resultados
      fields: ['geometry', 'types']
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        // NUEVO: determinar el tipo de lugar para ajustar la distancia
        let searchType: string | undefined = undefined;
        if (place.types && place.types.length > 0) {
          // Priorizar tipos más específicos
          const typePriority = [
            'street_address',
            'route', 
            'sublocality_level_1',
            'sublocality',
            'locality',
            'administrative_area_level_2',
            'administrative_area_level_1',
            'country'
          ];
          
          searchType = typePriority.find(type => place.types?.includes(type)) || place.types[0];
        }
        
        console.log('Lugar seleccionado:', {
          name: inputRef.current?.value,
          types: place.types,
          selectedType: searchType,
          coordinates: { lat, lng }
        });
        
        setCenter({ lat, lng }, searchType);
        if (place.geometry.viewport) {
          setViewport(place.geometry.viewport);
        } else {
          setViewport(null);
        }
      }
    });
    // Limpieza
    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, google, setCenter, setViewport]);

  return (
    <div className="w-full rounded-t-2xl bg-gray-50 shadow-sm px-4 py-3 box-border flex items-center">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar dirección, ciudad o provincia..."
        className="w-full bg-transparent outline-none text-primary font-semibold text-base"
      />
    </div>
  );
};

export default AddressSearchBar; 