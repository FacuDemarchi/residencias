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
    mapLocations.forEach((location) => {
      if (location.latitud && location.longitud) {
        const lat = parseFloat(location.latitud.toString());
        const lng = parseFloat(location.longitud.toString());

        // Determinar el texto del label y color según las publicaciones
        let labelText = '';
        let markerColor = '#2c5aa0'; // Color por defecto
        let markerWidth = 24; // Ancho base del marcador
        let markerHeight = 24; // Alto base del marcador
        
        if (location.publications_test && location.publications_test.length > 0) {
          if (location.publications_test.length === 1) {
            // Si tiene una sola publicación, mostrar el precio en verde
            labelText = `$${location.publications_test[0].price}`;
            markerColor = '#27ae60'; // Verde para precio
            
            // Ajustar el ancho del marcador según la longitud del precio
            const priceLength = labelText.length;
            if (priceLength > 6) {
              markerWidth = 48; // Más espacio para precios largos
            } else if (priceLength > 4) {
              markerWidth = 44; // Más espacio para precios medianos
            } else {
              markerWidth = 40; // Más espacio para precios cortos
            }
          } else {
            // Si tiene múltiples publicaciones, mostrar la cantidad en azul
            labelText = `${location.publications_test.length}`;
            markerColor = '#2c5aa0'; // Azul para cantidad
            markerWidth = 36; // Más grande para números
          }
        }

        const marker = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          },
          map: mapInstance.current,
          title: `Ubicación ${location.id}`,
          label: {
            text: labelText,
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          },
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="${markerWidth}" height="${markerHeight}" viewBox="0 0 ${markerWidth} ${markerHeight}" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="${markerWidth - 4}" height="${markerHeight - 4}" rx="3" fill="${markerColor}" stroke="white" stroke-width="2"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(markerWidth, markerHeight),
            anchor: new google.maps.Point(markerWidth / 2, markerHeight / 2)
          }
        });

        // Crear contenido del infoWindow con información de publicaciones
        let infoContent = '<div style="padding: 10px; max-width: 250px;">';
        
        if (location.publications_test && location.publications_test.length > 0) {
          location.publications_test.forEach((publication: any) => {
            infoContent += `
              <p style="margin: 4px 0; font-size: 12px; color: #333;">
                $${publication.price} | ${publication.capacidad} personas | ${publication.metros_cuadrados}m²
              </p>
            `;
          });
        } else {
          infoContent += '<p style="margin: 4px 0; font-size: 12px; color: #888;">Sin publicaciones</p>';
        }
        
        infoContent += '</div>';

        // Agregar info window con detalles de las publicaciones
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent,
          disableAutoPan: false,
          pixelOffset: new google.maps.Size(0, -10),
          // closeBoxURL: '',
          // closeBoxMargin: '0px'
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