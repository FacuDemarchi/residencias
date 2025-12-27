import React, { useEffect, useRef } from 'react';
import type { Tables } from '../../types/database';

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
  size = { width: 28, height: 28 }
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || !location.latitud || !location.longitud) {
      return;
    }

    // Crear el marcador
    const isActive = publication?.is_active ?? true;
    markerRef.current = new google.maps.Marker({
      position: { lat: location.latitud, lng: location.longitud },
      map,
      title: location.direccion || 'Ubicación',
      icon: {
        url:
          icon ||
          'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
          <svg width="${size.width}" height="${size.height}" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M14 2C9.58 2 6 5.58 6 10c0 5.83 8 16 8 16s8-10.17 8-16c0-4.42-3.58-8-8-8z" fill="${isActive ? '#2563EB' : '#9CA3AF'}"/>
              <circle cx="14" cy="10" r="3.2" fill="#FFFFFF"/>
            </g>
          </svg>
        `),
        scaledSize: new google.maps.Size(size.width, size.height),
        anchor: new google.maps.Point(size.width / 2, size.height / 2)
      }
    });

    if (publication) {
      infoWindowRef.current = new google.maps.InfoWindow({
        content: `
          <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding:8px; max-width:240px">
            <div style="font-weight:600; color:#111827; margin-bottom:4px">${publication.titulo || 'Residencia'}</div>
            <div style="font-size:12px; color:#374151">
              Capacidad: ${publication.capacidad ?? 'N/A'}<br/>
              Precio: ${publication.price ? ('$' + publication.price.toLocaleString('es-AR')) : 'N/A'}<br/>
              M²: ${publication.metros_cuadrados ?? 'N/A'}
            </div>
          </div>
        `
      });
    }

    // Event listener para el click del marcador
    markerRef.current.addListener('click', () => {
      if (markerRef.current) {
        markerRef.current.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        markerRef.current.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => markerRef.current && markerRef.current.setAnimation(null), 600);
      }
      if (onMarkerClick) {
        onMarkerClick(location);
      }
    });

    // Hover
    if (publication) {
      markerRef.current.addListener('mouseover', () => {
        markerRef.current?.setZIndex(google.maps.Marker.MAX_ZINDEX + 2);
        if (infoWindowRef.current && markerRef.current) {
          infoWindowRef.current.open(map, markerRef.current);
        }
      });

      markerRef.current.addListener('mouseout', () => {
        markerRef.current?.setZIndex(undefined as any);
        infoWindowRef.current?.close();
      });
    }

    // Limpiar al desmontar
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [map, location.latitud, location.longitud, onMarkerClick, publication, icon, size.width, size.height]);

  // Actualizar posición si cambia la ubicación
  useEffect(() => {
    if (markerRef.current && location.latitud && location.longitud) {
      markerRef.current.setPosition({ lat: location.latitud, lng: location.longitud });
    }
  }, [location.latitud, location.longitud]);

  return null;
};

export default Marker;
