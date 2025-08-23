import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useProvideAuth } from '../../hooks/useProvideAuth';
import { useAuth } from '../../context/AuthContext';
import { useUserPublications } from '../../hooks/useUserPublications';

import { useReservations } from '../../hooks/useReservations';
import { useImageUpload } from '../../hooks/useImageUpload';
import TagChip from '../common/TagChip';
import type { Publication, Image } from '../../types/app';

interface ContentAreaProps {
  selectedPublication: Publication | null;
  highlightedPublications: Publication[]; // Nueva prop para las publicaciones resaltadas
  onHighlightPublications: (publications: Publication[]) => void;
  onSelectPublication: (publication: Publication) => void; // Nueva prop
  onClearSelectedPublication?: () => void; // Nueva prop para limpiar la selección
  onMyPublicationsClick: () => void; // Nueva prop para manejar clic en "Mis publicaciones"
  showUserPublications: boolean; // Nueva prop para controlar el modo de visualización
  isEditMode: boolean; // Nueva prop para controlar el modo de edición
  editingImages: Image[]; // Nueva prop para las imágenes en modo de edición
  onUpdatePublication: (publication: Publication) => void; // Nueva prop para actualizar publicación
  onAddImage: (image: Image) => void; // Nueva prop para agregar imagen
  onRemoveImage: (imageId: string) => void; // Nueva prop para eliminar imagen
  onFilterPublications: (filterType: string | null) => void; // Nueva prop para manejar filtros
  activeFilter: string | null; // Nueva prop para el filtro activo
  hasRentals: boolean; // Nueva prop para mostrar/ocultar botón "Mis alquileres"
  onEditModeChange?: (editMode: boolean) => void; // Nueva prop para notificar cambios en el modo de edición
}

const ContentArea: React.FC<ContentAreaProps> = ({
  selectedPublication,
  highlightedPublications,
  onHighlightPublications,
  onSelectPublication,
  onClearSelectedPublication,
  onMyPublicationsClick,
  showUserPublications,
  isEditMode,
  editingImages,
  onUpdatePublication,
  onAddImage,
  onRemoveImage,
  onFilterPublications,
  activeFilter,
  hasRentals,
  onEditModeChange
}) => {
  const { isLoaded, google, center, zoom, viewport, mapLocations, loadingLocations } = useGoogleMaps();
  const { user, signInWithGoogle, signOut } = useProvideAuth();
  const { userData } = useAuth();
  const { publications: userPublications } = useUserPublications();

  const { createReservation, loading: reservationLoading, error: reservationError } = useReservations();
  const { uploadImage, uploading: imageUploading, error: imageError } = useImageUpload();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para verificar si el usuario puede reservar una publicación
  const canUserReserve = (publication: Publication): boolean => {
    // No mostrar botón si no está autenticado, es residencia, o la publicación no está disponible
    if (!user || !userData || 
        userData.user_type === 'residencia' || 
        publication.estado !== 'activo') {
      return false;
    }
    return true;
  };

  // Función para manejar la reserva de una publicación
  const handleReservation = async (publication: Publication) => {
    if (!canUserReserve(publication)) {
      console.log('No se puede reservar esta publicación');
      return;
    }

    console.log('🔄 Creando reserva para publicación:', publication.id);
    
    const success = await createReservation(publication.id);
    
    if (success) {
      console.log('✅ Reserva creada exitosamente');
      // Mostrar mensaje de éxito
      alert('¡Reserva creada exitosamente!');
      
      // Redireccionar a /reserva
      window.location.href = '/reserva';
    } else {
      console.log('❌ Error al crear la reserva');
      // El error ya está manejado en el hook
    }
  };

  // Función para manejar la carga de imágenes
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        continue;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        continue;
      }

      const result = await uploadImage(file);
      if (result) {
                            const newImage: Image = {
            id: result.id.toString(),
            publication_id: selectedPublication?.id.toString() || '0',
            url_imagen: result.url,
            tipo: 'principal',
            created_at: new Date().toISOString()
          };
        onAddImage(newImage);
      }
    }

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Función para eliminar imagen
  const handleRemoveImage = async (imageId: string) => {
    onRemoveImage(imageId);
  };

  // Función para actualizar campos de la publicación
  const handleFieldChange = (field: keyof Publication, value: any) => {
    if (!selectedPublication) return;

    const updatedPublication = {
      ...selectedPublication,
      [field]: value
    };
    onUpdatePublication(updatedPublication);
  };

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
      console.log('📋 Mostrando detalle de publicación:', selectedPublication);

      // Verificar si el usuario es residencia y si la publicación le pertenece
      const isUserResidencia = userData?.user_type === 'residencia';
      const isOwnPublication = selectedPublication.user_id === userData?.id;
      const shouldEditMode = isUserResidencia && isOwnPublication;

      console.log('👤 Usuario es residencia:', isUserResidencia);
      console.log('📋 Publicación pertenece al usuario:', isOwnPublication);
      console.log('🆔 User ID:', userData?.id, 'Publication user_id:', selectedPublication.user_id);
      console.log('✏️ Modo edición activado:', shouldEditMode);

      // Actualizar el modo de edición basado en la verificación local
      if (shouldEditMode !== isEditMode) {
        // Notificar al componente padre sobre el cambio de modo
        if (onEditModeChange) {
          onEditModeChange(shouldEditMode);
        }
        if (shouldEditMode) {
          console.log('🔄 Activando modo edición automáticamente');
        } else {
          console.log('🔄 Desactivando modo edición automáticamente');
        }
      }

      setShowDetail(true);
    } else {
      setShowDetail(false);
    }
  }, [selectedPublication, userData?.user_type, userData?.id, isEditMode]);

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



  // Datos de ejemplo para testing mientras no hay datos en Supabase
  const exampleLocations = [
    {
      id: 1,
      latitud: -31.4167,
      longitud: -64.1833,
      direccion: 'Nueva Córdoba, Córdoba',
      publications_test: [
        {
          id: 1,
          user_id: 101,
          location_id: 1,
          estado: 'disponible',
          titulo: 'Departamento céntrico',
          descripcion: 'Hermoso departamento en el centro de la ciudad.',
          price: 35000,
          direccion: 'Calle Falsa 123',
          capacidad: 3,
          metros_cuadrados: 70,
          amenidades: ['WiFi', 'Cochera', 'Balcón'],
          created_at: '2024-06-01',
          updated_at: '2024-06-05',
          imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        }
      ]
    },
    {
      id: 2,
      latitud: -31.4200,
      longitud: -64.1900,
      direccion: 'Centro, Córdoba',
      publications_test: [
        {
          id: 2,
          user_id: 102,
          location_id: 2,
          estado: 'disponible',
          titulo: 'Casa con pileta',
          descripcion: 'Casa amplia con pileta y jardín.',
          price: 60000,
          direccion: 'Av. Siempreviva 742',
          capacidad: 6,
          metros_cuadrados: 150,
          amenidades: ['Pileta', 'Parrilla', 'Garage'],
          created_at: '2024-05-20',
          updated_at: '2024-06-03',
          imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
        }
      ]
    }
  ];

  // Usar solo datos de Supabase
  const locationsToProcess = mapLocations;
  


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
    if (!mapInstance.current || !google || locationsToProcess.length === 0) {
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

    // Filtrar ubicaciones según el modo
    const locationsToShow = showUserPublications
      ? locationsToProcess.filter(location =>
        location.publications_test?.some(pub =>
          userPublications.some(userPub => userPub.id === pub.id)
        )
      )
      : locationsToProcess;

    // Crear nuevos marcadores para ubicaciones filtradas
    locationsToShow.forEach((location) => {
      if (location.latitud && location.longitud) {
        const lat = parseFloat(location.latitud.toString());
        const lng = parseFloat(location.longitud.toString());

        // Filtrar publicaciones según el modo y filtros
        let publicationsToShow = location.publications_test || [];

        if (showUserPublications) {
          // Modo "Mis publicaciones" - filtrar por publicaciones del usuario
          publicationsToShow = publicationsToShow.filter(pub =>
            userPublications.some(userPub => userPub.id === pub.id)
          );
        } else if (highlightedPublications.length > 0) {
          // Modo filtrado - mostrar solo las publicaciones resaltadas
          publicationsToShow = publicationsToShow.filter(pub =>
            highlightedPublications.some(highlightedPub => highlightedPub.id === pub.id)
          );
        }

        // Determinar el texto del label y color según las publicaciones
        let labelText = '';
        let markerColor = '#2c5aa0'; // Color por defecto
        let markerWidth = 24; // Ancho base del marcador
        let markerHeight = 24; // Alto base del marcador

        if (publicationsToShow.length > 0) {
          if (publicationsToShow.length === 1) {
            // Si tiene una sola publicación, mostrar el precio en verde
            labelText = `$${publicationsToShow[0].price}`;
            markerColor = showUserPublications ? '#e74c3c' : '#27ae60'; // Rojo para mis publicaciones, verde para todas

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
            labelText = `${publicationsToShow.length}`;
            markerColor = showUserPublications ? '#e74c3c' : '#2c5aa0'; // Rojo para mis publicaciones, azul para todas
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

        if (publicationsToShow.length > 0) {
          publicationsToShow.forEach((publication: any) => {
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

          if (publicationsToShow.length > 0) {
            if (publicationsToShow.length === 1) {
              // Marcador verde: seleccionar la publicación
              console.log('🟢 Marcador verde - seleccionando publicación:', publicationsToShow[0]);
              onSelectPublication(publicationsToShow[0]);
            } else {
              // Marcador azul: resaltar publicaciones
              console.log('🔵 Marcador azul - resaltando publicaciones:', publicationsToShow);
              onHighlightPublications(publicationsToShow);
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
  }, [mapLocations, google, showUserPublications, userPublications]);

  return (
    <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full w-full box-border relative">
      {/* Barra superior sobre el mapa */}
      <div className="absolute top-0 left-0 w-full z-20 h-14 flex items-center bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Botones adicionales al inicio del carrusel */}
          {/* Mostrar "Mis publicaciones" solo para usuarios de tipo residencia */}
          {userData?.user_type === 'residencia' && (
            <button
              onClick={onMyPublicationsClick}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-colors"
            >
              Mis publicaciones
            </button>
          )}
          {hasRentals && (
            <TagChip
              label="Mis alquileres"
              onClick={() => onFilterPublications('mis_alquileres')}
              selected={activeFilter === 'mis_alquileres'}
            />
          )}
          {/* Filtros hardcodeados */}
          <TagChip
            label="Individual"
            onClick={() => onFilterPublications('Individual')}
            selected={activeFilter === 'Individual'}
          />
          <TagChip
            label="Doble"
            onClick={() => onFilterPublications('Doble')}
            selected={activeFilter === 'Doble'}
          />
          <TagChip
            label="Triple"
            onClick={() => onFilterPublications('Triple')}
            selected={activeFilter === 'Triple'}
          />
          <TagChip
            label="Cuádruple"
            onClick={() => onFilterPublications('Cuádruple')}
            selected={activeFilter === 'Cuádruple'}
          />
          <TagChip
            label="Residencia"
            onClick={() => onFilterPublications('Residencia')}
            selected={activeFilter === 'Residencia'}
          />
          <TagChip
            label="Departamento"
            onClick={() => onFilterPublications('Departamento')}
            selected={activeFilter === 'Departamento'}
          />
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

            {/* Título del modo */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {isEditMode ? (selectedPublication.id === -1 ? 'Crear nueva publicación' : 'Editar publicación') : selectedPublication.titulo}
              </h2>
              {isEditMode && (
                <p className="text-sm text-gray-500 mt-1">
                  {selectedPublication.id === -1 ? 'Completa los datos de tu nueva publicación' : 'Modifica los datos de tu publicación'}
                </p>
              )}
            </div>

            {isEditMode && userData?.user_type === 'residencia' ? (
              /* Formulario de edición - solo para usuarios residencia */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Ingresa el título de la publicación"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPublication.titulo}
                    onChange={(e) => handleFieldChange('titulo', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    placeholder="Describe tu espacio..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPublication.descripcion}
                    onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedPublication.price}
                      onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedPublication.capacidad}
                      onChange={(e) => handleFieldChange('capacidad', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    placeholder="Ingresa la dirección"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPublication.direccion}
                    onChange={(e) => handleFieldChange('direccion', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metros cuadrados</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPublication.metros_cuadrados}
                    onChange={(e) => handleFieldChange('metros_cuadrados', parseInt(e.target.value) || 0)}
                  />
                </div>

                {/* Sección de imágenes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>

                  {/* Input para cargar imágenes */}
                  <div className="mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {imageUploading ? 'Subiendo...' : '📷 Agregar imágenes'}
                    </label>
                    {imageError && (
                      <p className="text-red-500 text-xs mt-1">{imageError}</p>
                    )}
                  </div>

                  {/* Vista previa de imágenes */}
                  {editingImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {editingImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url_imagen}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveImage(image.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      // TODO: Implementar guardado de publicación
                      console.log('Guardando nueva publicación:', selectedPublication);
                    }}
                  >
                    Guardar publicación
                  </button>
                  <button
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      if (onClearSelectedPublication) {
                        onClearSelectedPublication();
                      }
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : isEditMode && userData?.user_type !== 'residencia' ? (
              /* Mensaje de acceso denegado para usuarios que no son residencia */
              <div className="text-center py-8">
                <div className="text-red-500 text-lg font-semibold mb-2">Acceso denegado</div>
                <p className="text-gray-600">Solo los usuarios de tipo "residencia" pueden crear publicaciones.</p>
                <button
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  onClick={() => {
                    if (onClearSelectedPublication) {
                      onClearSelectedPublication();
                    }
                  }}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              /* Vista normal de publicación */
              <>
                {/* Carrusel de imágenes */}
                <div className="relative mb-4">
                                     {/* Imagen principal */}
                   <img
                     src={selectedPublication.imagen || '/src/assets/react.svg'}
                     alt={selectedPublication.titulo}
                     className="w-full h-48 object-cover rounded-lg"
                     onError={(e) => {
                       e.currentTarget.src = '/src/assets/react.svg';
                     }}
                   />

                  {/* Placeholder para futuras funcionalidades de carrusel */}
                </div>

                {/* Información de la publicación */}
                <div className="space-y-4">
                  {/* Descripción */}
                  {selectedPublication.descripcion && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">Descripción</h3>
                      <p className="text-gray-600 text-sm">{selectedPublication.descripcion}</p>
                    </div>
                  )}

                  {/* Precio y características principales */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">${selectedPublication.price?.toLocaleString() || 0}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">{selectedPublication.capacidad} personas</div>
                      <div className="text-xs text-gray-500">{selectedPublication.metros_cuadrados}m²</div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Ubicación</h3>
                    <p className="text-sm text-gray-600">{selectedPublication.direccion}</p>
                  </div>

                  {/* Estado */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Estado</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${selectedPublication.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                        selectedPublication.estado === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {selectedPublication.estado?.charAt(0).toUpperCase() + selectedPublication.estado?.slice(1)}
                    </span>
                  </div>

                                     {/* Amenidades */}
                   {selectedPublication.amenidades && selectedPublication.amenidades.length > 0 && (
                     <div>
                       <h3 className="text-sm font-semibold text-gray-700 mb-1">Amenidades</h3>
                       <div className="flex flex-wrap gap-1">
                         {selectedPublication.amenidades.map((amenidad, index) => (
                           <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                             {amenidad}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Mensaje de error de reserva */}
                 {reservationError && (
                   <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                     <p className="text-red-700 text-sm">{reservationError}</p>
                   </div>
                 )}

                                 {/* Botones de acción */}
                 <div className="flex gap-3 mt-6">
                   {!user ? (
                     // Usuario no autenticado
                     <button
                       className="flex-1 bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                       disabled
                     >
                       Inicia sesión para reservar
                     </button>
                   ) : userData?.user_type === 'residencia' ? (
                     // Usuario es residencia
                     <button
                       className="flex-1 bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                       disabled
                     >
                       Solo para clientes
                     </button>
                   ) : selectedPublication?.estado !== 'activo' ? (
                     // Publicación no disponible
                     <button
                       className="flex-1 bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                       disabled
                     >
                       No disponible
                     </button>
                   ) : (
                     // Usuario puede reservar
                     <button 
                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                       onClick={() => handleReservation(selectedPublication)}
                       disabled={reservationLoading}
                     >
                       {reservationLoading ? 'Creando reserva...' : 'Reservar'}
                     </button>
                   )}
                  <button
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      console.log('Contactar sobre publicación:', selectedPublication.id);
                      // TODO: Implementar lógica de contacto
                    }}
                  >
                    Contactar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

             {/* Mapa ocupa todo el espacio */}
       <div ref={mapRef} className="h-full w-full z-10" />
       
       {/* Mensaje cuando no hay publicaciones */}
       {mapLocations.length === 0 && !loadingLocations && (
         <div className="absolute inset-0 flex items-center justify-center bg-white/90">
           <div className="text-center p-6">
             <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay publicaciones disponibles</h3>
             <p className="text-gray-500">No se encontraron publicaciones en esta área. Intenta cambiar la ubicación o ajustar los filtros.</p>
           </div>
         </div>
       )}
    </div>
  );
};

export default ContentArea; 