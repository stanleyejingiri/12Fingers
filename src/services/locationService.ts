//src/services/locationService.ts
/*export interface DetectedLocation {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

export const detectLocationByIP = async (): Promise<DetectedLocation | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('IP detection failed with status:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('🌍 IP detection result:', data);
    
    return {
      city: data.city || '',
      state: data.region || data.region_code || '',
      country: data.country_name || '',
      countryCode: data.country_code || '',
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.log('IP location detection failed:', error);
    return null;
  }
};

export const findLocationInDatabase = (
  detected: DetectedLocation
): {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  countryName?: string;
  stateName?: string;
  cityName?: string;
} => {
  try {
    // Normalize the detected names
    const detectedCountry = detected.country.toLowerCase();
    const detectedState = detected.state.toLowerCase();
    const detectedCity = detected.city.toLowerCase();
    
    console.log('🔍 Matching detected location:', {
      country: detectedCountry,
      state: detectedState,
      city: detectedCity
    });
    
    // Hardcoded mapping based on YOUR database
    const locationMap: Record<string, { id: string; name: string }> = {
      // United States
      'united states': { id: '1', name: 'United States' },
      'us': { id: '1', name: 'United States' },
      'usa': { id: '1', name: 'United States' },
      
      // Nigeria
      'nigeria': { id: '3', name: 'Nigeria' },
      'ng': { id: '3', name: 'Nigeria' },
      
      // United Kingdom
      'united kingdom': { id: '2', name: 'United Kingdom' },
      'uk': { id: '2', name: 'United Kingdom' },
      'great britain': { id: '2', name: 'United Kingdom' },
      
      // Kenya
      'kenya': { id: '4', name: 'Kenya' },
      'ke': { id: '4', name: 'Kenya' },
      
      // South Africa
      'south africa': { id: '5', name: 'South Africa' },
      'za': { id: '5', name: 'South Africa' }
    };
    
    const stateMap: Record<string, { id: string; parentId: string; name: string }> = {
      // US States
      'california': { id: '6', parentId: '1', name: 'California' },
      'ca': { id: '6', parentId: '1', name: 'California' },
      'texas': { id: '7', parentId: '1', name: 'Texas' },
      'tx': { id: '7', parentId: '1', name: 'Texas' },
      'new york': { id: '8', parentId: '1', name: 'New York' },
      'ny': { id: '8', parentId: '1', name: 'New York' },
      'florida': { id: '9', parentId: '1', name: 'Florida' },
      'fl': { id: '9', parentId: '1', name: 'Florida' },
      
      // UK Countries
      'england': { id: '10', parentId: '2', name: 'England' },
      'scotland': { id: '11', parentId: '2', name: 'Scotland' },
      'wales': { id: '12', parentId: '2', name: 'Wales' },
      'northern ireland': { id: '13', parentId: '2', name: 'Northern Ireland' },
      
      // Nigeria States
      'lagos': { id: '14', parentId: '3', name: 'Lagos' },
      'abuja': { id: '15', parentId: '3', name: 'Abuja' },
      'rivers': { id: '16', parentId: '3', name: 'Rivers' },
      'kano': { id: '17', parentId: '3', name: 'Kano' }
    };
    
    const cityMap: Record<string, { id: string; parentId: string; name: string }> = {
      // California Cities
      'los angeles': { id: '18', parentId: '6', name: 'Los Angeles' },
      'san francisco': { id: '19', parentId: '6', name: 'San Francisco' },
      'san diego': { id: '20', parentId: '6', name: 'San Diego' },
      'sacramento': { id: '21', parentId: '6', name: 'Sacramento' },
      
      // Texas Cities
      'houston': { id: '22', parentId: '7', name: 'Houston' },
      'dallas': { id: '23', parentId: '7', name: 'Dallas' },
      'austin': { id: '24', parentId: '7', name: 'Austin' },
      'san antonio': { id: '25', parentId: '7', name: 'San Antonio' },
      
      // Lagos Cities
      'lagos city': { id: '26', parentId: '14', name: 'Lagos City' },
      'ikeja': { id: '27', parentId: '14', name: 'Ikeja' },
      'victoria island': { id: '28', parentId: '14', name: 'Victoria Island' },
      'victoria': { id: '28', parentId: '14', name: 'Victoria Island' }
    };
    
    // Find matching country
    const countryMatch = locationMap[detectedCountry] || 
                        locationMap[detected.countryCode?.toLowerCase() || ''];
    
    if (!countryMatch) {
      console.log('❌ No country match found for:', detectedCountry);
      return {};
    }
    
    // Find matching state
    let stateMatch = null;
    if (detectedState) {
      stateMatch = stateMap[detectedState];
      
      // Also try partial matches
      if (!stateMatch) {
        for (const [key, state] of Object.entries(stateMap)) {
          if (detectedState.includes(key) || key.includes(detectedState)) {
            stateMatch = state;
            break;
          }
        }
      }
    }
    
    // Find matching city
    let cityMatch = null;
    if (detectedCity && stateMatch) {
      cityMatch = cityMap[detectedCity];
      
      // Try partial matches for city
      if (!cityMatch) {
        for (const [key, city] of Object.entries(cityMap)) {
          if (detectedCity.includes(key) || key.includes(detectedCity)) {
            cityMatch = city;
            break;
          }
        }
      }
    }
    
    const result = {
      countryId: countryMatch.id,
      stateId: stateMatch?.id,
      cityId: cityMatch?.id,
      countryName: countryMatch.name,
      stateName: stateMatch?.name,
      cityName: cityMatch?.name || detected.city
    };
    
    console.log('✅ Location match result:', result);
    return result;
    
  } catch (error) {
    console.error('Error finding location in database:', error);
    return {};
  }
};

// Helper to get saved location from localStorage
export const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Helper to save location to localStorage
export const saveLocation = (location: any) => {
  try {
    const locationData = {
      ...location,
      savedAt: Date.now(),
      isDefault: true
    };
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    return true;
  } catch {
    return false;
  }
};

// Helper to clear saved location
export const clearSavedLocation = () => {
  localStorage.removeItem('userLocation');
};*/

//src/services/locationService.ts
/*export interface DetectedLocation {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

export interface DatabaseLocationMatch {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  countryName?: string;
  stateName?: string;
  cityName?: string;
}

// Detect location by IP (unchanged)
export const detectLocationByIP = async (): Promise<DetectedLocation | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('IP detection failed with status:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('🌍 IP detection result:', data);
    
    return {
      city: data.city || '',
      state: data.region || data.region_code || '',
      country: data.country_name || '',
      countryCode: data.country_code || '',
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.log('IP location detection failed:', error);
    return null;
  }
};

// Database-driven location matching
export const findLocationInDatabase = async (
  detected: DetectedLocation
): Promise<DatabaseLocationMatch> => {
  try {
    console.log('🔍 Matching detected location in database:', {
      country: detected.country,
      state: detected.state,
      city: detected.city
    });
    
    // Call our API to match the location
    const params = new URLSearchParams({
      country: detected.country || '',
      state: detected.state || '',
      city: detected.city || ''
    });
    
    const response = await fetch(`/api/locations/match?${params}`);
    
    if (!response.ok) {
      console.error('Location matching API failed:', response.status);
      return {};
    }
    
    const data = await response.json();
    
    if (!data.success || !data.match) {
      console.log('❌ No location match found in database');
      return {};
    }
    
    console.log('✅ Database location match:', data.match);
    return data.match;
    
  } catch (error) {
    console.error('Error finding location in database:', error);
    return {};
  }
};

// Get location hierarchy for dropdowns
export const getLocationHierarchy = async () => {
  try {
    const response = await fetch('/api/locations/hierarchy');
    
    if (!response.ok) {
      throw new Error('Failed to fetch location hierarchy');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch locations');
    }
    
    // Convert hierarchy to the format expected by LocationSelector
    const locationsMap: Record<string, Record<string, string[]>> = {};
    
    data.hierarchy.forEach((country: any) => {
      const countryKey = country.id.toString();
      locationsMap[countryKey] = {};
      
      country.states.forEach((state: any) => {
        const stateKey = state.id.toString();
        locationsMap[countryKey][stateKey] = state.cities.map((city: any) => city.name);
      });
    });
    
    return locationsMap;
    
  } catch (error) {
    console.error('Error fetching location hierarchy:', error);
    return {};
  }
};

// Get countries for dropdown
export const getCountries = async () => {
  try {
    const response = await fetch('/api/locations/countries');
    
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch countries');
    }
    
    return data.countries;
    
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Get states for a country
export const getStates = async (countryId: string) => {
  if (!countryId || countryId === 'all') return [];
  
  try {
    const response = await fetch(`/api/locations/states/${countryId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch states');
    }
    
    return data.states;
    
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

// Get cities for a state
export const getCities = async (stateId: string) => {
  if (!stateId || stateId === 'all') return [];
  
  try {
    const response = await fetch(`/api/locations/cities/${stateId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch cities');
    }
    
    return data.cities;
    
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// Helper functions (unchanged)
export const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveLocation = (location: any) => {
  try {
    const locationData = {
      ...location,
      savedAt: Date.now(),
      isDefault: true
    };
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    return true;
  } catch {
    return false;
  }
};

export const clearSavedLocation = () => {
  localStorage.removeItem('userLocation');
};*/

//src/services/locationService.ts
export interface DetectedLocation {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

export interface DatabaseLocationMatch {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  countryName?: string;
  stateName?: string;
  cityName?: string;
}

// Primary IP detection
export const detectLocationByIP = async (): Promise<DetectedLocation | null> => {
  try {
    console.log('🌍 Starting IP location detection...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Shorter timeout
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('🌍 Primary IP detection failed with status:', response.status);
      // Try fallback immediately
      return await detectLocationByIPFallback();
    }
    
    const data = await response.json();
    console.log('🌍 Primary IP detection result:', data);
    
    return {
      city: data.city || '',
      state: data.region || data.region_code || '',
      country: data.country_name || '',
      countryCode: data.country_code || '',
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.log('🌍 Primary IP detection failed:', error);
    // Try fallback
    return await detectLocationByIPFallback();
  }
};

// Fallback IP detection with multiple APIs
export const detectLocationByIPFallback = async (): Promise<DetectedLocation | null> => {
  const fallbackApis = [
    {
      url: 'https://ipwho.is/',
      mapper: (data: any) => ({
        city: data.city,
        state: data.region,
        country: data.country,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude
      })
    },
    {
      url: 'https://freeipapi.com/api/json',
      mapper: (data: any) => ({
        city: data.cityName,
        state: data.regionName,
        country: data.countryName,
        countryCode: data.countryCode,
        latitude: data.latitude,
        longitude: data.longitude
      })
    },
    {
      url: 'https://ipinfo.io/json',
      mapper: (data: any) => {
        const [city, region, country] = (data.loc || '').split(',');
        return {
          city: data.city || city || '',
          state: data.region || region || '',
          country: data.country || country || '',
          countryCode: data.country || '',
          latitude: parseFloat(city) || undefined,
          longitude: parseFloat(region) || undefined
        };
      }
    }
  ];

  for (const api of fallbackApis) {
    try {
      console.log(`🌍 Trying fallback API: ${api.url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(api.url, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`🌍 Fallback API success: ${api.url}`, data);
        return api.mapper(data);
      }
    } catch (error) {
      console.log(`🌍 Fallback API failed: ${api.url}`, error);
      // Continue to next API
    }
  }
  
  console.log('🌍 All IP detection APIs failed');
  return null;
};

// Database-driven location matching - FIXED: Properly handle async API
export const findLocationInDatabase = async (
  detected: DetectedLocation
): Promise<DatabaseLocationMatch> => {
  try {
    console.log('🔍 Matching detected location in database:', {
      country: detected.country,
      state: detected.state,
      city: detected.city
    });
    
    // Skip if no country detected
    if (!detected.country) {
      console.log('❌ No country detected, skipping database match');
      return {};
    }
    
    // Call our API to match the location
    const params = new URLSearchParams({
      country: detected.country || '',
      state: detected.state || '',
      city: detected.city || ''
    });
    
    // Use relative URL for production, absolute for development
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://one2fingers-backend.onrender.com' 
      : '';
    
    const response = await fetch(`${baseUrl}/api/locations/match?${params}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('❌ Location matching API failed:', response.status);
      return {};
    }
    
    const data = await response.json();
    
    if (!data.success || !data.match) {
      console.log('❌ No location match found in database');
      return {};
    }
    
    console.log('✅ Database location match:', data.match);
    return data.match;
    
  } catch (error) {
    console.error('❌ Error finding location in database:', error);
    return {};
  }
};

// Get location hierarchy for dropdowns
export const getLocationHierarchy = async () => {
  try {
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://one2fingers-backend.onrender.com' 
      : '';
    
    const response = await fetch(`${baseUrl}/api/locations/hierarchy`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch location hierarchy: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch locations');
    }
    
    console.log('✅ Location hierarchy loaded:', data.hierarchy?.length, 'countries');
    
    // Convert hierarchy to the format expected by LocationSelector
    const locationsMap: Record<string, Record<string, string[]>> = {};
    
    data.hierarchy?.forEach((country: any) => {
      const countryKey = country.id.toString();
      locationsMap[countryKey] = {};
      
      country.states?.forEach((state: any) => {
        const stateKey = state.id.toString();
        locationsMap[countryKey][stateKey] = state.cities?.map((city: any) => city.name) || [];
      });
    });
    
    return locationsMap;
    
  } catch (error) {
    console.error('❌ Error fetching location hierarchy:', error);
    return {};
  }
};

// Get countries for dropdown
export const getCountries = async () => {
  try {
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://one2fingers-backend.onrender.com' 
      : '';
    
    const response = await fetch(`${baseUrl}/api/locations/countries`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch countries');
    }
    
    console.log('✅ Countries loaded:', data.countries?.length);
    return data.countries || [];
    
  } catch (error) {
    console.error('❌ Error fetching countries:', error);
    return [];
  }
};

// Get states for a country
export const getStates = async (countryId: string) => {
  if (!countryId || countryId === 'all') return [];
  
  try {
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://one2fingers-backend.onrender.com' 
      : '';
    
    const response = await fetch(`${baseUrl}/api/locations/states/${countryId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch states');
    }
    
    console.log('✅ States loaded for country', countryId, ':', data.states?.length);
    return data.states || [];
    
  } catch (error) {
    console.error('❌ Error fetching states:', error);
    return [];
  }
};

// Get cities for a state
export const getCities = async (stateId: string) => {
  if (!stateId || stateId === 'all') return [];
  
  try {
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://one2fingers-backend.onrender.com' 
      : '';
    
    const response = await fetch(`${baseUrl}/api/locations/cities/${stateId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch cities');
    }
    
    console.log('✅ Cities loaded for state', stateId, ':', data.cities?.length);
    return data.cities || [];
    
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    return [];
  }
};

// Helper functions
export const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveLocation = (location: any) => {
  try {
    const locationData = {
      ...location,
      savedAt: Date.now(),
      isDefault: true
    };
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    console.log('💾 Location saved to localStorage:', locationData);
    return true;
  } catch (error) {
    console.error('❌ Failed to save location:', error);
    return false;
  }
};

export const clearSavedLocation = () => {
  localStorage.removeItem('userLocation');
  console.log('🗑️ Location cleared from localStorage');
};
