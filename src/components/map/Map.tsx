import React, { useEffect, useRef, useMemo } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import Marker from './Marker';
import GroupMarker from './GroupMarker';
import type { Tables } from '../../types/database';

type Location = Tables<'locations'>;

interface MapProps {
  locations?: Location[];
}

interface ClusteredItem {
  type: 'single' | 'cluster';
  data: Location | Location[];
  center: { lat: number; lng: number };
  count?: number;
}

const Map: React.FC<MapProps> = ({ locations = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const originalCenterRef = useRef<google.maps.LatLngLiteral | null>(null);
  const originalZoomRef = useRef<number | null>(null);
  
  const { 
    google, 
    isLoaded, 
    center, 
    zoom,
    error
  } = useGoogleMaps();

  // Agrupar marcadores que están en la misma ubicación exacta
  const clusteredItems = useMemo((): ClusteredItem[] => {
    if (locations.length === 0) return [];

    const processed = new Set<string>();
    const clustered: ClusteredItem[] = [];

    locations.forEach((location) => {
      // Si ya fue procesado, saltarlo
      if (processed.has(location.id)) return;

      // Buscar marcadores en la misma ubicación exacta
      const sameLocationMarkers: Location[] = [location];
      
      locations.forEach((otherLocation) => {
        if (
          otherLocation.id !== location.id && 
          !processed.has(otherLocation.id)
        ) {
          // Verificar si están en exactamente la misma ubicación
          if (
            otherLocation.latitud === location.latitud && 
            otherLocation.longitud === location.longitud
          ) {
            sameLocationMarkers.push(otherLocation);
          }
        }
      });

      // Marcar todos como procesados
      sameLocationMarkers.forEach(marker => processed.add(marker.id));

      if (sameLocationMarkers.length === 1) {
        // Marcador individual
        clustered.push({
          type: 'single',
          data: sameLocationMarkers[0],
          center: {
            lat: sameLocationMarkers[0].latitud,
            lng: sameLocationMarkers[0].longitud
          }
        });
      } else {
        // Cluster de marcadores
        clustered.push({
          type: 'cluster',
          data: sameLocationMarkers,
          center: {
            lat: sameLocationMarkers[0].latitud,
            lng: sameLocationMarkers[0].longitud
          },
          count: sameLocationMarkers.length
        });
      }
    });

    console.log(`Clustering: ${locations.length} locations → ${clustered.length} items`);
    
    return clustered;
  }, [locations]);

  console.log('Map render:', { isLoaded, error, center, zoom, locationsCount: locations.length, clusteredCount: clusteredItems.length });

  // Inicializar el mapa
  useEffect(() => {
    if (!isLoaded || !google || !mapRef.current || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;
    
    // Guardar el center y zoom originales
    originalCenterRef.current = center;
    originalZoomRef.current = zoom;
    
    // Agregar listener para doble click en el mapa (volver al center y zoom originales)
    map.addListener('dblclick', () => {
      if (mapInstanceRef.current && originalCenterRef.current && originalZoomRef.current !== null) {
        mapInstanceRef.current.panTo(originalCenterRef.current);
        mapInstanceRef.current.setZoom(originalZoomRef.current);
      }
    });

  }, [isLoaded, google, center, zoom]);

  // Actualizar centro cuando cambie (desde el sidebar)
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
      // Actualizar el center y zoom originales cuando cambien desde el sidebar
      originalCenterRef.current = center;
      originalZoomRef.current = zoom;
    }
  }, [center, zoom, isLoaded]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      // Los marcadores se limpian automáticamente por los componentes individuales
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600">
          <p>Error al cargar el mapa: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px', backgroundColor: '#f0f0f0' }}
      />
      {isLoaded && mapInstanceRef.current && clusteredItems.map((item, index) => 
        item.type === 'single' ? (
          <Marker
            key={`marker-${(item.data as Location).id}`}
            map={mapInstanceRef.current}
            location={item.data as Location}
          />
        ) : (
          <GroupMarker
            key={`cluster-${index}`}
            map={mapInstanceRef.current}
            locations={item.data as Location[]}
            centerPosition={item.center}
          />
        )
      )}
    </div>
  );
};

export default Map;
