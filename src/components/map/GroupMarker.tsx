import React, { useEffect, useRef } from 'react';
import type { Tables } from '../../types/database';

type Location = Tables<'locations'>;

interface GroupMarkerProps {
  map: google.maps.Map | null;
  locations: Location[];
  centerPosition: { lat: number; lng: number };
  onGroupClick?: (locations: Location[]) => void;
  icon?: string;
  size?: { width: number; height: number };
}

const GroupMarker: React.FC<GroupMarkerProps> = ({ 
  map, 
  locations, 
  centerPosition,
  onGroupClick,
  icon,
  size = { width: 32, height: 32 }
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || locations.length === 0) return;

    // Crear el marcador del grupo
    markerRef.current = new google.maps.Marker({
      position: centerPosition,
      map,
      title: `${locations.length} ubicaciones`,
      icon: {
        url: icon || 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="${size.width}" height="${size.height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${locations.length}</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(size.width, size.height),
        anchor: new google.maps.Point(size.width / 2, size.height / 2)
      }
    });

    // Crear info window para el grupo
    infoWindowRef.current = new google.maps.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="font-semibold text-gray-800 mb-2">${locations.length} ubicaciones cercanas</h3>
          <div class="space-y-1">
            ${locations.slice(0, 3).map(location => `
              <p class="text-sm text-gray-600">• ${location.direccion || 'Ubicación'}</p>
            `).join('')}
            ${locations.length > 3 ? `<p class="text-sm text-gray-500">... y ${locations.length - 3} más</p>` : ''}
          </div>
        </div>
      `
    });

    // Event listener para el click del marcador del grupo
    markerRef.current.addListener('click', () => {
      if (onGroupClick) {
        onGroupClick(locations);
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
  }, [map, locations, centerPosition, onGroupClick, icon, size]);

  // Actualizar posición si cambia
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPosition(centerPosition);
    }
  }, [centerPosition]);

  // Este componente no renderiza nada visualmente
  return null;
};

export default GroupMarker;
