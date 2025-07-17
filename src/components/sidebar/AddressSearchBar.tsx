import React, { useRef } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const AddressSearchBar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { google, isLoaded, setCenter, setViewport } = useGoogleMaps();

  React.useEffect(() => {
    if (!isLoaded || !google || !inputRef.current) return;
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      // Sin filtro 'types' para permitir más resultados
      fields: ['geometry']
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCenter({ lat, lng });
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