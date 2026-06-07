//src/hooks/useLocationData.ts
import { useState, useEffect, useCallback } from 'react';

export interface LocationOption {
  id: number;
  name: string;
  code?: string;
}

export const useLocationData = (selectedCountry?: string, selectedState?: string) => {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Base URL - use relative path for production
  const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

  // Fetch all countries
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/locations/countries`);
      if (!response.ok) throw new Error(`Failed to fetch countries: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ Countries loaded from API:', data.countries.length);
        setCountries(data.countries);
      } else {
        throw new Error(data.error || 'Failed to load countries');
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load countries');
      setCountries([]); // Empty instead of hardcoded
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Auto-fetch states when country changes
  useEffect(() => {
    const fetchStatesForCountry = async () => {
      if (selectedCountry && selectedCountry !== "all") {
        const countryId = parseInt(selectedCountry);
        if (!isNaN(countryId)) {
          console.log('🌍 Fetching states for country ID:', countryId);
          try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/locations/states/${countryId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                console.log('✅ States loaded:', data.states.length);
                setStates(data.states);
                setCities([]); // Reset cities when state changes
              }
            }
          } catch (err) {
            console.error('Error fetching states:', err);
            setStates([]); // Empty instead of failing
          } finally {
            setLoading(false);
          }
        }
      } else {
        setStates([]);
        setCities([]);
      }
    };

    fetchStatesForCountry();
  }, [selectedCountry, API_BASE]);

  // Auto-fetch cities when state changes
  useEffect(() => {
    const fetchCitiesForState = async () => {
      if (selectedState && selectedState !== "all") {
        const stateId = parseInt(selectedState);
        if (!isNaN(stateId)) {
          console.log('🌍 Fetching cities for state ID:', stateId);
          try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/locations/cities/${stateId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                console.log('✅ Cities loaded:', data.cities.length);
                setCities(data.cities);
              }
            }
          } catch (err) {
            console.error('Error fetching cities:', err);
            setCities([]); // Empty instead of failing
          } finally {
            setLoading(false);
          }
        }
      } else {
        setCities([]);
      }
    };

    fetchCitiesForState();
  }, [selectedState, API_BASE]);

  // Initial load
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    states,
    cities,
    loading,
    error,
    refreshCountries: fetchCountries
  };
};