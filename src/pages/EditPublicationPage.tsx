import React, { useState, useEffect } from 'react';
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
  GridItem,
  Spinner,
  Center
} from '@chakra-ui/react';
import { FiX, FiUpload, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import AddressSearchBar from '../components/AddressSearchBar';
import LocationPicker from '../components/LocationPicker';
import { AdminService } from '../services/adminService';
import { supabase } from '../services/supabaseClient';
import type { Tables } from '../types/database';

const EditPublicationPage: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [publication, setPublication] = useState<Tables<'publications'> | null>(null);
  const [location, setLocation] = useState<Tables<'locations'> | null>(null);
  const [existingImages, setExistingImages] = useState<Tables<'images'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [price, setPrice] = useState(0);
  const [capacidad, setCapacidad] = useState(1);
  const [metros_cuadrados, setMetrosCuadrados] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [deposit_amount, setDepositAmount] = useState(0);
  const [min_stay_days, setMinStayDays] = useState(30);
  const [max_stay_days, setMaxStayDays] = useState(365);
  const [currency, setCurrency] = useState('ARS');
  
  // Estados para nuevas imágenes
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar publicación existente
  useEffect(() => {
    const loadPublication = async () => {
      if (!id || !userData?.user_id) return;

      try {
        const adminService = new AdminService();
        
        // Cargar publicación con sus relaciones usando el servicio
        const publicationData = await adminService.getPublicationById(id, userData.user_id);

        setPublication(publicationData);
        setLocation(publicationData.locations);
        setExistingImages(publicationData.images || []);

        // Llenar formulario con datos existentes
        setTitulo(publicationData.titulo || '');
        setDescripcion(publicationData.descripcion || '');
        setPrice(publicationData.price || 0);
        setCapacidad(publicationData.capacidad || 1);
        setMetrosCuadrados(publicationData.metros_cuadrados || 0);
        setDepositAmount(publicationData.deposit_amount || 0);
        setMinStayDays(publicationData.min_stay_days || 30);
        setMaxStayDays(publicationData.max_stay_days || 365);
        setCurrency(publicationData.currency || 'ARS');

        // Configurar ubicación
        if (publicationData.locations) {
          const loc = publicationData.locations;
          setSelectedLocation({
            lat: loc.latitud,
            lng: loc.longitud,
            address: loc.direccion || ''
          });
        }

      } catch (error) {
        console.error('Error al cargar publicación:', error);
        alert('Error al cargar la publicación');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    loadPublication();
  }, [id, userData?.user_id, navigate]);

  // Manejar selección de dirección
  const handleAddressSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
  };

  // Manejar selección de ubicación desde el mapa
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
  };

  // Manejar subida de nuevas imágenes
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
      const updatedNewImages = [...newImages, ...validFiles];
      setNewImages(updatedNewImages);

      // Crear previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  // Eliminar nueva imagen
  const removeNewImage = (index: number) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revocar URL del preview
    URL.revokeObjectURL(imagePreviews[index]);
    
    setNewImages(updatedNewImages);
    setImagePreviews(updatedPreviews);
  };

  // Eliminar imagen existente
  const removeExistingImage = (imageId: string) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
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

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!userData?.user_id || !id) {
      alert('No se pudo obtener la información del usuario');
      return;
    }

    // Prevenir múltiples envíos
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const adminService = new AdminService();

      // 1. Actualizar o crear la ubicación
      let locationId: string;
      if (selectedLocation) {
        if (location) {
          // Actualizar ubicación existente
          console.log('Actualizando ubicación existente:', location.id);
          const { data: updatedLocation, error: locationError } = await supabase
            .from('locations')
            .update({
              latitud: selectedLocation.lat,
              longitud: selectedLocation.lng,
              direccion: selectedLocation.address
            })
            .eq('id', location.id)
            .select('id');

          if (locationError) {
            console.error('Error al actualizar ubicación:', locationError);
            throw locationError;
          }

          if (!updatedLocation || updatedLocation.length === 0) {
            console.log('No se pudo actualizar la ubicación, creando nueva...');
            // Si no se puede actualizar, crear nueva ubicación
            const { data: newLocation, error: newLocationError } = await supabase
              .from('locations')
              .insert({
                latitud: selectedLocation.lat,
                longitud: selectedLocation.lng,
                direccion: selectedLocation.address
              })
              .select('id')
              .single();

            if (newLocationError) {
              throw newLocationError;
            }
            locationId = newLocation.id;
          } else {
            locationId = updatedLocation[0].id;
          }
        } else {
          // Crear nueva ubicación
          console.log('Creando nueva ubicación...');
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
            console.error('Error al crear nueva ubicación:', locationError);
            throw locationError;
          }
          locationId = newLocation.id;
        }
      } else {
        throw new Error('No se seleccionó una ubicación válida');
      }

      // 2. Actualizar la publicación
      const updateData = {
        titulo,
        descripcion,
        price,
        capacidad,
        metros_cuadrados,
        location_id: locationId,
        currency,
        deposit_amount: deposit_amount > 0 ? deposit_amount : null,
        min_stay_days: min_stay_days > 0 ? min_stay_days : null,
        max_stay_days: max_stay_days > 0 ? max_stay_days : null
      };

      console.log('Actualizando publicación con datos:', updateData);
      await adminService.updatePublication(id, updateData, userData.user_id);

      // 3. Eliminar imágenes marcadas para eliminación
      if (imagesToDelete.length > 0) {
        for (const imageId of imagesToDelete) {
          await adminService.deleteImage(imageId);
        }
      }

      // 4. Subir nuevas imágenes
      if (newImages.length > 0) {
        console.log('Subiendo nuevas imágenes:', newImages.length);
        await adminService.uploadMultipleImages(newImages, id);
      }

      alert('Publicación actualizada correctamente');
      navigate('/admin');
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
      alert('No se pudo actualizar la publicación');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Cargando publicación...</Text>
        </VStack>
      </Center>
    );
  }

  if (!publication) {
    return (
      <Center h="100vh">
        <VStack gap={4}>
          <Text>Publicación no encontrada</Text>
          <Button onClick={() => navigate('/admin')}>
            Volver al panel
          </Button>
        </VStack>
      </Center>
    );
  }

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
          <HStack gap={4}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              disabled={saving}
            >
              <HStack gap={2}>
                <Icon as={FiArrowLeft} />
                <Text>Volver</Text>
              </HStack>
            </Button>
            <VStack align="start" gap={0}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Editar Publicación
              </Text>
              <Text fontSize="sm" color="gray.600">
                Modifica los datos de tu residencia
              </Text>
            </VStack>
          </HStack>
          
          <Button
            type="submit"
            form="edit-publication-form"
            colorScheme="blue"
            size="sm"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </HStack>

        {/* Layout principal con mapa a la izquierda */}
        <Grid templateColumns="1fr 1fr" gap={6} h="full">
          {/* Columna izquierda - Mapa */}
          <GridItem>
            <VStack align="stretch" gap={4} h="full">
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Ubicación actual
              </Text>
              
              {/* Dirección */}
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">Buscar nueva dirección</Text>
                <AddressSearchBar
                  onLocationSelect={handleAddressSelect}
                  currentLocation={selectedLocation}
                  placeholder="Buscar nueva dirección..."
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
                        Ubicación actualizada
                      </Text>
                      <Text fontSize="xs" color="green.600" lineClamp={2}>
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
              id="edit-publication-form"
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
                    borderColor={errors.titulo ? "red.300" : undefined}
                    _focus={{
                      borderColor: errors.titulo ? "red.400" : undefined,
                      boxShadow: errors.titulo ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                    }}
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
                    borderColor={errors.descripcion ? "red.300" : undefined}
                    _focus={{
                      borderColor: errors.descripcion ? "red.400" : undefined,
                      boxShadow: errors.descripcion ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                    }}
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
                      borderColor={errors.price ? "red.300" : undefined}
                      _focus={{
                        borderColor: errors.price ? "red.400" : undefined,
                        boxShadow: errors.price ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                      }}
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
                      borderColor={errors.capacidad ? "red.300" : undefined}
                      _focus={{
                        borderColor: errors.capacidad ? "red.400" : undefined,
                        boxShadow: errors.capacidad ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                      }}
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
                      borderColor={errors.metros_cuadrados ? "red.300" : undefined}
                      _focus={{
                        borderColor: errors.metros_cuadrados ? "red.400" : undefined,
                        boxShadow: errors.metros_cuadrados ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                      }}
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
                      borderColor={errors.deposit_amount ? "red.300" : undefined}
                      _focus={{
                        borderColor: errors.deposit_amount ? "red.400" : undefined,
                        boxShadow: errors.deposit_amount ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                      }}
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
                      borderColor={errors.min_stay_days ? "red.300" : undefined}
                      _focus={{
                        borderColor: errors.min_stay_days ? "red.400" : undefined,
                        boxShadow: errors.min_stay_days ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                      }}
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
                      borderColor={errors.max_stay_days ? "red.300" : undefined}
                      _focus={{
                        borderColor: errors.max_stay_days ? "red.400" : undefined,
                        boxShadow: errors.max_stay_days ? "0 0 0 1px rgba(245, 101, 101, 0.3)" : undefined
                      }}
                      size="sm"
                    />
                    {errors.max_stay_days && (
                      <Text fontSize="xs" color="red.500">{errors.max_stay_days}</Text>
                    )}
                  </VStack>
                </Grid>

                {/* Gestión de imágenes */}
                <VStack align="start" gap={3}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">Imágenes</Text>
                  
                  {/* Imágenes existentes */}
                  {existingImages.length > 0 && (
                    <VStack align="start" gap={2} w="full">
                      <Text fontSize="xs" color="gray.600">Imágenes actuales:</Text>
                      <SimpleGrid columns={4} gap={2} w="full">
                        {existingImages.map((image) => (
                          <Box key={image.id} position="relative">
                            <Image
                              src={image.url_imagen}
                              alt="Imagen existente"
                              w="full"
                              h="60px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <IconButton
                              aria-label="Eliminar imagen"
                              size="xs"
                              colorScheme="red"
                              position="absolute"
                              top={0}
                              right={0}
                              onClick={() => removeExistingImage(image.id)}
                            >
                              <FiX />
                            </IconButton>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  )}

                  {/* Botón de subida para nuevas imágenes */}
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
                        Agregar nuevas imágenes
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

                  {/* Preview de nuevas imágenes */}
                  {imagePreviews.length > 0 && (
                    <VStack align="start" gap={2} w="full">
                      <Text fontSize="xs" color="gray.600">Nuevas imágenes:</Text>
                      <SimpleGrid columns={4} gap={2} w="full">
                        {imagePreviews.map((preview, index) => (
                          <Box key={index} position="relative">
                            <Image
                              src={preview}
                              alt={`Nueva imagen ${index + 1}`}
                              w="full"
                              h="60px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <IconButton
                              aria-label="Eliminar nueva imagen"
                              size="xs"
                              colorScheme="red"
                              position="absolute"
                              top={0}
                              right={0}
                              onClick={() => removeNewImage(index)}
                            >
                              <FiX />
                            </IconButton>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </VStack>
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

export default EditPublicationPage;
