import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const ContentArea: React.FC = () => {
  const { isLoaded, google } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && google && mapRef.current) {
      new google.maps.Map(mapRef.current, {
        center: { lat: -31.4167, lng: -64.1833 }, // Córdoba, Argentina
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });
    }
  }, [isLoaded, google]);

  return (
    <div className="col-start-2 col-end-6 h-full w-full box-border bg-purple-500 grid">
      {/* Mapa ocupa toda la grilla */}
      <div ref={mapRef} className="h-full w-full col-start-1 col-end-[-1] row-start-1 row-end-[-1] z-0" />
      {/* Botón arriba a la derecha (última columna, primera fila) */}
      <button
        className="col-start-[-1] row-start-1 z-10 justify-self-end self-start m-4 bg-white px-4 py-2 rounded shadow"
        onClick={() => alert('¡Botón sobre el mapa!')}
      >
        Botón
      </button>
    </div>
  );
};

export default ContentArea; 