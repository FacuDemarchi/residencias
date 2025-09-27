import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Flex, 
  HStack, 
  Text, 
  IconButton,
  Button,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiFilter, FiSettings } from 'react-icons/fi';
// Icono hamburguesa SVG simple
const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z" />
  </svg>
);
import { PublicationsService, getPublications } from '../services/publicationsService';
import { getLocations } from '../services/locationsService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import type { Tables } from '../types/database';
import Map from '../components/map/Map';
import Sidebar from '../components/Sidebar';
import FiltersPanel from '../components/FiltersPanel';
import DetailContainer from '../components/DetailContainer';

type Location = Tables<'locations'>;
type Publication = Tables<'publications'> & {
  location?: Tables<'locations'>;
  states?: Tables<'states'>;
  images?: Tables<'images'>[];
};

const MainPage: React.FC = () => {
  const { user, userData, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  // const [myPublications, setMyPublications] = useState<Publication[]>([]);
  const [myRentals, setMyRentals] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  // Estados para selección de publicaciones
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<Publication | null>(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Location[] | null>(null);
  
  // Estado para ordenamiento
  const [sortOption, setSortOption] = useState<'precio-asc' | 'precio-desc' | 'capacidad-asc' | 'capacidad-desc' | 'metros-asc' | 'metros-desc' | 'precio-por-metro-asc' | 'precio-por-persona-asc' | 'default'>('default');

  // Chakra UI hooks
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // context - solo se ejecutan cuando cambian las dependencias
  const { center, currentSearchType, setCenter, setZoom } = useGoogleMaps();

  // Cargar locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations(center, currentSearchType);
        setLocations(data);
      } catch (err) {
        console.error('Error al cargar locations:', err);
        setLocations([]);
      }
    };
    fetchLocations();
  }, [center, currentSearchType]);

  // Cargar publicaciones basadas en las locations
  useEffect(() => {
    const fetchPublications = async () => {
      if (locations.length > 0) {
        try {
          const locationIds = locations.map(location => location.id).filter(id => id != null);
          
          if (locationIds.length === 0) {
            setPublications([]);
            return;
          }
          
          const validLocationIds = locationIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
          if (validLocationIds.length === 0) {
            setPublications([]);
            return;
          }
          
          const data = await getPublications(validLocationIds);
          setPublications(data);
        } catch (err) {
          console.error('Error al cargar publicaciones:', err);
          setPublications([]);
        }
      } else {
        setPublications([]);
      }
    };
    fetchPublications();
  }, [locations]);

  // Consulta mis publicaciones (para residencias)
  // useEffect(() => {
  //   const fetchMyPublications = async () => {
  //     if (user?.id && userData?.user_type === 'residencia') {
  //       const data = await PublicationsService.getPublicationsByUserId(user.id);
  //       setMyPublications(data);
  //     }
  //   };
  //   fetchMyPublications();
  // }, [user]);

  // Consulta mis rentals
  useEffect(() => {
    const fetchMyRentals = async () => {
      if (user?.id) {
        const rentals = await PublicationsService.getRentalsWithPublications(user.id);
        setMyRentals(rentals);
      }
    };

    fetchMyRentals();
  }, [user]);

  // Función para manejar la selección de ubicación desde el buscador
  const handleLocationSearch = (location: { lat: number; lng: number; address: string }) => {
    setCurrentLocation(location);
    // Actualizar el centro del mapa
    setCenter({ lat: location.lat, lng: location.lng });
    // Ajustar zoom para mejor visualización de la ubicación
    setZoom(15);
    console.log('Ubicación seleccionada:', location);
  };

  // Función para manejar cambios en los filtros
  const handleFiltersChange = (filters: any) => {
    setSearchFilters(filters);
    console.log('Filtros actualizados:', filters);
  };

  // Función para manejar selección de publicación individual
  const handlePublicationSelect = useCallback((publicationId: string) => {
    const publication = publications.find(pub => pub.id === publicationId);
    if (publication) {
      setPublicacionSeleccionada(publication);
      setGrupoSeleccionado(null); // Limpiar selección de grupo
    }
  }, [publications]);

  // Función para manejar selección de grupo
  const handleGroupSelect = useCallback((publicationIds: string[]) => {
    const selectedPublications = publications.filter(pub => publicationIds.includes(pub.id));
    if (selectedPublications.length > 0) {
      // Para grupoSeleccionado necesitamos las locations, no las publicaciones
      const selectedLocations = selectedPublications
        .map(pub => pub.location)
        .filter(loc => loc !== undefined) as Location[];
      
      setGrupoSeleccionado(selectedLocations);
      setPublicacionSeleccionada(null); // Limpiar selección individual
    }
  }, [publications]);

  // Función para manejar cambios de ordenamiento
  const handleSortChange = (sort: typeof sortOption) => {
    setSortOption(sort);
  };

  // Función para filtrar y ordenar publicaciones
  const getSortedPublications = () => {
    let filtered = [...publications];
    
    // Aplicar filtros de precio
    if (searchFilters.minPrice !== undefined) {
      filtered = filtered.filter(pub => (pub.price || 0) >= searchFilters.minPrice);
    }
    if (searchFilters.maxPrice !== undefined) {
      filtered = filtered.filter(pub => (pub.price || 0) <= searchFilters.maxPrice);
    }
    
    // Aplicar ordenamiento
    switch (sortOption) {
      case 'precio-asc':
        return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'precio-desc':
        return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'capacidad-asc':
        return filtered.sort((a, b) => (a.capacidad || 0) - (b.capacidad || 0));
      case 'capacidad-desc':
        return filtered.sort((a, b) => (b.capacidad || 0) - (a.capacidad || 0));
      case 'metros-asc':
        return filtered.sort((a, b) => (a.metros_cuadrados || 0) - (b.metros_cuadrados || 0));
      case 'metros-desc':
        return filtered.sort((a, b) => (b.metros_cuadrados || 0) - (a.metros_cuadrados || 0));
      case 'precio-por-metro-asc':
        return filtered.sort((a, b) => {
          const precioPorMetroA = (a.metros_cuadrados || 0) > 0 ? (a.price || 0) / (a.metros_cuadrados || 1) : Infinity;
          const precioPorMetroB = (b.metros_cuadrados || 0) > 0 ? (b.price || 0) / (b.metros_cuadrados || 1) : Infinity;
          return precioPorMetroA - precioPorMetroB;
        });
      case 'precio-por-persona-asc':
        return filtered.sort((a, b) => {
          const precioPorPersonaA = (a.capacidad || 0) > 0 ? (a.price || 0) / (a.capacidad || 1) : Infinity;
          const precioPorPersonaB = (b.capacidad || 0) > 0 ? (b.price || 0) / (b.capacidad || 1) : Infinity;
          return precioPorPersonaA - precioPorPersonaB;
        });
      default:
        return filtered;
    }
  };

  const sortedPublications = getSortedPublications();

  // Función para limpiar selecciones
  const clearSelection = useCallback(() => {
    setPublicacionSeleccionada(null);
    setGrupoSeleccionado(null);
  }, []);

  // Función para manejar reservas
  const handleReserve = (publication: Publication) => {
    window.open(`/checkout?id=${publication.id}`, '_blank');
  };



  return (
    <Box className="w-full h-screen transparent-sidebar" position="relative">
      {/* Layout responsive */}
      <Flex h="full" w="full" className="transparent-sidebar">
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <Box 
            w="250px" 
            bg="transparent"
            backdropFilter="blur(4px)"
            borderRight="1px" 
            borderColor="rgba(0, 0, 0, 0.1)"
            className="sidebar-desktop transparent-sidebar"
          >
            <Sidebar 
              userData={userData}
              myRentals={myRentals}
              publications={sortedPublications}
              onLocationSearch={handleLocationSearch}
              currentLocation={currentLocation}
              onPublicationSelect={handlePublicationSelect}
              publicacionSeleccionada={publicacionSeleccionada}
              grupoSeleccionado={grupoSeleccionado}
            />
          </Box>
        )}

        {/* Contenido principal */}
        <Box flex="1" position="relative">
          {/* Header móvil */}
          {isMobile && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              zIndex={10}
              bg="white"
              p={2}
              borderBottom="1px"
              borderColor="gray.200"
            >
              <HStack justify="space-between" align="center">
                <IconButton
                  aria-label="Abrir menú"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <HamburgerIcon />
                </IconButton>
                <Text fontSize="lg" fontWeight="bold" color="gray.700" flex="1" textAlign="center">
                  Residencias
                </Text>
                <HStack gap={2}>
                  {/* Botón de administración para residencias en móvil */}
                  {userData?.user_type === 'residencia' && (
                    <IconButton
                      aria-label="Panel de administración"
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('/admin')}
                      colorScheme="purple"
                    >
                      <Icon as={FiSettings} />
                    </IconButton>
                  )}
                  
                  {/* Botón de login/logout en móvil */}
                  {!user ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={signInWithGoogle}
                      colorScheme="blue"
                    >
                      Login
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={signOut}
                      colorScheme="red"
                    >
                      Logout
                    </Button>
                  )}
                  
                  <Box w="40px" /> {/* Espaciador para centrar el título */}
                </HStack>
              </HStack>
            </Box>
          )}

          {/* Mapa */}
          <Box
            flex="1"
            h="full"
            className={isMobile ? "pt-12" : ""}
            position="relative"
          >
            <Map 
              locations={locations} 
              publications={publications}
              onPublicationSelect={handlePublicationSelect}
              onGroupSelect={handleGroupSelect}
              publicacionSeleccionada={publicacionSeleccionada}
              grupoSeleccionado={grupoSeleccionado}
            />
            
            {/* Botones flotantes */}
            {!isMobile && (
              <Box
                position="absolute"
                top="15px"
                left="15px" // Pegado al sidebar
                zIndex={publicacionSeleccionada || grupoSeleccionado ? 997 : 998}
              >
                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(10px)"
                    border="1px"
                    borderColor="rgba(0, 0, 0, 0.1)"
                    _hover={{ bg: "rgba(255, 255, 255, 0.95)" }}
                    boxShadow="lg"
                  >
                    <Icon as={FiFilter} />
                  </Button>
                  
                  {/* Botón de administración para residencias */}
                  {userData?.user_type === 'residencia' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/admin')}
                      bg="rgba(255, 255, 255, 0.9)"
                      backdropFilter="blur(10px)"
                      border="1px"
                      borderColor="rgba(0, 0, 0, 0.1)"
                      _hover={{ bg: "rgba(255, 255, 255, 0.95)" }}
                      boxShadow="lg"
                      colorScheme="purple"
                    >
                      <Icon as={FiSettings} />
                    </Button>
                  )}
                  
                  {/* Botón de login/logout */}
                  {!user ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={signInWithGoogle}
                      bg="rgba(255, 255, 255, 0.9)"
                      backdropFilter="blur(10px)"
                      border="1px"
                      borderColor="rgba(0, 0, 0, 0.1)"
                      _hover={{ bg: "rgba(255, 255, 255, 0.95)" }}
                      boxShadow="lg"
                      colorScheme="blue"
                    >
                      Iniciar Sesión
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={signOut}
                      bg="rgba(255, 255, 255, 0.9)"
                      backdropFilter="blur(10px)"
                      border="1px"
                      borderColor="rgba(0, 0, 0, 0.1)"
                      _hover={{ bg: "rgba(255, 255, 255, 0.95)" }}
                      boxShadow="lg"
                      colorScheme="red"
                    >
                      Cerrar Sesión
                    </Button>
                  )}
                </HStack>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>

      {/* Drawer móvil */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={1000}
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <Box
            position="fixed"
            top={0}
            left={0}
            bottom={0}
            w="250px"
            bg="transparent"
            backdropFilter="blur(4px)"
            zIndex={1001}
            shadow="lg"
          >
            {/* Header del drawer */}
            <Box p={4} borderBottom="1px" borderColor="gray.200">
              <HStack justify="space-between" align="center">
                <IconButton
                  aria-label="Cerrar menú"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </IconButton>
                <Text fontSize="lg" fontWeight="bold" color="gray.700" flex="1" textAlign="center">
                  Residencias
                </Text>
                <Box w="40px" /> {/* Espaciador para centrar el título */}
              </HStack>
            </Box>
            
            {/* Contenido del drawer */}
            <Box h="calc(100vh - 80px)" overflowY="auto">
            <Sidebar 
              userData={userData}
              myRentals={myRentals}
              publications={sortedPublications}
              onLocationSearch={handleLocationSearch}
              currentLocation={currentLocation}
              onPublicationSelect={handlePublicationSelect}
              publicacionSeleccionada={publicacionSeleccionada}
              grupoSeleccionado={grupoSeleccionado}
            />
            </Box>
          </Box>
        </>
      )}

      {/* Panel de filtros */}
      <FiltersPanel
        isOpen={showFiltersPanel}
        onClose={() => setShowFiltersPanel(false)}
        onFiltersChange={handleFiltersChange}
        currentFilters={searchFilters}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      {/* Contenedor de detalle lateral */}
      <DetailContainer
        publicacionSeleccionada={publicacionSeleccionada}
        grupoSeleccionado={grupoSeleccionado}
        onClose={clearSelection}
        onReserve={handleReserve}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default MainPage; 
