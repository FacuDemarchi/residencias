import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Icon,
  SimpleGrid,
  Image,
  IconButton,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FiPlus, FiX, FiUpload, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddressSearchBar from '../components/AddressSearchBar';
import LocationPicker from '../components/LocationPicker';
import { AdminService } from '../services/adminService';
import { supabase } from '../services/supabaseClient';
import type { Tables } from '../types/database';

const PublicationForm: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [price, setPrice] = useState(0);
  const [capacidad, setCapacidad] = useState(1);
  const [metros_cuadrados, setMetrosCuadrados] = useState(0);
  const [direccion, setDireccion] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(true);
  const [deposit_amount, setDepositAmount] = useState(0);
  const [min_stay_days, setMinStayDays] = useState(30);
  const [max_stay_days, setMaxStayDays] = useState(365);
  const [currency, setCurrency] = useState('ARS');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manejar selección de dirección
  const handleAddressSelect = (location: { lat: number; lng: number; address: string }) => {
    setDireccion(location.address);
    setSelectedLocation(location);
  };

  // Manejar selección de ubicación desde el mapa
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setDireccion(location.address);
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  // Manejar subida de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Las imágenes no pueden superar los 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      setImages(newImages);

      // Crear previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  // Eliminar imagen
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revocar URL del preview
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (capacidad <= 0) newErrors.capacidad = 'La capacidad debe ser mayor a 0';
    if (metros_cuadrados <= 0) newErrors.metros_cuadrados = 'Los metros cuadrados deben ser mayor a 0';
    if (!selectedLocation) newErrors.direccion = 'Debes seleccionar una dirección válida';
    if (deposit_amount < 0) newErrors.deposit_amount = 'El depósito no puede ser negativo';
    if (min_stay_days <= 0) newErrors.min_stay_days = 'La estadía mínima debe ser mayor a 0';
    if (max_stay_days <= 0) newErrors.max_stay_days = 'La estadía máxima debe ser mayor a 0';
    if (min_stay_days > max_stay_days) newErrors.max_stay_days = 'La estadía máxima debe ser mayor a la mínima';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!userData?.user_id) {
      alert('No se pudo obtener la información del usuario');
      return;
    }

    // Prevenir múltiples envíos
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const adminService = new AdminService();

      // 1. Crear o encontrar la ubicación
      let locationId: string;
      if (selectedLocation) {
        // Buscar si ya existe una ubicación con estas coordenadas
        const { data: existingLocation } = await supabase
          .from('locations')
          .select('id')
          .eq('latitud', selectedLocation.lat)
          .eq('longitud', selectedLocation.lng)
          .single();

        if (existingLocation) {
          locationId = existingLocation.id;
        } else {
          // Crear nueva ubicación
          const { data: newLocation, error: locationError } = await supabase
            .from('locations')
            .insert({
              latitud: selectedLocation.lat,
              longitud: selectedLocation.lng,
              direccion: selectedLocation.address
            })
            .select('id')
            .single();

          if (locationError) {
            throw locationError;
          }
          locationId = newLocation.id;
        }
      } else {
        throw new Error('No se seleccionó una ubicación válida');
      }

      // 2. Crear la publicación
      const publicationData = {
        titulo,
        descripcion,
        price,
        capacidad,
        metros_cuadrados,
        location_id: locationId,
        user_id: userData.user_id,
        is_active: true,
        currency,
        deposit_amount: deposit_amount > 0 ? deposit_amount : null,
        min_stay_days: min_stay_days > 0 ? min_stay_days : null,
        max_stay_days: max_stay_days > 0 ? max_stay_days : null
      };

      console.log('Creando publicación con datos:', publicationData);
      const publication = await adminService.createPublication(publicationData);
      console.log('Publicación creada:', publication);

      // 3. Subir imágenes si las hay
      if (images.length > 0) {
        console.log('Subiendo imágenes:', images.length);
        await adminService.uploadMultipleImages(images, publication.id);
        console.log('Imágenes subidas correctamente');
      }

      alert('Publicación creada correctamente');
      navigate('/admin');
    } catch (error) {
      console.error('Error al crear publicación:', error);
      alert('No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      p={4} 
      maxW="1400px" 
      mx="auto" 
      h="100vh"
      overflowY="auto"
    >
      <VStack align="stretch" gap={4} h="full">
        {/* Header compacto */}
        <HStack justify="space-between" align="center" py={2}>
          <VStack align="start" gap={0}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Nueva Publicación
            </Text>
            <Text fontSize="sm" color="gray.600">
              Crea una nueva residencia para alquilar
            </Text>
          </VStack>
          
          <HStack gap={2}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="publication-form"
              colorScheme="blue"
              size="sm"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Crear Publicación'}
            </Button>
          </HStack>
        </HStack>

        {/* Layout principal con mapa a la izquierda */}
        <Grid templateColumns="1fr 1fr" gap={6} h="full">
          {/* Columna izquierda - Mapa */}
          <GridItem>
            <VStack align="stretch" gap={4} h="full">
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Seleccionar ubicación
              </Text>
              
              {/* Dirección */}
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">Buscar dirección</Text>
                <AddressSearchBar
                  onLocationSelect={handleAddressSelect}
                  currentLocation={null}
                  placeholder="Buscar dirección..."
                  isInvalid={!!errors.direccion}
                />
                {errors.direccion && (
                  <Text fontSize="xs" color="red.500">{errors.direccion}</Text>
                )}
              </VStack>

              {/* Mapa */}
              <Box flex="1">
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={selectedLocation}
                  height="100%"
                  center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : null}
                />
              </Box>

              {/* Estado de ubicación */}
              {selectedLocation && (
                <Box bg="green.50" p={3} borderRadius="md" border="1px" borderColor="green.200">
                  <HStack gap={2}>
                    <Icon as={FiMapPin} color="green.500" />
                    <VStack align="start" gap={0}>
                      <Text fontSize="sm" fontWeight="medium" color="green.800">
                        Ubicación confirmada
                      </Text>
                      <Text fontSize="xs" color="green.600" noOfLines={2}>
                        {selectedLocation.address}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}
            </VStack>
          </GridItem>

          {/* Columna derecha - Formulario */}
          <GridItem>
            <Box
              as="form"
              id="publication-form"
              onSubmit={handleSubmit}
              bg="white"
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              h="full"
              overflowY="auto"
            >
              <VStack align="stretch" gap={4}>
                {/* Título y descripción */}
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">Título</Text>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Residencia moderna en el centro"
                    isInvalid={!!errors.titulo}
                    size="sm"
                  />
                  {errors.titulo && (
                    <Text fontSize="xs" color="red.500">{errors.titulo}</Text>
                  )}
                </VStack>

                <VStack align="start" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">Descripción</Text>
                  <Textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe tu residencia..."
                    rows={3}
                    isInvalid={!!errors.descripcion}
                    size="sm"
                  />
                  {errors.descripcion && (
                    <Text fontSize="xs" color="red.500">{errors.descripcion}</Text>
                  )}
                </VStack>

                {/* Precio, capacidad y área */}
                <Grid templateColumns="1fr 1fr 1fr" gap={3}>
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">Precio ($)</Text>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="0"
                      isInvalid={!!errors.price}
                      size="sm"
                    />
                    {errors.price && (
                      <Text fontSize="xs" color="red.500">{errors.price}</Text>
                    )}
                  </VStack>

                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">Capacidad</Text>
                    <Input
                      type="number"
                      value={capacidad}
                      onChange={(e) => setCapacidad(Number(e.target.value))}
                      placeholder="1"
                      isInvalid={!!errors.capacidad}
                      size="sm"
                    />
                    {errors.capacidad && (
                      <Text fontSize="xs" color="red.500">{errors.capacidad}</Text>
                    )}
                  </VStack>

                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">m²</Text>
                    <Input
                      type="number"
                      value={metros_cuadrados}
                      onChange={(e) => setMetrosCuadrados(Number(e.target.value))}
                      placeholder="0"
                      isInvalid={!!errors.metros_cuadrados}
                      size="sm"
                    />
                    {errors.metros_cuadrados && (
                      <Text fontSize="xs" color="red.500">{errors.metros_cuadrados}</Text>
                    )}
                  </VStack>
                </Grid>

                {/* Depósito y estadías */}
                <Grid templateColumns="1fr 1fr 1fr" gap={3}>
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">Depósito ($)</Text>
                    <Input
                      type="number"
                      value={deposit_amount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      placeholder="0"
                      isInvalid={!!errors.deposit_amount}
                      size="sm"
                    />
                    {errors.deposit_amount && (
                      <Text fontSize="xs" color="red.500">{errors.deposit_amount}</Text>
                    )}
                  </VStack>

                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">Mín. (días)</Text>
                    <Input
                      type="number"
                      value={min_stay_days}
                      onChange={(e) => setMinStayDays(Number(e.target.value))}
                      placeholder="30"
                      isInvalid={!!errors.min_stay_days}
                      size="sm"
                    />
                    {errors.min_stay_days && (
                      <Text fontSize="xs" color="red.500">{errors.min_stay_days}</Text>
                    )}
                  </VStack>

                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">Máx. (días)</Text>
                    <Input
                      type="number"
                      value={max_stay_days}
                      onChange={(e) => setMaxStayDays(Number(e.target.value))}
                      placeholder="365"
                      isInvalid={!!errors.max_stay_days}
                      size="sm"
                    />
                    {errors.max_stay_days && (
                      <Text fontSize="xs" color="red.500">{errors.max_stay_days}</Text>
                    )}
                  </VStack>
                </Grid>

                {/* Subida de imágenes */}
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">Imágenes</Text>
                  
                  {/* Botón de subida */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p={3}
                    border="2px"
                    borderStyle="dashed"
                    borderColor="gray.300"
                    borderRadius="md"
                    _hover={{ borderColor: "blue.400" }}
                    transition="border-color 0.2s"
                    w="full"
                  >
                    <VStack gap={1}>
                      <Icon as={FiUpload} boxSize={4} color="gray.400" />
                      <Text fontSize="xs" color="gray.600">
                        Subir imágenes
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Máx. 5MB por imagen
                      </Text>
                    </VStack>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </Box>

                  {/* Preview de imágenes */}
                  {imagePreviews.length > 0 && (
                    <SimpleGrid columns={4} gap={2} w="full">
                      {imagePreviews.map((preview, index) => (
                        <Box key={index} position="relative">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            w="full"
                            h="60px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <IconButton
                            aria-label="Eliminar imagen"
                            icon={<FiX />}
                            size="xs"
                            colorScheme="red"
                            position="absolute"
                            top={0}
                            right={0}
                            onClick={() => removeImage(index)}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                </VStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default PublicationForm;