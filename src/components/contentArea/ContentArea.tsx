import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth';
import { useTags } from '../../context/TagsContext';
import TagChip from '../common/TagChip';

const ContentArea: React.FC = () => {
  const { isLoaded, google, center, viewport, mapLocations, loadingLocations } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth();
  const { tags, loading: tagsLoading } = useTags();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);

  console.log('mapLocations: ', mapLocations);

  useEffect(() => {
    if (isLoaded && google && mapRef.current && !mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "poi.business", stylers: [{ visibility: "off" }] },
          { featureType: "poi.park", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          // Ocultar etiquetas de ciudades principales
          { featureType: "administrative.locality", elementType: "labels", stylers: [{ visibility: "off" }] },
          // Mantener barrios más pequeños
          { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "on" }] }
        ]
      });
    }
  }, [isLoaded, google]);

  // Actualizar el centro o el viewport del mapa cuando cambie el contexto
  useEffect(() => {
    if (mapInstance.current) {
      if (viewport) {
        mapInstance.current.fitBounds(viewport);
      } else {
        mapInstance.current.setCenter(center);
      }
    }
  }, [center, viewport]);



  // Crear marcadores en el mapa cuando cambien las ubicaciones
  useEffect(() => {
    if (!mapInstance.current || !google || mapLocations.length === 0) {
      return;
    }

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Crear nuevos marcadores para ubicaciones
    mapLocations.forEach((location, index) => {
      if (location.latitud && location.longitud) {
        const lat = parseFloat(location.latitud.toString());
        const lng = parseFloat(location.longitud.toString());

        const marker = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          },
          map: mapInstance.current,
          title: `Ubicación ${location.id}`,
          label: {
            text: location.estado === 'disponible' ? '✓' : '✗',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold'
          },
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" fill="${location.estado === 'disponible' ? '#2c5aa0' : '#e74c3c'}" stroke="white" stroke-width="1"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(16, 16),
            anchor: new google.maps.Point(8, 8)
          }
        });

        // Agregar info window con detalles de la ubicación
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">Ubicación ${location.id}</h3>
              <p style="margin: 4px 0; font-weight: bold; color: ${location.estado === 'disponible' ? '#2c5aa0' : '#e74c3c'};">
                Estado: ${location.estado}
              </p>
              <p style="margin: 4px 0; font-size: 12px; color: #888;">
                Lat: ${lat.toFixed(6)}<br>
                Lng: ${lng.toFixed(6)}
              </p>
            </div>
          `
        });

        marker.addListener('mouseover', () => {
          infoWindow.open(mapInstance.current, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        marker.addListener('click', () => {
          console.log('Marcador clickeado:', location);
          // Aquí puedes agregar lógica para mostrar detalles o navegar
        });

        markersRef.current.push(marker);
      } else {
        // Ubicación sin coordenadas válidas
      }
    });
  }, [mapLocations, google]);

  return (
    <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full w-full box-border relative">
      {/* Barra superior sobre el mapa */}
      <div className="absolute top-0 left-0 w-full z-20 h-14 flex items-center bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Botones adicionales al inicio del carrusel */}
          <TagChip label="Mis publicaciones" />
          <TagChip label="Mis alquileres" />
          {tagsLoading ? (
            <span className="text-primary">Cargando tags...</span>
          ) : (
            tags.map(tag => (
              <TagChip key={tag.name} label={tag.name} />
            ))
          )}
        </div>
        <button onClick={() => setShowDetail(v => !v)} className='ml-4 bg-white px-4 py-2 rounded shadow'>
          {showDetail ? "Ocultar" : "Mostrar"} detalle
        </button>
        {loadingLocations && (
          <span className="ml-4 text-sm text-gray-600">Cargando ubicaciones...</span>
        )}
        {user ? (
          <button
            className="ml-4 bg-white px-4 py-2 rounded shadow"
            onClick={signOut}
          >
            Cerrar sesión
          </button>
        ) : (
          <button
            className="ml-4 bg-white px-4 py-2 rounded shadow"
            onClick={signInWithGoogle}
          >
            Google Login
          </button>
        )}
      </div>
      {/* Detalle de publicación (solo contenedor) */}
      <div id="publication-detail" style={{ backgroundColor: '#fafafa' }} className={`absolute top-16 right-6 w-[clamp(280px,28vw,480px)] min-h-[200px] max-h-[82vh] bg-white/90 border border-neutral-300 rounded-2xl shadow-xl overflow-y-auto ${showDetail ? "z-50 opacity-100" : "z-1[-1] opacity-0 pointer-events-none"}`}>

      </div>

      {/* Mapa ocupa todo el espacio */}
      <div ref={mapRef} className="h-full w-full z-10" />
    </div>
  );
};

export default ContentArea; 