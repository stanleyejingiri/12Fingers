// src/hooks/useUserLocation.ts
import { useState, useEffect } from 'react';
import { detectLocationByIP, findLocationInDatabase, getSavedLocation, saveLocation } from '@/services/locationService';

export interface UserLocation {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  cityName?: string;
  countryName?: string;
  stateName?: string;
  isDetected: boolean;
  isDefault: boolean;
  source: 'saved' | 'ip' | 'manual';
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📍 Initializing user location...');
        
        // 1. Check for saved location first
        const saved = getSavedLocation();
        if (saved) {
          console.log('📍 Using saved location:', saved);
          setLocation({
            ...saved,
            isDetected: false,
            source: 'saved'
          });
          setLoading(false);
          return;
        }
        
        // 2. Try IP detection (with timeout)
        console.log('📍 Attempting IP location detection...');
        
        // Add a timeout for IP detection
        const ipDetectionPromise = detectLocationByIP();
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => {
            console.log('📍 IP detection timeout');
            resolve(null);
          }, 3000)
        );
        
        // Race between IP detection and timeout
        const detected = await Promise.race([ipDetectionPromise, timeoutPromise]);
        
        if (detected) {
          console.log('📍 IP detection successful:', detected);
          
          // Try to match with database (this is async now!)
          const matched = await findLocationInDatabase(detected);
          console.log('📍 Matched with database:', matched);
          
          if (matched.countryId) {
            setLocation({
              ...matched,
              isDetected: true,
              isDefault: false,
              source: 'ip'
            });
            
            // Save this as default location
            saveLocation({
              ...matched,
              isDetected: true,
              isDefault: true,
              source: 'ip'
            });
          } else {
            console.log('📍 No database match for IP location');
            // Don't set location if no match
          }
        } else {
          console.log('📍 IP detection failed or timed out');
          // Don't set any location - let user choose
        }
      } catch (err) {
        console.error('📍 Location initialization error:', err);
        setError('Failed to initialize location');
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  const saveUserLocation = (
    countryId?: string,
    stateId?: string,
    cityId?: string,
    cityName?: string,
    countryName?: string,
    stateName?: string
  ) => {
    const locationData: UserLocation = {
      countryId,
      stateId,
      cityId,
      cityName,
      countryName,
      stateName,
      isDetected: false,
      isDefault: true,
      source: 'manual'
    };
    
    if (saveLocation(locationData)) {
      setLocation(locationData);
      return true;
    }
    return false;
  };

  const clearUserLocation = () => {
    localStorage.removeItem('userLocation');
    setLocation(null);
  };

  return {
    location,
    loading,
    error,
    saveUserLocation,
    clearUserLocation,
    refreshLocation: () => {
      setLoading(true);
      // Re-run initialization
      const saved = getSavedLocation();
      if (saved) {
        setLocation({
          ...saved,
          isDetected: false,
          source: 'saved'
        });
      }
      setLoading(false);
    }
  };
};
