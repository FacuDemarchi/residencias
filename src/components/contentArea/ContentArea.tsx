import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth'; // Importa el hook

const ContentArea: React.FC = () => {
  const { isLoaded, google } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth(); // Extrae user, signIn y signOut
  const mapRef = useRef<HTMLDivElement>(null);

  // Loguea la info del usuario cada vez que cambie
  useEffect(() => {
    console.log('Usuario autenticado:', user);
  }, [user]);

  useEffect(() => {
    if (isLoaded && google && mapRef.current) {
      new google.maps.Map(mapRef.current, {
        center: { lat: -31.4167, lng: -64.1833 }, // Córdoba, Argentina
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.park",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
    }
  }, [isLoaded, google]);

  return (
    <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full w-full box-border relative">
      {/* Barra superior sobre el mapa */}
      <div className="absolute top-0 left-0 w-full z-10 h-14 grid grid-cols-2 items-center bg-white/80 border-b border-purple-200 backdrop-blur-sm">
        <span className="text-purple-700 font-semibold justify-self-start w-full truncate">Carrusel de tags (próximamente)</span>
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