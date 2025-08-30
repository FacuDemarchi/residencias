import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ContentArea from '../components/contentArea/ContentArea';

import { useResidenciaPublications } from '../hooks/useResidenciaPublications';
import { getMyRentals } from '../hooks/getMyRentals';
import { getLocations } from '../hooks/getLocations';
import { getMyPublications } from '../hooks/getMyPublications';
import { getPublications } from '../hooks/getPublications';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import type { Publication, Image, MapLocation } from '../types/app';

const MainPage: React.FC = () => {
  // Estados para los datos cargados al montar la aplicación
  const [myRentals, setMyRentals] = useState<any>(null);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);

  // Obtener el centro dinámico del GoogleMapsContext
  const { center } = useGoogleMaps();

  // Hook para obtener alquileres del usuario
  const { hasRentals, rentalPublications, loading: rentalsLoading } = getMyRentals();
  
  // Hook para obtener ubicaciones (usando el centro dinámico del mapa)
  const { locations: fetchedLocations, loading: locationsLoading } = getLocations({
    center: center, // Usar el centro dinámico del mapa
    searchType: null
  });

  // Hook para obtener publicaciones del usuario (se ejecutará cuando tengamos los locationIds)
  const { publications: userPublications, loading: publicationsLoading } = getMyPublications();

  // Extraer IDs de ubicaciones para el hook de publicaciones
  const locationIds = locations.map(location => location.id);

  // Hook para obtener publicaciones basadas en las locations (se ejecuta automáticamente cuando cambian las locations)
  const { 
    publications: locationPublications
  } = getPublications({
    locationIds,
    sortBy: 'created_at',
    sortOrder: 'desc',
    pageSize: 20
  });

  // Efecto para guardar los alquileres cuando se carguen
  useEffect(() => {
    if (!rentalsLoading) {
      setMyRentals({
        hasRentals,
        rentalPublications
      });
    }
  }, [hasRentals, rentalPublications, rentalsLoading]);

  // Efecto para guardar las ubicaciones cuando se carguen
  useEffect(() => {
    if (!locationsLoading) {
      setLocations(fetchedLocations);
    }
  }, [fetchedLocations, locationsLoading]);

  // Efecto para guardar las publicaciones cuando se carguen
  useEffect(() => {
    if (!publicationsLoading) {
      setPublications(userPublications);
    }
  }, [userPublications, publicationsLoading]);

  // Efecto para mostrar los datos cargados
  useEffect(() => {
    console.log('📊 Datos cargados al montar la aplicación:');
    console.log('🏠 My Rentals:', myRentals);
    console.log('📍 Locations:', locations.length, 'ubicaciones');
    console.log('📋 Publications:', publications.length, 'publicaciones');
  }, [myRentals, locations, publications]);

  // Efecto para mostrar cuando se ejecute la búsqueda automática de publicaciones por locations
  useEffect(() => {
    if (locations.length > 0) {
      console.log('🔄 Ejecutando búsqueda automática de publicaciones por locations:');
      console.log('📍 Location IDs:', locationIds);
      console.log('📋 Publicaciones encontradas:', locationPublications.length);
    }
  }, [locations, locationIds, locationPublications]);

  const { publications: residenciaPublications } = useResidenciaPublications();
  
  // Estado para la publicación seleccionada
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  // Estado para publicaciones a remarcar en el sidebar
  const [highlightedPublications, setHighlightedPublications] = useState<Publication[]>([]);
  // Estado para controlar si se están mostrando las publicaciones del usuario
  const [showUserPublications, setShowUserPublications] = useState(false);
  // Estado para controlar el modo de edición
  const [isEditMode, setIsEditMode] = useState(false);
  // Estado para las imágenes en modo de edición
  const [editingImages, setEditingImages] = useState<Image[]>([]);
  // Estado para el filtro activo de publicaciones
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Función para manejar el filtrado de publicaciones
  const handleFilterPublications = (filterType: string | null) => {
    console.log('🔍 Aplicando filtro:', filterType);
    
    // Si se hace clic en el mismo filtro que ya está activo, limpiarlo
    if (activeFilter === filterType) {
      console.log('🔄 Limpiando filtro activo:', filterType);
      setActiveFilter(null);
      setSelectedPublication(null);
      setHighlightedPublications([]);
      setIsEditMode(false);
      setEditingImages([]);
      return;
    }
    
    setActiveFilter(filterType);
    
    // Limpiar selección y highlights al aplicar filtro
    setSelectedPublication(null);
    setHighlightedPublications([]);
    setIsEditMode(false);
    setEditingImages([]);

    // Aplicar filtros específicos
    if (filterType === 'mis_alquileres' && hasRentals && rentalPublications.length > 0) {
      console.log('🏠 Filtrando por mis alquileres:', rentalPublications.length);
      setHighlightedPublications(rentalPublications);
      // No setear automáticamente selectedPublication para evitar panto automático
    } else if (filterType === 'Individual') {
      // Filtrar por capacidad = 1
      const filteredPublications = residenciaPublications.filter(pub => pub.capacidad === 1);
      setHighlightedPublications(filteredPublications);
    } else if (filterType === 'Doble') {
      // Filtrar por capacidad = 2
      const filteredPublications = residenciaPublications.filter(pub => pub.capacidad === 2);
      setHighlightedPublications(filteredPublications);
    } else if (filterType === 'Triple') {
      // Filtrar por capacidad = 3
      const filteredPublications = residenciaPublications.filter(pub => pub.capacidad === 3);
      setHighlightedPublications(filteredPublications);
    } else if (filterType === 'Cuádruple') {
      // Filtrar por capacidad = 4
      const filteredPublications = residenciaPublications.filter(pub => pub.capacidad === 4);
      setHighlightedPublications(filteredPublications);
    } else if (filterType === 'Residencia') {
      // Filtrar por metros cuadrados >= 80 (criterio para residencia)
      const filteredPublications = residenciaPublications.filter(pub => pub.metros_cuadrados >= 80);
      setHighlightedPublications(filteredPublications);
    } else if (filterType === 'Departamento') {
      // Filtrar por metros cuadrados < 80 (criterio para departamento)
      const filteredPublications = residenciaPublications.filter(pub => pub.metros_cuadrados < 80);
      setHighlightedPublications(filteredPublications);
    } else {
      // Limpiar filtros
      setHighlightedPublications([]);
    }
  };

  // Función para remarcar publicaciones en el sidebar (mantener para compatibilidad)
  const handleHighlightPublications = (publications: Publication[]) => {
    console.log('🎯 Publicaciones a remarcar en MainPage:', publications);
    setHighlightedPublications(publications);
  };

  // Nueva función para seleccionar publicación desde el mapa
  const handleSelectPublication = (publication: Publication) => {
    console.log('🗺️ Publicación seleccionada:', publication);
    
    // La verificación de modo de edición se hará en ContentArea
    setSelectedPublication(publication);
    setEditingImages([]);
  };

  // Función para deseleccionar publicación y limpiar highlights
  const handleClearSelectedPublication = () => {
    console.log('❌ Deseleccionando publicación y limpiando highlights');
    setSelectedPublication(null);
    setHighlightedPublications([]);
    setIsEditMode(false);
    setEditingImages([]);
    // Nota: El ContentArea se encarga de restaurar el mapa a través de restoreMapToOriginal()
  };

  // Función para manejar el clic en "Mis publicaciones"
  const handleMyPublicationsClick = () => {
    console.log('📝 Cambiando a modo "Mis publicaciones"');
    setShowUserPublications(!showUserPublications);
    // Limpiar selección, highlights y filtro al cambiar de modo
    setSelectedPublication(null);
    setHighlightedPublications([]);
    setIsEditMode(false);
    setEditingImages([]);
    setActiveFilter(null);
  };

  // Función para manejar el clic en "Crear nueva publicación"
  const handleNewPublicationClick = () => {
    console.log('➕ Creando nueva publicación');
    // Crear una publicación vacía para editar
    const newPublication: Publication = {
      id: -1, // ID temporal negativo para indicar que es nueva
      user_id: 0,
      location_id: 0,
      estado: 'borrador',
      titulo: '',
      descripcion: '',
      price: 0,
      direccion: '',
      capacidad: 0,
      metros_cuadrados: 0,
      amenidades: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imagen: ''
    };
    setSelectedPublication(newPublication);
    setIsEditMode(true);
    setEditingImages([]);
  };

  // Función para actualizar la publicación en modo de edición
  const handleUpdatePublication = (updatedPublication: Publication) => {
    setSelectedPublication(updatedPublication);
  };

  // Función para agregar imagen en modo de edición
  const handleAddImage = (image: Image) => {
    setEditingImages(prev => [...prev, image]);
  };

  // Función para eliminar imagen en modo de edición
  const handleRemoveImage = (imageId: string) => {
    setEditingImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Función para manejar el cambio de modo de edición desde ContentArea
  const handleEditModeChange = (editMode: boolean) => {
    console.log('🔄 Cambiando modo de edición a:', editMode);
    setIsEditMode(editMode);
  };

  // useEffect para manejar las publicaciones de residencia automáticamente
  // Comentado para evitar panto automático - solo se cargarán cuando el usuario interactúe
  // useEffect(() => {
  //   if (userData?.user_type === 'residencia' && residenciaPublications.length > 0) {
  //     console.log('🏢 Usuario es residencia, cargando publicaciones:', residenciaPublications.length);
  //     // Actualizar los marcadores con las publicaciones de la residencia
  //     setHighlightedPublications(residenciaPublications);
  //   }
  // }, [userData?.user_type, residenciaPublications]);

  // useEffect para manejar los alquileres del usuario automáticamente
  useEffect(() => {
    if (hasRentals && rentalPublications.length > 0 && !activeFilter) {
      console.log('🏠 Usuario tiene alquileres, cargando publicaciones:', rentalPublications.length);
      // No hacer nada automáticamente, solo cuando se active el filtro
    }
  }, [hasRentals, rentalPublications, activeFilter]);

  return (
    <div className="grid grid-cols-5 grid-rows-[3.5rem_1fr] w-screen h-screen min-w-screen min-h-screen p-0 m-0">
      {/* Sidebar ocupa ambas filas, pegado al techo */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 h-full">
        <Sidebar 
          setSelectedPublication={setSelectedPublication}
          highlightedPublications={highlightedPublications}
          selectedPublication={selectedPublication}
          showUserPublications={showUserPublications}
          onNewPublicationClick={handleNewPublicationClick}
          onSelectPublication={handleSelectPublication}
          activeFilter={activeFilter}
        />
      </div>
      {/* ContentArea en la segunda fila y columnas 2-6 */}
      <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full">
        <ContentArea 
          selectedPublication={selectedPublication}
          highlightedPublications={highlightedPublications}
          onHighlightPublications={handleHighlightPublications}
          onSelectPublication={handleSelectPublication}
          onClearSelectedPublication={handleClearSelectedPublication}
          onMyPublicationsClick={handleMyPublicationsClick}
          showUserPublications={showUserPublications}
          isEditMode={isEditMode}
          editingImages={editingImages}
          onUpdatePublication={handleUpdatePublication}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          onFilterPublications={handleFilterPublications}
          activeFilter={activeFilter}
          hasRentals={hasRentals}
          onEditModeChange={handleEditModeChange}
        />
      </div>
    </div>
  );
};

export default MainPage;