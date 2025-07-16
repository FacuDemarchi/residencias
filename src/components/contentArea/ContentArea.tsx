import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth';
import { useTags } from '../../context/TagsContext';
import TagChip from '../common/TagChip';

const ContentArea: React.FC = () => {
  const { isLoaded, google } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth();
  const { tags, loading: tagsLoading } = useTags();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Usuario autenticado:', user);
  }, [user]);

  useEffect(() => {
    console.log('Tags cargados:', tags);
  }, [tags]);

  useEffect(() => {
    if (isLoaded && google && mapRef.current) {
      new google.maps.Map(mapRef.current, {
        center: { lat: -31.4167, lng: -64.1833 },
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

  return (
    <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full w-full box-border relative">
      {/* Barra superior sobre el mapa */}
      <div className="absolute top-0 left-0 w-full z-10 h-14 grid grid-cols-2 items-center bg-white/80 backdrop-blur-sm">
        <div className="justify-self-start w-full overflow-x-auto whitespace-nowrap flex gap-2 items-center h-full px-2">
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