import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth';
import { useTags } from '../../context/TagsContext';
import TagChip from '../common/TagChip';

const ContentArea: React.FC = () => {
  const { isLoaded, google, center, viewport } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth();
  const { tags, loading: tagsLoading } = useTags();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

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
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
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

  return (
    <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full w-full box-border relative">
      {/* Barra superior sobre el mapa */}
      <div className="absolute top-0 left-0 w-full z-10 h-14 grid grid-cols-2 items-center bg-white/80 backdrop-blur-sm">
        <div className="justify-self-start w-full whitespace-nowrap flex gap-2 items-center h-full px-2">
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
        {user ? (
          <button
            className="justify-self-end bg-white px-4 py-2 rounded shadow"
            onClick={signOut}
          >
            Cerrar sesión
          </button>
        ) : (
          <button
            className="justify-self-end bg-white px-4 py-2 rounded shadow"
            onClick={signInWithGoogle}
          >
            Google Login
          </button>
        )}
      </div>
      {/* Mapa ocupa todo el espacio */}
      <div ref={mapRef} className="h-full w-full z-0" />
    </div>
  );
};

export default ContentArea; 