import React, { useState, useEffect } from 'react';
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
  Center
} from '@chakra-ui/react';
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
              leftIcon={<Icon as={FiPlus} />}
              onClick={() => navigate('/admin/publications/new')}
              borderRadius="lg"
              px={8}
            >
              Nueva Publicación
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
                leftIcon={<Icon as={FiPlus} />}
                onClick={() => navigate('/admin/publications/new')}
                borderRadius="lg"
                px={8}
              >
                Crear tu primera publicación
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
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
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
                      icon={<FiEye />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      title="Ver detalles"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar vista de detalles
                      }}
                    />
                    <IconButton
                      aria-label="Editar"
                      icon={<FiEdit />}
                      size="sm"
                      variant="ghost"
                      colorScheme="green"
                      title="Editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/publications/${publication.id}/edit`);
                      }}
                    />
                    <IconButton
                      aria-label="Más opciones"
                      icon={<FiMoreVertical />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      title="Más opciones"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar menú de opciones
                      }}
                    />
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;