//src/hooks/useLocation.ts 
/*
import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { WorkerProfile } from '@/types/worker';
import { CountryInfo } from '@/types/config';
import { useToast } from './use-toast';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const detectUserLocation = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);
          
          // Attempt to detect country from coordinates
          const country = await detectCountry(coords); // PASS coords as parameter
          if (country) {
            setDetectedCountry(country);
            toast({
              title: "Location Detected",
              description: `Your location has been set to ${country.name}`,
            });
          }
        } catch (err) {
          console.log('Geolocation error:', err);
          setError('Unable to detect location. Showing workers from all countries.');
          toast({
            title: "Location Detection Failed",
            description: "Unable to detect your location. Showing workers from all countries.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setError('Geolocation is not supported by your browser. Showing workers from all countries.');
        setLoading(false);
      }
    };

    detectUserLocation();
  }, [toast]);

  const calculateDistance = (workerLocation?: { latitude: number; longitude: number }) => {
    if (!userLocation || !workerLocation) return null;

    const from = turf.point(userLocation);
    const to = turf.point([workerLocation.longitude, workerLocation.latitude]);
    const distance = turf.distance(from, to, { units: 'miles' });
    
    return Math.round(distance * 10) / 10;
  };

  const filterWorkersByDistance = (workers: WorkerProfile[], maxDistance: number) => {
    if (!userLocation) return workers;

    return workers.filter((worker) => {
      const distance = calculateDistance(worker.location);
      return distance !== null && distance <= maxDistance;
    });
  };

  // FIX: Accept coordinates as parameter instead of using userLocation state
  const detectCountry = async (coords: [number, number]): Promise<CountryInfo | null> => {
    try {
      // For now, return a default country (US) to avoid API errors
      // You can enable the real API call later when you have an API key
      
      console.log('📍 Coordinates for country detection:', coords);
      
      // Default to US for testing
      return {
        code: 'US',
        name: 'United States'
      };
      
      
    } catch (error) {
      console.error('Error detecting country:', error);
      return null;
    }
  };

  return {
    userLocation,
    detectedCountry,
    loading,
    error,
    calculateDistance,
    filterWorkersByDistance,
    detectCountry
  };
};
*/

//src/hooks/useLocation.ts 
import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { WorkerProfile } from '@/types/worker';
import { CountryInfo } from '@/types/config';
import { useToast } from './use-toast';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user has already manually selected a country
  const hasUserSelectedCountry = () => {
    return localStorage.getItem('userPreferredCountry') !== null;
  };

  useEffect(() => {
    const detectUserLocation = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);
          
          // Attempt to detect country from coordinates
          const country = await detectCountry(coords);
          if (country) {
            setDetectedCountry(country);
            
            // 🔴 Only show toast if user hasn't manually selected a country before
            if (!hasUserSelectedCountry()) {
              toast({
                title: "Location Detected",
                description: `Your location has been set to ${country.name}`,
              });
            }
          }
        } catch (err) {
          console.log('Geolocation error:', err);
          setError('Unable to detect location. Showing workers from all countries.');
          
          // Only show error toast if user hasn't manually selected a country
          if (!hasUserSelectedCountry()) {
            toast({
              title: "Location Detection Failed",
              description: "Unable to detect your location. Showing workers from all countries.",
              variant: "destructive",
            });
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError('Geolocation is not supported by your browser. Showing workers from all countries.');
        setLoading(false);
      }
    };

    detectUserLocation();
  }, [toast]);

  const calculateDistance = (workerLocation?: { latitude: number; longitude: number }) => {
    if (!userLocation || !workerLocation) return null;

    const from = turf.point(userLocation);
    const to = turf.point([workerLocation.longitude, workerLocation.latitude]);
    const distance = turf.distance(from, to, { units: 'miles' });
    
    return Math.round(distance * 10) / 10;
  };

  const filterWorkersByDistance = (workers: WorkerProfile[], maxDistance: number) => {
    if (!userLocation) return workers;

    return workers.filter((worker) => {
      const distance = calculateDistance(worker.location);
      return distance !== null && distance <= maxDistance;
    });
  };

  // FIX: Accept coordinates as parameter instead of using userLocation state
  const detectCountry = async (coords: [number, number]): Promise<CountryInfo | null> => {
    try {
      console.log('📍 Coordinates for country detection:', coords);
      
      // Default to US for testing
      return null;
    } catch (error) {
      console.error('Error detecting country:', error);
      return null;
    }
  };

  return {
    userLocation,
    detectedCountry,
    loading,
    error,
    calculateDistance,
    filterWorkersByDistance,
    detectCountry
  };
};