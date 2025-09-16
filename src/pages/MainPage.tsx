import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  HStack, 
  Text, 
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react';
// Icono hamburguesa SVG simple
const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z" />
  </svg>
);
import { PublicationsService } from '../services/publicationsService';
import { getLocations } from '../services/locationsService';
import { useAuth } from '../context/AuthContext';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import type { Tables } from '../types/database';
import Map from '../components/map/Map';
import Sidebar from '../components/Sidebar';

type Location = Tables<'locations'>;
type Publication = Tables<'publications'>;

const MainPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [publications] = useState<Publication[]>([]);
  const [myPublications, setMyPublications] = useState<Publication[]>([]);
  const [myRentals, setMyRentals] = useState<any[]>([]);

  // Chakra UI hooks
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // context - solo se ejecutan cuando cambian las dependencias
  const { user, userData } = useAuth();
  const { center, currentSearchType } = useGoogleMaps();

  // Cargar locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log('Fetching locations with:', { center, currentSearchType });
        const data = await getLocations(center, currentSearchType);
        console.log('Locations fetched:', data);
        setLocations(data);
      } catch (err) {
        console.error('Error al cargar locations:', err);
        setLocations([]);
      }
    };
    fetchLocations();
  }, [center, currentSearchType]);

  // Consulta mis publicaciones (para residencias)
  useEffect(() => {
    const fetchMyPublications = async () => {
      if (user?.id && userData?.user_type === 'residencia') {
        const data = await PublicationsService.getPublicationsByUserId(user.id);
        setMyPublications(data);
      }
    };
    fetchMyPublications();
  }, [user]);

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

  console.log('Locations:', locations);
  console.log('Publications:', publications);
  console.log('My Publications:', myPublications);
  console.log('My Rentals:', myRentals);


  return (
    <Box className="w-full h-screen overflow-hidden" position="fixed" top="0" left="0" right="0" bottom="0">
      {/* Layout responsive */}
      <Flex h="full" w="full">
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <Box 
            w="250px" 
            bg="white" 
            borderRight="1px" 
            borderColor="gray.200"
            className="sidebar-desktop"
          >
            <Sidebar 
              userData={userData}
              myRentals={myRentals}
              publications={publications}
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
                <Box w="40px" /> {/* Espaciador para centrar el título */}
              </HStack>
            </Box>
          )}

          {/* Mapa */}
          <Box
            flex="1"
            h="full"
            className={isMobile ? "pt-12" : ""}
          >
            <Map locations={locations} />
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
            bg="white"
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
                publications={publications}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MainPage; 
