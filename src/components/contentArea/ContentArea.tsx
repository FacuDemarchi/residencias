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
    <div className="col-start-2 col-end-6 row-start-2 row-end-3 h-full w-full box-border relative">
      {/* Mapa ocupa todo el espacio */}
      <div ref={mapRef} className="h-full w-full z-0" />
    </div>
  );
};

export default ContentArea; 