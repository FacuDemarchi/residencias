import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  HStack, 
  Text, 
  IconButton,
  Spinner
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { PagoticService } from '../services/pagoticService';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;
type State = Tables<'states'>;
type StateHistory = Tables<'state_history'>;
type Rental = Tables<'rentals'>;

// Tipo para la consulta con joins
type PublicationWithState = Publication & {
  state_history: (StateHistory & {
    states: State;
  })[];
};

type CheckoutState = 
  | 'loading'
  | 'available'
  | 'reserved_by_user'
  | 'reserved_by_other'
  | 'subscribed'
  | 'not_available'
  | 'error';

const CheckoutPage: React.FC = () => {
  const [publication, setPublication] = useState<PublicationWithState | null>(null);
  const [userRental, setUserRental] = useState<Rental | null>(null);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('loading');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    currency: 'ARS',
    description: '',
    reference: '',
    returnUrl: '',
    cancelUrl: ''
  });
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'creating' | 'pending' | 'completed' | 'failed'>('idle');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Obtener ID de publicación desde URL
  const publicationId = searchParams.get('id');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (publicationId) {
      checkPublicationStatus(publicationId, user.id);
    }
  }, [publicationId, user, navigate]);

  // Función principal para verificar el estado de la publicación
  const checkPublicationStatus = async (pubId: string, userId: string) => {
    try {
      setCheckoutState('loading');

      // 1. Consulta a Supabase con joins
      const { data: publicationData, error: pubError } = await supabase
        .from('publications')
        .select(`
          *,
          state_history(
            *,
            states(*)
          )
        `)
        .eq('id', pubId)
        .single();

      if (pubError) {
        console.error('Error obteniendo publicación:', pubError);
        setCheckoutState('error');
        return;
      }

      setPublication(publicationData);

      // 2. Obtener el estado actual (el más reciente del historial)
      const currentState = publicationData.state_history
        ?.sort((a: any, b: any) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0]
        ?.states;

      if (!currentState) {
        setCheckoutState('error');
        return;
      }

      // 3. Verificar si el usuario tiene algún rental para esta publicación
      const { data: rentalData, error: rentalError } = await supabase
        .from('rentals')
        .select('*')
        .eq('publication_id', pubId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (rentalError && rentalError.code !== 'PGRST116') {
        console.error('Error obteniendo rental:', rentalError);
        setCheckoutState('error');
        return;
      }

      setUserRental(rentalData);

      // 4. Determinar el estado del checkout basado en el estado de la publicación
      const stateName = currentState.nombre;

      switch (stateName) {
        case 'disponible':
          setCheckoutState('available');
          break;

        case 'reservada':
          if (rentalData && !rentalData.contrato_aceptado) {
            setCheckoutState('reserved_by_user');
          } else {
            setCheckoutState('reserved_by_other');
          }
          break;

        case 'alquilada':
          if (rentalData && rentalData.contrato_aceptado) {
            setCheckoutState('subscribed');
          } else {
            setCheckoutState('not_available');
          }
          break;

        default:
          setCheckoutState('not_available');
          break;
      }

    } catch (error) {
      console.error('Error verificando estado:', error);
      setCheckoutState('error');
    }
  };

  // Función para crear pago usando el servicio
  const createPayment = async () => {
    if (!publication || !user) return;

    setPaymentStatus('creating');
    
    try {
      const result = await PagoticService.createPayment({
        publication_id: publication.id,
        user_id: user.id,
        amount: publication.price || 0,
        currency: publication.currency || 'ARS',
        description: `Reserva - ${publication.titulo}`,
        return_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`
      });

      if (result.success && result.payment_url) {
        setCurrentTransaction(result);
        setPaymentStatus('pending');
        return result.payment_url;
      } else {
        console.error('Error creando pago:', result.error);
        setPaymentStatus('failed');
        return null;
      }
    } catch (error) {
      console.error('Error creando pago:', error);
      setPaymentStatus('failed');
      return null;
    }
  };

  // Función para verificar estado del pago
  const checkPaymentStatus = async () => {
    if (!currentTransaction?.transaction_db_id) return;

    try {
      const status = await PagoticService.getTransactionStatus(currentTransaction.transaction_db_id);
      if (status) {
        if (status.status === 'completed') {
          setPaymentStatus('completed');
          // Redirigir a página de éxito
          navigate('/checkout/success');
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          setPaymentStatus('failed');
        }
      }
    } catch (error) {
      console.error('Error verificando estado del pago:', error);
    }
  };

  // Crear pago automáticamente cuando se carga la publicación
  useEffect(() => {
    if (publication && (checkoutState === 'available' || checkoutState === 'reserved_by_user')) {
      createPayment();
    }
  }, [publication, checkoutState]);

  // Polling para verificar estado del pago
  useEffect(() => {
    if (paymentStatus === 'pending' && currentTransaction?.transaction_db_id) {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000); // Verificar cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [paymentStatus, currentTransaction]);

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    console.error('Error al cargar el formulario');
    alert('Error al cargar el formulario');
  };

  // Escuchar mensajes del iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://api.pagotic.com') {
        return;
      }

      const data = event.data;
      
      if (data.type === 'payment_success') {
        console.log('Pago exitoso: Tu reserva ha sido confirmada');
        alert('Pago exitoso! Tu reserva ha sido confirmada');
        navigate('/');
      } else if (data.type === 'cancellation_success') {
        console.log('Cancelación exitosa: Tu suscripción ha sido cancelada');
        alert('Cancelación exitosa! Tu suscripción ha sido cancelada');
        navigate('/');
      } else if (data.type === 'payment_error' || data.type === 'cancellation_error') {
        console.error('Error:', data.message || 'Hubo un problema');
        alert('Error: ' + (data.message || 'Hubo un problema'));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Renderizado condicional según el estado
  const renderContent = () => {
    if (!publication) {
      return (
        <Box p={8} textAlign="center">
          <Spinner size="lg" />
          <Text mt={4}>Cargando información de la residencia...</Text>
        </Box>
      );
    }

    if (checkoutState === 'loading') {
      return (
        <Box p={8} textAlign="center">
          <Spinner size="lg" />
          <Text mt={4}>Verificando estado de la publicación...</Text>
        </Box>
      );
    }

    if (checkoutState === 'error') {
      return (
        <Box p={8} textAlign="center">
          <Text color="red.500" fontSize="lg">Error al cargar la información</Text>
          <Text mt={2} color="gray.600">Por favor, intenta nuevamente</Text>
        </Box>
      );
    }

    if (checkoutState === 'reserved_by_other') {
      return (
        <Box p={8} textAlign="center">
          <Text color="orange.500" fontSize="lg">Esta residencia ya está reservada</Text>
          <Text mt={2} color="gray.600">Por otro usuario</Text>
        </Box>
      );
    }

    if (checkoutState === 'not_available') {
      return (
        <Box p={8} textAlign="center">
          <Text color="red.500" fontSize="lg">Esta residencia no está disponible</Text>
          <Text mt={2} color="gray.600">En este momento</Text>
        </Box>
      );
    }

    // Estados que permiten acción (available, reserved_by_user, subscribed)
    const isSubscribed = checkoutState === 'subscribed';
    const iframeUrl = currentTransaction?.payment_url || '';

    return (
      <Box minH="100vh" bg="gray.50" p={4}>
        <Box maxW="6xl" mx="auto">
          {/* Header */}
          <HStack justify="space-between" mb={6}>
            <IconButton
              aria-label="Volver"
              onClick={() => navigate('/')}
              variant="ghost"
            >
              <span>←</span>
            </IconButton>
            <Text fontSize="2xl" fontWeight="bold">
              {isSubscribed ? 'Cancelar Suscripción' : 
               checkoutState === 'reserved_by_user' ? 'Completar Reserva' : 'Checkout'} - Pago TIC
            </Text>
            <Box w="40px" />
          </HStack>

          <Flex gap={6} direction={{ base: 'column', lg: 'row' }}>
            {/* Resumen */}
            <Box flex="1" bg="white" p={6} borderRadius="lg" shadow="sm" h="fit-content">
              <VStack gap={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">
                  {isSubscribed ? 'Resumen de la suscripción' : 
                   checkoutState === 'reserved_by_user' ? 'Resumen de la reserva' : 'Resumen de la reserva'}
                </Text>
                
                <Box>
                  <Text fontWeight="bold">{publication.titulo}</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {publication.descripcion}
                  </Text>
                </Box>

                <Box h="1px" bg="gray.200" w="full" />

                {isSubscribed ? (
                  // Información de suscripción activa
                  <VStack gap={2} align="stretch">
                    <HStack justify="space-between">
                      <Text>Estado actual:</Text>
                      <Box 
                        bg="green.100" 
                        color="green.800" 
                        px={2} 
                        py={1} 
                        borderRadius="md" 
                        fontSize="xs" 
                        fontWeight="bold"
                      >
                        Suscrito
                      </Box>
                    </HStack>
                    
                    <HStack justify="space-between">
                      <Text>Fecha de inicio:</Text>
                      <Text fontWeight="bold">{userRental?.fecha_inicio}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text>Fecha de fin:</Text>
                      <Text fontWeight="bold">{userRental?.fecha_fin}</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text>Monto mensual:</Text>
                      <Text fontWeight="bold">${publication.price?.toLocaleString()}</Text>
                    </HStack>

                    <Box h="1px" bg="gray.200" w="full" />

                    <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                      <Text>Monto a cancelar:</Text>
                      <Text color="red.600">${userRental?.monto_total?.toLocaleString()}</Text>
                    </HStack>
                  </VStack>
                ) : (
                  // Información de nueva reserva
                  <VStack gap={2} align="stretch">
                    <HStack justify="space-between">
                      <Text>Precio por mes:</Text>
                      <Text fontWeight="bold">${publication.price?.toLocaleString()}</Text>
                    </HStack>
                    
                    <HStack justify="space-between">
                      <Text>Duración:</Text>
                      <Box 
                        bg="blue.100" 
                        color="blue.800" 
                        px={2} 
                        py={1} 
                        borderRadius="md" 
                        fontSize="xs" 
                        fontWeight="bold"
                      >
                        1 mes
                      </Box>
                    </HStack>

                    <Box h="1px" bg="gray.200" w="full" />

                    <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                      <Text>Total:</Text>
                      <Text>${publication.price?.toLocaleString()}</Text>
                    </HStack>
                  </VStack>
                )}

                <Box 
                  bg={isSubscribed ? "orange.50" : "blue.50"} 
                  border="1px solid" 
                  borderColor={isSubscribed ? "orange.200" : "blue.200"} 
                  borderRadius="md" 
                  p={3}
                >
                  <HStack gap={2}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" color={isSubscribed ? "orange.500" : "blue.500"}>
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm0-5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z"/>
                    </svg>
                    <Text fontSize="sm" color={isSubscribed ? "orange.700" : "blue.700"}>
                      {isSubscribed 
                        ? "Procesa la cancelación temprana de tu suscripción usando Pago TIC"
                        : "Completa el pago de forma segura usando el formulario de Pago TIC"
                      }
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            {/* Iframe de Pago TIC */}
            <Box flex="2" bg="white" p={6} borderRadius="lg" shadow="sm">
              <VStack gap={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">
                  {isSubscribed ? 'Cancelar suscripción' : 'Completar pago'}
                </Text>
                
                {(iframeLoading || paymentStatus === 'creating') && (
                  <Box textAlign="center" py={8}>
                    <Spinner size="lg" />
                    <Text mt={4}>
                      {paymentStatus === 'creating' ? 'Creando pago...' : 
                       isSubscribed ? 'Cargando formulario de cancelación...' : 
                       'Cargando formulario de pago...'}
                    </Text>
                  </Box>
                )}

                {paymentStatus === 'failed' && (
                  <Box 
                    bg="red.50" 
                    border="1px solid" 
                    borderColor="red.200" 
                    borderRadius="md" 
                    p={3}
                  >
                    <HStack gap={2}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" color="red.500">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 4a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V4zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                      </svg>
                      <Text color="red.700">Error al crear el pago. Por favor, intenta nuevamente.</Text>
                    </HStack>
                  </Box>
                )}

                {iframeUrl ? (
                  <Box 
                    position="relative" 
                    minH="600px" 
                    borderRadius="md" 
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <iframe
                      ref={iframeRef}
                      src={iframeUrl}
                      width="100%"
                      height="600px"
                      frameBorder="0"
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      style={{
                        display: iframeLoading ? 'none' : 'block'
                      }}
                      title={isSubscribed ? "Formulario de cancelación Pago TIC" : "Formulario de pago Pago TIC"}
                    />
                  </Box>
                ) : (
                  <Box 
                    bg="red.50" 
                    border="1px solid" 
                    borderColor="red.200" 
                    borderRadius="md" 
                    p={3}
                  >
                    <HStack gap={2}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" color="red.500">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 4a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V4zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                      </svg>
                      <Text color="red.700">Error al generar la URL</Text>
                    </HStack>
                  </Box>
                )}

                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Powered by Pago TIC - Pagos seguros y confiables
                </Text>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Box>
    );
  };

  return renderContent();
};

export default CheckoutPage;