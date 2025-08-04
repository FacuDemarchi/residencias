import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth';
import { useTags } from '../../context/TagsContext';
import TagChip from '../common/TagChip';

interface Image {
  id: number;
  publication_id: number;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  created_at: string;
}

interface Publication {
  id: number;
  user_id: number;
  location_id: number;
  estado: string;
  titulo: string;
  descripcion: string;
  price: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen?: string;
  images?: Image[];
}

interface ContentAreaProps {
  selectedPublication: Publication | null;
  highlightedPublications: Publication[]; // Nueva prop para las publicaciones resaltadas
  onHighlightPublications: (publications: Publication[]) => void;
  onSelectPublication: (publication: Publication) => void; // Nueva prop
  onClearSelectedPublication?: () => void; // Nueva prop para limpiar la selección
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedPublication, highlightedPublications, onHighlightPublications, onSelectPublication, onClearSelectedPublication }) => {
  const { isLoaded, google, center, zoom, setZoom, viewport, mapLocations, loadingLocations } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth();
  const { tags, loading: tagsLoading } = useTags();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Función para restaurar el mapa a su estado original
  const restoreMapToOriginal = () => {
    if (mapInstance.current) {
      if (viewport) {
        mapInstance.current.fitBounds(viewport);
      } else {
        mapInstance.current.panTo(center);
        mapInstance.current.setZoom(zoom);
      }
    }
  };

  // Mostrar automáticamente el detalle solo cuando se selecciona una publicación específica
  useEffect(() => {
    if (selectedPublication) {
      setShowDetail(true);
      setCurrentImageIndex(0); // Resetear al primer índice de imagen
    } else {
      setShowDetail(false);
    }
  }, [selectedPublication]);

  // useEffect para manejar el panto cuando cambie selectedPublication o highlightedPublications
  useEffect(() => {
    if (!mapInstance.current || !google) return;

    if (selectedPublication) {
      // Buscar la publicación seleccionada en mapLocations.publications_test
      const locationWithPublication = mapLocations.find(location => 
        location.publications_test?.some(pub => pub.id === selectedPublication.id)
      );

      if (locationWithPublication && locationWithPublication.latitud && locationWithPublication.longitud) {
        // Hacer panto a la ubicación de la publicación seleccionada
        const position = {
          lat: parseFloat(locationWithPublication.latitud.toString()),
          lng: parseFloat(locationWithPublication.longitud.toString())
        };
        mapInstance.current.panTo(position);
        mapInstance.current.setZoom(15);
      }
    } else if (highlightedPublications.length > 0) {
      // Si hay publicaciones resaltadas, hacer panto a la primera ubicación
      const firstPublication = highlightedPublications[0];
      const locationWithPublication = mapLocations.find(location => 
        location.publications_test?.some(pub => pub.id === firstPublication.id)
      );

      if (locationWithPublication && locationWithPublication.latitud && locationWithPublication.longitud) {
        // Hacer panto a la ubicación de la primera publicación resaltada
        const position = {
          lat: parseFloat(locationWithPublication.latitud.toString()),
          lng: parseFloat(locationWithPublication.longitud.toString())
        };
        mapInstance.current.panTo(position);
        mapInstance.current.setZoom(15);
      }
    } else {
      // Si no hay publicación seleccionada ni resaltada, hacer panto al center original con zoom original
      mapInstance.current.panTo(center);
      if (viewport) {
        mapInstance.current.fitBounds(viewport);
      } else {
        mapInstance.current.setZoom(zoom);
      }
    }
  }, [selectedPublication, highlightedPublications, mapLocations, center, viewport, google]);

  // Listener para la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPublication) {
        console.log('⌨️ Tecla Escape presionada - deseleccionando publicación');
        setShowDetail(false);
        restoreMapToOriginal();
        if (onClearSelectedPublication) {
          onClearSelectedPublication();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPublication, onClearSelectedPublication]);

  console.log('mapLocations: ', mapLocations);

  useEffect(() => {
    if (isLoaded && google && mapRef.current && !mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
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

    // Agregar listener para clic en el mapa (fuera de marcadores)
    const mapClickListener = mapInstance.current.addListener('click', () => {
      console.log('🗺️ Click en el mapa (fuera de marcadores)');
      setShowDetail(false);
      restoreMapToOriginal();
      if (onClearSelectedPublication) {
        onClearSelectedPublication();
      }
    });

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
          disableAutoPan: true, // ← Cambiar a true
          pixelOffset: new google.maps.Size(0, -10),
        });

        marker.addListener('mouseover', () => {
          infoWindow.open(mapInstance.current, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        marker.addListener('click', () => {
          console.log('️ Click en marcador del mapa:', location);
          
          if (location.publications_test && location.publications_test.length > 0) {
            if (location.publications_test.length === 1) {
              // Marcador verde: seleccionar la publicación
              console.log('🟢 Marcador verde - seleccionando publicación:', location.publications_test[0]);
              onSelectPublication(location.publications_test[0]);
            } else {
              // Marcador azul: resaltar publicaciones
              console.log('🔵 Marcador azul - resaltando publicaciones:', location.publications_test);
              onHighlightPublications(location.publications_test);
            }
          }
        });

        markersRef.current.push(marker);
      } else {
        // Ubicación sin coordenadas válidas
      }
    });

    // Cleanup function para remover el listener
    return () => {
      if (mapClickListener) {
        google.maps.event.removeListener(mapClickListener);
      }
    };
  }, [mapLocations, google, onHighlightPublications, onSelectPublication, onClearSelectedPublication]);

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
      
      {/* Detalle de publicación */}
      <div id="publication-detail" style={{ backgroundColor: '#fafafa' }} className={`absolute top-16 right-6 w-[clamp(280px,28vw,480px)] min-h-[200px] max-h-[82vh] bg-white/90 border border-neutral-300 rounded-2xl shadow-xl overflow-y-auto ${showDetail ? "z-50 opacity-100" : "z-1[-1] opacity-0 pointer-events-none"}`}>
        {selectedPublication && (
          <div className="p-6 relative">
            {/* Botón X para cerrar */}
            <button 
              onClick={() => {
                setShowDetail(false);
                restoreMapToOriginal();
                if (onClearSelectedPublication) {
                  onClearSelectedPublication();
                }
              }}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedPublication.titulo}</h2>
            
            {/* Carrusel de imágenes */}
            <div className="relative mb-4">
              {/* Imagen principal */}
              <img 
                src={selectedPublication.images && selectedPublication.images.length > 0 
                  ? selectedPublication.images[currentImageIndex].url 
                  : selectedPublication.imagen} 
                alt={selectedPublication.titulo} 
                className="w-full h-48 object-cover rounded-lg"
              />
              
              {/* Controles del carrusel - solo mostrar si hay múltiples imágenes */}
              {selectedPublication.images && selectedPublication.images.length > 1 && (
                <>
                  {/* Botón anterior */}
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? selectedPublication.images!.length - 1 : prev - 1
                    )}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    ‹
                  </button>
                  
                  {/* Botón siguiente */}
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === selectedPublication.images!.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    ›
                  </button>
                  
                  {/* Indicadores de puntos */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {selectedPublication.images.map((_, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Contador de imágenes */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {selectedPublication.images.length}
                  </div>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{selectedPublication.descripcion}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">${selectedPublication.price}</span>
              <span className="text-sm text-gray-500">{selectedPublication.capacidad} personas · {selectedPublication.metros_cuadrados}m²</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{selectedPublication.direccion}</p>
            
            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => {
                  // TODO: Implementar lógica de reserva
                  console.log('Reservar publicación:', selectedPublication.id);
                }}
              >
                Reservar
              </button>
              <button 
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => {
                  // TODO: Implementar lógica de contacto
                  console.log('Contactar sobre publicación:', selectedPublication.id);
                }}
              >
                Contactar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mapa ocupa todo el espacio */}
      <div ref={mapRef} className="h-full w-full z-10" />
    </div>
  );
};

export default ContentArea; 