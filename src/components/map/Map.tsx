import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import Marker from './Marker';
import GroupMarker from './GroupMarker';
import type { Tables } from '../../types/database';

type Location = Tables<'locations'> & {
  publications?: Tables<'publications'>[];
};

interface MapProps {
  locations?: Location[];
  publications?: any[];
  onPublicationSelect?: (publicationId: string) => void;
  onGroupSelect?: (publicationIds: string[]) => void;
  onMapClick?: () => void;
  publicacionSeleccionada?: any | null;
  grupoSeleccionado?: Location[] | null;
}

interface ClusteredItem {
  type: 'single' | 'cluster';
  data: Location | Location[];
  center: { lat: number; lng: number };
  count?: number;
}

const Map: React.FC<MapProps> = ({ 
  locations = [], 
  publications = [],
  onPublicationSelect,
  onGroupSelect,
  onMapClick,
  publicacionSeleccionada,
  grupoSeleccionado
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const originalCenterRef = useRef<google.maps.LatLngLiteral | null>(null);
  const originalZoomRef = useRef<number | null>(null);

  // Función para manejar click en marcador individual
  const handleMarkerClick = useCallback((location: Location) => {
    // Buscar publicación asociada a esta ubicación
    const associatedPublication = publications.find(pub => pub.location_id === location.id);
    if (associatedPublication && onPublicationSelect) {
      onPublicationSelect(associatedPublication.id);
    }
  }, [publications, onPublicationSelect]);

  // Función para manejar click en marcador de grupo
  const handleGroupClick = useCallback((locations: Location[]) => {
    // Buscar todas las publicaciones asociadas a estas ubicaciones
    const associatedPublications = locations
      .map(location => publications.find(pub => pub.location_id === location.id))
      .filter(pub => pub !== undefined);
    
    if (associatedPublications.length > 0 && onGroupSelect) {
      const publicationIds = associatedPublications.map(pub => pub.id);
      onGroupSelect(publicationIds);
    }
  }, [publications, onGroupSelect]);
  
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

    return clustered;
  }, [locations]);

  // Inicializar el mapa
  useEffect(() => {
    if (!isLoaded || !google || !google.maps || !mapRef.current || mapInstanceRef.current) return;

    // Pequeño delay para asegurar que la API esté completamente cargada
    const initMap = () => {
      if (!google.maps.Map) {
        setTimeout(initMap, 100);
        return;
      }

      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: 'roadmap',
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
    
      // Agregar listener para click en el mapa (deseleccionar)
      map.addListener('click', () => {
        if (onMapClick) {
          onMapClick();
        }
      });
      
      // Agregar listener para doble click en el mapa (volver al center y zoom originales)
      map.addListener('dblclick', () => {
        if (mapInstanceRef.current && originalCenterRef.current && originalZoomRef.current !== null) {
          mapInstanceRef.current.panTo(originalCenterRef.current);
          mapInstanceRef.current.setZoom(originalZoomRef.current);
        }
      });
    };

    initMap();

  }, [isLoaded, google, center, zoom, onMapClick]);

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

  // Pan to automático cuando se selecciona una publicación
  useEffect(() => {
    if (publicacionSeleccionada && publicacionSeleccionada.location_id && mapInstanceRef.current) {
      // Buscar la ubicación correspondiente en la lista de locations
      const location = locations.find(loc => loc.id === publicacionSeleccionada.location_id);
      if (location) {
        console.log('🎯 Pan to publicación seleccionada:', location);
        mapInstanceRef.current.panTo({
          lat: location.latitud,
          lng: location.longitud
        });
        mapInstanceRef.current.setZoom(16);
      } else {
        console.log('❌ No se encontró ubicación para la publicación:', publicacionSeleccionada.location_id);
      }
    }
  }, [publicacionSeleccionada?.id, locations, isLoaded]);

  // Pan to automático cuando se selecciona un grupo
  useEffect(() => {
    if (grupoSeleccionado && grupoSeleccionado.length > 0 && mapInstanceRef.current) {
      console.log('🎯 Pan to grupo seleccionado:', grupoSeleccionado);
      mapInstanceRef.current.panTo({
        lat: grupoSeleccionado[0].latitud,
        lng: grupoSeleccionado[0].longitud
      });
      mapInstanceRef.current.setZoom(17);
    }
  }, [grupoSeleccionado, isLoaded]);

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
    <div className="w-full h-full relative" style={{ width: '100%', height: '100%' }}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ width: '100%', height: '100%', minHeight: '400px', backgroundColor: '#f0f0f0' }}
      />
      {isLoaded && mapInstanceRef.current && clusteredItems.map((item, index) => 
        item.type === 'single' ? (
          <Marker
            key={`marker-${(item.data as Location).id}`}
            map={mapInstanceRef.current}
            location={item.data as Location}
            onMarkerClick={handleMarkerClick}
            publication={(item.data as Location).publications?.[0]}
          />
        ) : (
          <GroupMarker
            key={`cluster-${index}`}
            map={mapInstanceRef.current}
            locations={item.data as Location[]}
            centerPosition={item.center}
            onGroupClick={handleGroupClick}
          />
        )
      )}
    </div>
  );
};

export default Map;
