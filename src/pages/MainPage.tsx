import React, { useState, useEffect } from 'react';
import { PublicationsService } from '../services/publicationsService';
import { getLocations } from '../services/locationsService';
import { useAuth } from '../context/AuthContext';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import type { Tables } from '../types/database';
import Map from '../components/Map';

type Location = Tables<'locations'>;
type Publication = Tables<'publications'>;

const MainPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [myPublications, setMyPublications] = useState<Publication[]>([]);
  const [myRentals, setMyRentals] = useState<any[]>([]);

  // context - solo se ejecutan cuando cambian las dependencias
  const { user, userData } = useAuth();

  // Cargar locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (err) {
        console.error('Error al cargar locations:', err);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

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
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
      <div className="lg:col-span-1 bg-white">
        <Map />
      </div>
    </div>
  );
};

export default MainPage; 
