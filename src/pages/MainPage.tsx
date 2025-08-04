import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ContentArea from '../components/contentArea/ContentArea';
import { useAuth } from '../context/AuthContext';

// Definir el tipo de publicación
interface Publication {
  id: number;
  user_id: number;
  location_id: number;
  estado: string;
  titulo: string;
  descripcion: string;
  price: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen?: string;
}

// Definir el tipo de imagen
interface Image {
  id: number;
  publication_id: number;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  created_at: string;
}

const MainPage: React.FC = () => {
  const { userData } = useAuth();
  
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

  // Función para remarcar publicaciones en el sidebar
  const handleHighlightPublications = (publications: Publication[]) => {
    console.log('🎯 Publicaciones a remarcar en MainPage:', publications);
    setHighlightedPublications(publications);
  };

  // Nueva función para seleccionar publicación desde el mapa
  const handleSelectPublication = (publication: Publication) => {
    console.log('🗺️ Publicación seleccionada desde el mapa:', publication);
    
    // Verificar si el usuario es residencia y si la publicación le pertenece
    const isUserResidencia = userData?.user_type === 'residencia';
    const isOwnPublication = publication.user_id === userData?.id;
    
    // Activar modo de edición solo si es usuario residencia y la publicación es suya
    const shouldEditMode = isUserResidencia && isOwnPublication;
    
    setSelectedPublication(publication);
    setIsEditMode(shouldEditMode);
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
    // Limpiar selección y highlights al cambiar de modo
    setSelectedPublication(null);
    setHighlightedPublications([]);
    setIsEditMode(false);
    setEditingImages([]);
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
  const handleRemoveImage = (imageId: number) => {
    setEditingImages(prev => prev.filter(img => img.id !== imageId));
  };

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
        />
      </div>
    </div>
  );
};

export default MainPage; 