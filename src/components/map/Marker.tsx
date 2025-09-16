import React, { useEffect, useRef } from 'react';
import type { Tables } from '../../types/database';

type Location = Tables<'locations'>;

interface MarkerProps {
  map: google.maps.Map | null;
  location: Location;
  onMarkerClick?: (location: Location) => void;
  icon?: string;
  size?: { width: number; height: number };
}

const Marker: React.FC<MarkerProps> = ({ 
  map, 
  location, 
  onMarkerClick,
  icon,
  size = { width: 24, height: 24 }
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || !location.latitud || !location.longitud) {
      console.warn('Marker: Missing required data', { map: !!map, latitud: location.latitud, longitud: location.longitud });
      return;
    }

    // Crear el marcador
    markerRef.current = new google.maps.Marker({
      position: { lat: location.latitud, lng: location.longitud },
      map,
      title: location.direccion || 'Ubicación',
      icon: {
        url: icon || 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="${size.width}" height="${size.height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3B82F6"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(size.width, size.height),
        anchor: new google.maps.Point(size.width / 2, size.height / 2)
      }
    });

    // Crear info window
    infoWindowRef.current = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-gray-800">${location.direccion || 'Ubicación'}</h3>
          <p class="text-sm text-gray-600">Lat: ${location.latitud?.toFixed(6) || 'N/A'}</p>
          <p class="text-sm text-gray-600">Lng: ${location.longitud?.toFixed(6) || 'N/A'}</p>
          <p class="text-sm text-gray-600">ID: ${location.id}</p>
        </div>
      `
    });

    // Event listener para el click del marcador
    markerRef.current.addListener('click', () => {
      if (onMarkerClick) {
        onMarkerClick(location);
      } else {
        // Comportamiento por defecto
        map.panTo(markerRef.current!.getPosition()!);
        map.setZoom(16);
        infoWindowRef.current!.open(map, markerRef.current!);
      }
    });

    // Limpiar al desmontar
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, location, onMarkerClick, icon, size]);

  // Actualizar posición si cambia la ubicación
  useEffect(() => {
    if (markerRef.current && location.latitud && location.longitud) {
      markerRef.current.setPosition({ lat: location.latitud, lng: location.longitud });
    }
  }, [location.latitud, location.longitud]);

  // Este componente no renderiza nada visualmente
  return null;
};

export default Marker;
