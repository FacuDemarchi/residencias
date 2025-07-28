import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth';
import { useTags } from '../../context/TagsContext';
import TagChip from '../common/TagChip';
import { supabase } from '../../services/supabaseClient';

const ContentArea: React.FC = () => {
  const { isLoaded, google, center, viewport } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth();
  const { tags, loading: tagsLoading } = useTags();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);


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

  // Consulta a la tabla publications_test
  useEffect(() => {
    const fetchPublications = async () => {
      setLoadingPublications(true);
      try {
        const { data, error } = await supabase
          .from('publications_test')
          .select('*, location(*)');
        
        if (error) {
          console.error('Error al obtener publicaciones:', error);
        } else {
          setPublications(data || []);
          console.log('Publicaciones obtenidas:', data);
        }
      } catch (error) {
        console.error('Error en la consulta:', error);
      } finally {
        setLoadingPublications(false);
      }
    };

    fetchPublications();
  }, []);

  // Crear marcadores en el mapa cuando cambien las publicaciones
  useEffect(() => {
    console.log('useEffect marcadores ejecutado');
    console.log('mapInstance.current:', !!mapInstance.current);
    console.log('google:', !!google);
    console.log('publications.length:', publications.length);
    console.log('publications:', publications);

    if (!mapInstance.current || !google || publications.length === 0) {
      console.log('Condiciones no cumplidas para crear marcadores');
      return;
    }

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    let marcadoresCreados = 0;

    // Crear nuevos marcadores para publicaciones con ubicación
    publications.forEach((publication, index) => {
      console.log(`Publicación ${index}:`, publication);
      console.log('location:', publication.location);
      console.log('latitud:', publication.location?.latitud);
      console.log('longitud:', publication.location?.longitud);

      if (publication.location && publication.location.latitud && publication.location.longitud) {
        console.log(`Creando marcador para publicación ${index}`);
        
        const lat = parseFloat(publication.location.latitud);
        const lng = parseFloat(publication.location.longitud);
        
        console.log('Coordenadas parseadas:', { lat, lng });

        const marker = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          },
          map: mapInstance.current,
          title: publication.titulo,
          label: {
            text: `$${publication.price || 'N/A'}`,
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }
        });

        // Agregar info window con detalles de la publicación
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${publication.titulo}</h3>
              <p style="margin: 4px 0; color: #666;">${publication.descripcion || 'Sin descripción'}</p>
              <p style="margin: 4px 0; font-weight: bold; color: #2c5aa0;">$${publication.price || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 12px; color: #888;">
                ${publication.capacidad ? `${publication.capacidad} personas` : ''} 
                ${publication.metros_cuadrados ? `• ${publication.metros_cuadrados}m²` : ''}
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

        markersRef.current.push(marker);
        marcadoresCreados++;
        console.log(`Marcador ${marcadoresCreados} creado exitosamente`);
      } else {
        console.log(`Publicación ${index} no tiene ubicación válida`);
      }
    });

    console.log(`Total de marcadores creados: ${marcadoresCreados}`);
  }, [publications, google]);

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