import React, { useEffect, useRef, useState } from 'react';
import type { Tables } from '../../types/database';
import MarkerTooltip from './MarkerTooltip';

type Location = Tables<'locations'>;

interface MarkerProps {
  map: google.maps.Map | null;
  location: Location;
  onMarkerClick?: (location: Location) => void;
  publication?: any; // Información de la publicación asociada
  icon?: string;
  size?: { width: number; height: number };
}

const Marker: React.FC<MarkerProps> = ({ 
  map, 
  location, 
  onMarkerClick,
  publication,
  icon,
  size = { width: 24, height: 24 }
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (!map || !location.latitud || !location.longitud) {
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

    // Event listener para el click del marcador
    markerRef.current.addListener('click', () => {
      if (onMarkerClick) {
        onMarkerClick(location);
      }
    });

    // Event listener para hover - mostrar tooltip
    if (publication) {
      markerRef.current.addListener('mouseover', () => {
        setTooltipVisible(true);
      });

      // Event listener para quitar hover - ocultar tooltip
      markerRef.current.addListener('mouseout', () => {
        setTooltipVisible(false);
      });
    }

    // Limpiar al desmontar
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, location.latitud, location.longitud, onMarkerClick, publication, icon, size.width, size.height]);

  // Actualizar posición si cambia la ubicación
  useEffect(() => {
    if (markerRef.current && location.latitud && location.longitud) {
      markerRef.current.setPosition({ lat: location.latitud, lng: location.longitud });
    }
  }, [location.latitud, location.longitud]);

  return (
    <MarkerTooltip 
      publication={publication}
      isVisible={tooltipVisible}
    />
  );
};

export default Marker;
