import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Image, 
  Badge, 
  HStack,
  Flex,
  Button,
  Icon
} from '@chakra-ui/react';
import { FiMapPin, FiUsers, FiMaximize2, FiWifi, FiTruck, FiX, FiCalendar, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import type { Tables } from '../types/database';

type Location = Tables<'locations'>;
type Publication = Tables<'publications'> & {
  images?: Tables<'images'>[];
  states?: Tables<'states'>;
  location?: Tables<'locations'>;
};

interface DetailContainerProps {
  publicacionSeleccionada?: Publication | null;
  grupoSeleccionado?: Location[] | null;
  onClose?: () => void;
  onReserve?: (publication: Publication) => void;
  onRent?: (publication: Publication) => void;
  isMobile?: boolean;
}

const DetailContainer: React.FC<DetailContainerProps> = ({
  publicacionSeleccionada,
  grupoSeleccionado,
  onClose,
  onReserve,
  onRent,
  isMobile = false
}) => {
  const { user } = useAuth();
  // Estado para el índice de la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Estado para verificar si el usuario tiene una reserva activa
  const [userHasReservation, setUserHasReservation] = useState(false);

  // Función para formatear precios
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  // Funciones para navegar entre imágenes
  const nextImage = () => {
    if (publicacionSeleccionada?.images && publicacionSeleccionada.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev < publicacionSeleccionada.images!.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (publicacionSeleccionada?.images && publicacionSeleccionada.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : publicacionSeleccionada.images!.length - 1
      );
    }
  };

  // Resetear índice cuando cambia la publicación
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [publicacionSeleccionada?.id]);

  // Verificar si el usuario tiene una reserva activa para esta publicación
  useEffect(() => {
    const checkUserReservation = async () => {
      if (!publicacionSeleccionada?.id || !user?.id) {
        setUserHasReservation(false);
        return;
      }

      try {
        const { data: rentalData, error } = await supabase
          .from('rentals')
          .select('*')
          .eq('publication_id', publicacionSeleccionada.id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error verificando reserva:', error);
          setUserHasReservation(false);
          return;
        }

        // El usuario tiene reserva si existe un rental y no está alquilado (contrato_aceptado = false)
        setUserHasReservation(rentalData !== null && rentalData.contrato_aceptado === false);
      } catch (error) {
        console.error('Error verificando reserva:', error);
        setUserHasReservation(false);
      }
    };

    checkUserReservation();
  }, [publicacionSeleccionada?.id, user?.id]);

  // Función para obtener color del estado
  const getStateColor = (stateName?: string) => {
    switch (stateName) {
      case 'disponible': return 'green';
      case 'reservada': return 'yellow';
      case 'alquilada': return 'red';
      case 'pausada': return 'orange';
      case 'eliminada': return 'gray';
      default: return 'blue';
    }
  };

  // Imagen por defecto
  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop&crop=center';

  // No mostrar nada si no hay selección
  if (!publicacionSeleccionada && !grupoSeleccionado) {
    return null;
  }

  return (
    <Box
      position="absolute"
      top="0"
      left={isMobile ? "0" : "250px"}
      bottom="0"
      w={isMobile ? "100%" : "400px"}
      bg="white"
      shadow="xl"
      zIndex={999}
      borderLeft={isMobile ? "none" : "1px"}
      borderColor="gray.200"
      display="grid"
      gridTemplateRows="auto 1fr auto"
      overflow="hidden"
    >
      {/* Header */}
      <Flex align="center" p={4} borderBottom="1px" borderColor="gray.200" gap={3}>
        <Button
          aria-label="Cerrar"
          size="sm"
          variant="ghost"
          onClick={onClose}
          p={1}
        >
          <FiX />
        </Button>
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          {publicacionSeleccionada ? 'Detalle de Publicación' : 'Grupo de Ubicaciones'}
        </Text>
      </Flex>

      {/* Contenido scrollable */}
      <Box p={4} overflowY="auto" minH={0}>
          {publicacionSeleccionada ? (
            // Detalle de publicación individual
            <VStack align="stretch" gap={4}>
              {/* Carrusel de imágenes */}
              <Box position="relative" h="200px" borderRadius="md" overflow="hidden">
                <Image
                  src={publicacionSeleccionada.images && publicacionSeleccionada.images.length > 0 
                    ? publicacionSeleccionada.images[currentImageIndex].url_imagen 
                    : defaultImage}
                  alt={publicacionSeleccionada.titulo}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
                
                {/* Precio superpuesto */}
                <Box
                  position="absolute"
                  top={3}
                  left={3}
                  bg="rgba(255,255,255,0.9)"
                  px={3}
                  py={1}
                  borderRadius="md"
                  backdropFilter="blur(4px)"
                >
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {formatPrice(publicacionSeleccionada.price || 0)}
                  </Text>
                </Box>

                {/* Estado superpuesto */}
                {publicacionSeleccionada.states?.nombre && (
                  <Box
                    position="absolute"
                    top={3}
                    right={3}
                  >
                    <Badge
                      colorScheme={getStateColor(publicacionSeleccionada.states.nombre)}
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant="solid"
                    >
                      {publicacionSeleccionada.states.nombre.toUpperCase()}
                    </Badge>
                  </Box>
                )}

                {/* Flechas de navegación */}
                {publicacionSeleccionada.images && publicacionSeleccionada.images.length > 1 && (
                  <>
                    {/* Flecha izquierda */}
                    <Button
                      aria-label="Imagen anterior"
                      position="absolute"
                      left={2}
                      top="50%"
                      transform="translateY(-50%)"
                      bg="rgba(0,0,0,0.5)"
                      color="white"
                      size="sm"
                      borderRadius="full"
                      _hover={{ bg: "rgba(0,0,0,0.7)" }}
                      onClick={prevImage}
                      p={2}
                      minW="auto"
                    >
                      <FiChevronLeft />
                    </Button>

                    {/* Flecha derecha */}
                    <Button
                      aria-label="Imagen siguiente"
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      bg="rgba(0,0,0,0.5)"
                      color="white"
                      size="sm"
                      borderRadius="full"
                      _hover={{ bg: "rgba(0,0,0,0.7)" }}
                      onClick={nextImage}
                      p={2}
                      minW="auto"
                    >
                      <FiChevronRight />
                    </Button>
                  </>
                )}

                {/* Indicadores de puntos */}
                {publicacionSeleccionada.images && publicacionSeleccionada.images.length > 1 && (
                  <HStack
                    position="absolute"
                    bottom={3}
                    left="50%"
                    transform="translateX(-50%)"
                    gap={1}
                  >
                    {publicacionSeleccionada.images.map((_, index) => (
                      <Box
                        key={index}
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={index === currentImageIndex ? "white" : "rgba(255,255,255,0.5)"}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ bg: "white" }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </HStack>
                )}
              </Box>

              {/* Título */}
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                {publicacionSeleccionada.titulo}
              </Text>

              {/* Ubicación */}
              {publicacionSeleccionada.location?.direccion && (
                <HStack gap={2} color="gray.600">
                  <FiMapPin />
                  <Text>{publicacionSeleccionada.location.direccion}</Text>
                </HStack>
              )}

              <Box h="1px" bg="gray.200" />

              {/* Información detallada */}
              <VStack align="stretch" gap={3}>
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  Información
                </Text>
                
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <FiUsers color="#4A5568" />
                    <Text fontSize="sm" color="gray.600">Capacidad</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">{publicacionSeleccionada.capacidad} personas</Text>
                </HStack>

                {publicacionSeleccionada.metros_cuadrados && (
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <FiMaximize2 color="#4A5568" />
                      <Text fontSize="sm" color="gray.600">Tamaño</Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium">{publicacionSeleccionada.metros_cuadrados}m²</Text>
                  </HStack>
                )}

                {publicacionSeleccionada.deposit_amount && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">Alquiler</Text>
                    <Text fontSize="sm" fontWeight="medium">{formatPrice(publicacionSeleccionada.deposit_amount)}</Text>
                  </HStack>
                )}
              </VStack>

              <Box h="1px" bg="gray.200" />

              {/* Amenities */}
              <VStack align="stretch" gap={3}>
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  Amenities
                </Text>
                
                <HStack gap={4} wrap="wrap">
                  <HStack gap={2}>
                    <FiWifi color="#4A5568" />
                    <Text fontSize="sm" color="gray.600">WiFi</Text>
                  </HStack>
                  <HStack gap={2}>
                    <FiTruck color="#4A5568" />
                    <Text fontSize="sm" color="gray.600">Estacionamiento</Text>
                  </HStack>
                  <HStack gap={2}>
                    <FiCalendar color="#4A5568" />
                    <Text fontSize="sm" color="gray.600">Flexible</Text>
                  </HStack>
                </HStack>
              </VStack>

            </VStack>
          ) : grupoSeleccionado ? (
            // Detalle de grupo
            <VStack align="stretch" gap={4}>
              <Text fontSize="md" color="gray.600">
                {grupoSeleccionado.length} ubicaciones en la misma zona
              </Text>
              
              <VStack align="stretch" gap={2}>
                {grupoSeleccionado.map((location, index) => (
                  <Box
                    key={location.id}
                    p={3}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <VStack align="stretch" gap={1}>
                      <HStack gap={2}>
                        <FiMapPin size={14} color="#4A5568" />
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Ubicación {index + 1}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.600">
                        {location.direccion}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </VStack>

              <Text fontSize="sm" color="gray.500" textAlign="center">
                Haz click en una publicación específica del sidebar para ver más detalles
              </Text>
            </VStack>
          ) : null}
      </Box>

      {/* Botones de acción - versión con debug */}
      {publicacionSeleccionada && (
        <Box p={4} borderTop="1px" borderColor="gray.200" bg="white">
          <VStack align="stretch" gap={2}>
            {/* Botón de debug - siempre visible para verificar condiciones */}
            <Button
              colorScheme="purple"
              size="md"
              w="full"
              variant="outline"
              onClick={() => {
                console.log('=== DEBUG BOTONES ===');
                console.log('User:', user);
                console.log('User ID:', user?.id);
                console.log('Publicación:', publicacionSeleccionada);
                console.log('Estado:', publicacionSeleccionada.states?.nombre);
                console.log('HasReservation:', userHasReservation);
                console.log('onReserve existe:', !!onReserve);
                console.log('onRent existe:', !!onRent);
                alert(`User: ${user ? 'Sí' : 'No'}\nEstado: ${publicacionSeleccionada.states?.nombre || 'N/A'}\nHasReservation: ${userHasReservation}`);
              }}
            >
              <Text>DEBUG - Ver info en consola</Text>
            </Button>

            {/* Botón de reserva - solo cuando está disponible */}
            {user && publicacionSeleccionada.states?.nombre === 'disponible' && (
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={() => onReserve?.(publicacionSeleccionada)}
              >
                <HStack gap={2}>
                  <Icon as={FiCalendar} />
                  <Text>Reservar Ahora</Text>
                </HStack>
              </Button>
            )}
            
            {/* Botón de alquilar - solo cuando está reservada por el usuario */}
            {user && publicacionSeleccionada.states?.nombre === 'reservada' && userHasReservation && (
              <Button
                colorScheme="green"
                size="lg"
                w="full"
                onClick={() => onRent?.(publicacionSeleccionada)}
              >
                <HStack gap={2}>
                  <Icon as={FiCheckCircle} />
                  <Text>Alquilar</Text>
                </HStack>
              </Button>
            )}

            {/* Mensaje si no hay usuario */}
            {!user && (
              <Text fontSize="sm" color="gray.500" textAlign="center" py={2}>
                Inicia sesión para reservar o alquilar
              </Text>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default DetailContainer;
