import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Grid, 
  GridItem,
  Card,
  CardBody,
  Badge,
  Icon
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiEye, FiDollarSign, FiUsers, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;

const AdminDashboard: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [myPublications, setMyPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPublications: 0,
    activePublications: 0,
    totalRevenue: 0,
    totalCapacity: 0
  });

  const cardBg = 'white';
  const borderColor = 'gray.200';

  // Verificar que sea una residencia (ya validado por ProtectedRoute)
  useEffect(() => {
    if (userData && userData.user_type !== 'residencia') {
      navigate('/');
    }
  }, [userData, navigate]);

  // Cargar publicaciones del usuario
  useEffect(() => {
    const loadMyPublications = async () => {
      if (!userData?.user_id) return;
      
      try {
        // TODO: Implementar getMyPublications en adminService
        // const publications = await AdminService.getMyPublications(userData.user_id);
        // setMyPublications(publications);
        
        // Calcular estadísticas
        const totalPublications = myPublications.length;
        const activePublications = myPublications.filter(pub => pub.is_active).length;
        const totalRevenue = myPublications.reduce((sum, pub) => sum + (pub.price || 0), 0);
        const totalCapacity = myPublications.reduce((sum, pub) => sum + (pub.capacidad || 0), 0);
        
        setStats({
          totalPublications,
          activePublications,
          totalRevenue,
          totalCapacity
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        setLoading(false);
      }
    };

    loadMyPublications();
  }, [userData, myPublications]);

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Cargando dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      {/* Header */}
      <VStack align="stretch" gap={6}>
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Panel de Administración
            </Text>
            <Text color="gray.600">
              Gestiona tus publicaciones y reservas
            </Text>
          </VStack>
          
          <Button
            colorScheme="blue"
            leftIcon={<Icon as={FiPlus} />}
            onClick={() => navigate('/admin/publications/new')}
          >
            Nueva Publicación
          </Button>
        </HStack>

        {/* Estadísticas */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <GridItem>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color="gray.600">Total Publicaciones</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">{stats.totalPublications}</Text>
                  <Badge colorScheme="green" variant="subtle">
                    {stats.activePublications} activas
                  </Badge>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color="gray.600">Capacidad Total</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">{stats.totalCapacity}</Text>
                  <Text fontSize="xs" color="gray.500">personas</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color="gray.600">Ingresos Mensuales</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    ${stats.totalRevenue.toLocaleString('es-AR')}
                  </Text>
                  <Text fontSize="xs" color="gray.500">estimado</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color="gray.600">Reservas Activas</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">0</Text>
                  <Text fontSize="xs" color="gray.500">este mes</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Acciones rápidas */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="stretch" gap={4}>
              <Text fontSize="lg" fontWeight="semibold">
                Acciones Rápidas
              </Text>
              
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <Button
                  variant="outline"
                  leftIcon={<Icon as={FiPlus} />}
                  onClick={() => navigate('/admin/publications/new')}
                  h="60px"
                >
                  <VStack gap={1}>
                    <Text fontWeight="semibold">Nueva Publicación</Text>
                    <Text fontSize="sm" color="gray.600">
                      Crear una nueva residencia
                    </Text>
                  </VStack>
                </Button>
                
                <Button
                  variant="outline"
                  leftIcon={<Icon as={FiEdit} />}
                  onClick={() => navigate('/admin/publications')}
                  h="60px"
                >
                  <VStack gap={1}>
                    <Text fontWeight="semibold">Gestionar Publicaciones</Text>
                    <Text fontSize="sm" color="gray.600">
                      Ver y editar todas
                    </Text>
                  </VStack>
                </Button>
                
                <Button
                  variant="outline"
                  leftIcon={<Icon as={FiEye} />}
                  onClick={() => navigate('/admin/reservations')}
                  h="60px"
                >
                  <VStack gap={1}>
                    <Text fontWeight="semibold">Ver Reservas</Text>
                    <Text fontSize="sm" color="gray.600">
                      Gestionar alquileres
                    </Text>
                  </VStack>
                </Button>
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        {/* Publicaciones recientes */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="stretch" gap={4}>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  Publicaciones Recientes
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/publications')}
                >
                  Ver todas
                </Button>
              </HStack>
              
              {myPublications.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Icon as={FiHome} boxSize={12} color="gray.400" mb={4} />
                  <Text color="gray.600" mb={4}>
                    No tienes publicaciones aún
                  </Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate('/admin/publications/new')}
                  >
                    Crear tu primera publicación
                  </Button>
                </Box>
              ) : (
                <VStack align="stretch" gap={2}>
                  {myPublications.slice(0, 5).map((publication) => (
                    <HStack
                      key={publication.id}
                      p={3}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                      _hover={{ bg: 'gray.50' }}
                      cursor="pointer"
                      onClick={() => navigate(`/admin/publications/edit/${publication.id}`)}
                    >
                      <VStack align="start" flex="1" gap={1}>
                        <Text fontWeight="semibold">{publication.titulo}</Text>
                        <HStack gap={4} fontSize="sm" color="gray.600">
                          <HStack gap={1}>
                            <Icon as={FiDollarSign} />
                            <Text>${publication.price?.toLocaleString('es-AR')}</Text>
                          </HStack>
                          <HStack gap={1}>
                            <Icon as={FiUsers} />
                            <Text>{publication.capacidad} personas</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                      
                      <Badge
                        colorScheme={publication.is_active ? 'green' : 'gray'}
                        variant="subtle"
                      >
                        {publication.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
