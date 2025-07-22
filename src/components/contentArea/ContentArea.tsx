import React, { useEffect, useRef, useState } from 'react';
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
  const [showDetail, setShowDetail] = useState(false);


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