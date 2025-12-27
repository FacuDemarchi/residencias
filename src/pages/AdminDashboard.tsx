import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button,
  Icon,
  Badge,
  IconButton,
  Spinner,
  Center,
  useDisclosure,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogCloseTrigger,
  DialogBody,
  DialogPositioner,
  Separator,
  Image,
} from '@chakra-ui/react';
import { createToaster, Toaster as ArkToaster } from '@ark-ui/react/toast';
import { 
  FiPlus, 
  FiEdit, 
  FiEye, 
  FiDollarSign, 
  FiUsers, 
  FiHome,
  FiCalendar,
  FiMoreVertical
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AdminService } from '../services/adminService';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;

const AdminDashboard: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [myPublications, setMyPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<any | null>(null);
  const detailsDisclosure = useDisclosure();
  const toaster = useMemo(() => createToaster({ placement: 'top-end' }), []);

  // Cargar publicaciones del usuario
  useEffect(() => {
    const loadMyPublications = async () => {
      if (!userData?.user_id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Cargando publicaciones para usuario:', userData.user_id);
        const adminService = new AdminService();
        const publications = await adminService.getMyPublications(userData.user_id);
        console.log('Publicaciones cargadas:', publications);
        setMyPublications(publications);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        setLoading(false);
      }
    };

    loadMyPublications();
  }, [userData]);

  const formatPrice = (price: number | null) => {
    if (!price) return 'No definido';
    return `$${price.toLocaleString('es-AR')}/mes`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const handleShowDetails = (publication: any) => {
    setSelectedPublication(publication);
    detailsDisclosure.onOpen();
  };
  
  const handleToggleActive = async (publication: Publication) => {
    try {
      const adminService = new AdminService();
      const updated = await adminService.togglePublicationStatus(publication.id, !publication.is_active);
      setMyPublications(prev => prev.map(p => p.id === updated.id ? { ...p, is_active: updated.is_active } : p));
      toaster.create({
        type: updated.is_active ? 'success' : 'info',
        title: updated.is_active ? 'Publicación activada' : 'Publicación desactivada'
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        type: 'error',
        title: 'Error al cambiar estado'
      });
    }
  };
  
  const handleDeletePublication = async (publication: Publication) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta publicación?');
    if (!confirmed) return;
    try {
      const adminService = new AdminService();
      await adminService.deletePublication(publication.id);
      setMyPublications(prev => prev.filter(p => p.id !== publication.id));
      toaster.create({
        type: 'success',
        title: 'Publicación eliminada'
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        type: 'error',
        title: 'Error al eliminar publicación'
      });
    }
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Center h="200px">
          <VStack gap={4}>
            <Spinner size="lg" color="blue.500" />
            <Text color="gray.600">Cargando publicaciones...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box 
      p={8} 
      maxW="1400px" 
      mx="auto" 
      minH="100vh"
      overflowY="auto"
      bg="gray.50"
    >
      <ArkToaster toaster={toaster}>
        {(t) => (
          <Box bg="gray.800" color="white" px={3} py={2} borderRadius="md">
            <Text fontWeight="bold">{t.title}</Text>
          </Box>
        )}
      </ArkToaster>
      <VStack align="stretch" gap={8}>
        {/* Header */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                Panel de Administración
              </Text>
              <Text color="gray.600" fontSize="lg">
                Gestiona tus publicaciones y reservas
              </Text>
            </VStack>
            
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/admin/publications/new')}
              borderRadius="lg"
              px={8}
            >
              <HStack gap={2}>
                <Icon as={FiPlus} />
                <Text>Nueva Publicación</Text>
              </HStack>
            </Button>
          </HStack>
        </Box>

        {/* Estadísticas rápidas */}
        <HStack gap={6} justify="center">
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" textAlign="center" minW="150px">
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {myPublications.length}
            </Text>
            <Text color="gray.600" fontSize="sm">
              Total Publicaciones
            </Text>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" textAlign="center" minW="150px">
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {myPublications.filter(p => p.is_active).length}
            </Text>
            <Text color="gray.600" fontSize="sm">
              Activas
            </Text>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" textAlign="center" minW="150px">
            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
              {myPublications.reduce((sum, p) => sum + (p.capacidad || 0), 0)}
            </Text>
            <Text color="gray.600" fontSize="sm">
              Capacidad Total
            </Text>
          </Box>
        </HStack>

        {/* Lista de publicaciones */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
          <Box p={6} borderBottom="1px" borderColor="gray.100">
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="semibold" color="gray.800">
                Mis Publicaciones
              </Text>
              <Text fontSize="sm" color="gray.500">
                {myPublications.length} publicación{myPublications.length !== 1 ? 'es' : ''}
              </Text>
            </HStack>
          </Box>
          
          {myPublications.length === 0 ? (
            <Box textAlign="center" py={16}>
              <Icon as={FiHome} boxSize={20} color="gray.300" mb={6} />
              <Text fontSize="xl" color="gray.600" mb={4} fontWeight="medium">
                No tienes publicaciones aún
              </Text>
              <Text color="gray.500" mb={8} maxW="400px" mx="auto">
                Crea tu primera publicación para comenzar a gestionar tu residencia
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate('/admin/publications/new')}
                borderRadius="lg"
                px={8}
              >
                <HStack gap={2}>
                  <Icon as={FiPlus} />
                  <Text>Crear tu primera publicación</Text>
                </HStack>
              </Button>
            </Box>
          ) : (
            <VStack align="stretch" gap={0}>
              {/* Encabezado de la tabla */}
              <Box 
                bg="gray.50" 
                p={4} 
                borderBottom="1px" 
                borderColor="gray.200"
                display="grid"
                gridTemplateColumns="2fr 1fr 1fr 1fr 1fr 1fr 120px"
                gap={4}
                alignItems="center"
              >
                <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                  Título
                </Text>
                <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                  Precio
                </Text>
                <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                  Capacidad
                </Text>
                <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                  Área
                </Text>
                <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                  Estado
                </Text>
                <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                  Creada
                </Text>
                <Text color="gray.600" fontWeight="semibold" fontSize="sm" textAlign="center">
                  Acciones
                </Text>
              </Box>

              {/* Filas de publicaciones */}
              {myPublications.map((publication, index) => (
                <Box
                  key={publication.id}
                  p={4}
                  borderBottom={index < myPublications.length - 1 ? "1px" : "none"}
                  borderColor="gray.200"
                  _hover={{ bg: 'gray.50' }}
                  cursor="pointer"
                  onClick={() => navigate(`/admin/publications/${publication.id}/edit`)}
                  display="grid"
                  gridTemplateColumns="2fr 1fr 1fr 1fr 1fr 1fr 120px"
                  gap={4}
                  alignItems="center"
                >
                  {/* Título */}
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800" fontSize="md">
                      {publication.titulo}
                    </Text>
                    {publication.descripcion && (
                      <Text fontSize="sm" color="gray.500" lineClamp={1}>
                        {publication.descripcion}
                      </Text>
                    )}
                  </VStack>

                  {/* Precio */}
                  <HStack gap={1}>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Text fontWeight="medium" color="gray.700" fontSize="sm">
                      {formatPrice(publication.price)}
                    </Text>
                  </HStack>

                  {/* Capacidad */}
                  <HStack gap={1}>
                    <Icon as={FiUsers} color="blue.500" />
                    <Text color="gray.700" fontSize="sm">
                      {publication.capacidad} persona{publication.capacidad !== 1 ? 's' : ''}
                    </Text>
                  </HStack>

                  {/* Área */}
                  <HStack gap={1}>
                    <Icon as={FiHome} color="orange.500" />
                    <Text color="gray.700" fontSize="sm">
                      {publication.metros_cuadrados ? `${publication.metros_cuadrados} m²` : 'No definido'}
                    </Text>
                  </HStack>

                  {/* Estado */}
                  <Badge
                    colorScheme={publication.is_active ? 'green' : 'gray'}
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                  >
                    {publication.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>

                  {/* Fecha */}
                  <HStack gap={1}>
                    <Icon as={FiCalendar} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(publication.created_at)}
                    </Text>
                  </HStack>

                  {/* Acciones */}
                  <HStack gap={1} justify="center">
                    <IconButton
                      aria-label="Ver detalles"
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      title="Ver detalles"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(publication as any);
                      }}
                    >
                      <FiEye />
                    </IconButton>
                    <IconButton
                      aria-label="Editar"
                      size="sm"
                      variant="ghost"
                      colorScheme="green"
                      title="Editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/publications/${publication.id}/edit`);
                      }}
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton
                      aria-label="Activar/Desactivar"
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      title={publication.is_active ? 'Desactivar' : 'Activar'}
                      onClick={(e: any) => { e.stopPropagation(); handleToggleActive(publication); }}
                    >
                      <FiMoreVertical />
                    </IconButton>
                    <IconButton
                      aria-label="Eliminar"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      title="Eliminar"
                      onClick={(e: any) => { e.stopPropagation(); handleDeletePublication(publication); }}
                    >
                      <span>✖</span>
                    </IconButton>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
        
        {/* Modal de detalles */}
        <DialogRoot open={detailsDisclosure.open} onOpenChange={(e: any) => { if (!e.open) detailsDisclosure.onClose(); }}>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
              <HStack justify="space-between">
                <Text>{selectedPublication?.titulo}</Text>
                {selectedPublication && (
                  <Badge
                    colorScheme={selectedPublication.is_active ? 'green' : 'gray'}
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {selectedPublication.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                )}
              </HStack>
              </DialogHeader>
              <DialogCloseTrigger />
              <DialogBody>
              <VStack align="stretch" gap={4}>
                <HStack gap={6}>
                  <HStack gap={2}>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Text fontWeight="medium">{formatPrice(selectedPublication?.price ?? null)}</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Icon as={FiUsers} color="blue.500" />
                    <Text>{selectedPublication?.capacidad} persona{selectedPublication?.capacidad !== 1 ? 's' : ''}</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Icon as={FiHome} color="orange.500" />
                    <Text>{selectedPublication?.metros_cuadrados ? `${selectedPublication?.metros_cuadrados} m²` : 'No definido'}</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Icon as={FiCalendar} color="gray.500" />
                    <Text>{formatDate(selectedPublication?.created_at ?? null)}</Text>
                  </HStack>
                </HStack>
                
                <Separator />
                
                {selectedPublication?.descripcion && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Descripción</Text>
                    <Text color="gray.700">{selectedPublication.descripcion}</Text>
                  </Box>
                )}
                
                {(selectedPublication?.locations?.direccion || selectedPublication?.locations) && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Ubicación</Text>
                    <Text color="gray.700">
                      {selectedPublication?.locations?.direccion ?? 'Ubicación disponible'}
                    </Text>
                  </Box>
                )}
                
                {Array.isArray(selectedPublication?.images) && selectedPublication.images.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={3}>Imágenes</Text>
                    <HStack wrap="wrap" gap={3}>
                      {selectedPublication.images.map((img: any) => (
                        <Image
                          key={img.id}
                          src={img.url_imagen}
                          alt="Imagen de la publicación"
                          borderRadius="md"
                          objectFit="cover"
                          w="120px"
                          h="90px"
                          bg="gray.100"
                        />
                      ))}
                    </HStack>
                  </Box>
                )}
              </VStack>
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
