//src/utils/workerFiltering.ts
/*
import { WorkerProfile } from "@/types/worker";
import { useConfig } from "@/contexts/ConfigContext";

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
}

export const filterWorkers = (workers: WorkerProfile[], filters: FilterOptions) => {
  return workers?.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = filters.selectedCategory === "all" || worker.category === filters.selectedCategory;
    const matchesPrice = worker.hourlyRate >= filters.minPrice && 
                        (filters.maxPrice === 0 || worker.hourlyRate <= filters.maxPrice);
    const matchesExperience = worker.yearsOfExperience >= filters.minExperience && 
                             worker.yearsOfExperience <= filters.maxExperience;
    const matchesRating = worker.averageRating >= filters.minRating;
    const matchesCertification = !filters.requireCertification || 
                                (worker.certifications && worker.certifications.length > 0);
    const matchesWarranty = !filters.requireWarranty || worker.offersWarranty;
    
    // Get the current country from ConfigContext
    const { config } = useConfig();
    const matchesCountry = !config.country.code || !worker.location?.country || worker.location.country === config.country.code;
    
    return matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesCountry;
  });
};
*/

//src/utils/workerFiltering.ts
/*import { WorkerProfile } from "@/types/worker";

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  maxDistance?: number;
  userLocation?: [number, number] | null;
  countryCode?: string;
}

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export const filterWorkers = (workers: WorkerProfile[], filters: FilterOptions) => {
  if (!workers) return [];
  
  return workers.filter((worker) => {
    // 1. Search term filter
    const matchesSearch = filters.searchTerm === "" ||
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (worker.description && worker.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      worker.category === filters.selectedCategory;
    
    // 3. Price filter
    const matchesPrice = worker.hourly_rate >= filters.minPrice && 
      (filters.maxPrice === 0 || worker.hourly_rate <= filters.maxPrice);
    
    // 4. Experience filter
    const matchesExperience = worker.years_of_experience >= filters.minExperience && 
      worker.years_of_experience <= filters.maxExperience;
    
    // 5. Rating filter
    const matchesRating = worker.average_rating >= filters.minRating;
    
    // 6. Certification filter
    const matchesCertification = !filters.requireCertification || 
      (worker.certifications && worker.certifications.length > 0);
    
    // 7. Warranty filter
    const matchesWarranty = !filters.requireWarranty || worker.offers_warranty;
    
    // 8. Distance filter
    let matchesDistance = true;
    if (filters.maxDistance && filters.maxDistance > 0 && 
        filters.userLocation && worker.location) {
      const distance = calculateDistance(
        filters.userLocation[0],
        filters.userLocation[1],
        worker.location.latitude,
        worker.location.longitude
      );
      matchesDistance = distance <= filters.maxDistance;
      console.log(`Distance check: ${distance.toFixed(2)}km vs ${filters.maxDistance}km = ${matchesDistance}`);
    }
    
    // 9. Country filter
    let matchesCountry = true;
    if (filters.countryCode && filters.countryCode.trim() !== "" && worker.location?.country) {
      matchesCountry = worker.location.country.toLowerCase() === filters.countryCode.toLowerCase();
    }
    
    const shouldInclude = matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesDistance &&
           matchesCountry;
    
    if (!shouldInclude) {
      console.log(`Worker ${worker.name} filtered out due to:`, {
        matchesSearch, matchesCategory, matchesPrice, matchesExperience,
        matchesRating, matchesCertification, matchesWarranty, matchesDistance, matchesCountry
      });
    }
    
    return shouldInclude;
  });
};
*/

//src/utils/workerFiltering.ts
/*import { WorkerProfile } from "@/types/worker";

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
}

// Helper function to match location
const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  // Get the selected country name/code from locationData
  const selectedCountry = locationData.countries.find(c => c.id.toString() === countryId);
  if (!selectedCountry) return true; // If country not found, don't filter
  
  // Check if worker's country matches
  if (worker.country && worker.country.toLowerCase() !== selectedCountry.code.toLowerCase()) {
    return false;
  }
  
  // If state is specified, check it
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states.find(s => s.id.toString() === stateId);
    if (selectedState && worker.state && worker.state.toLowerCase() !== selectedState.name.toLowerCase()) {
      return false;
    }
    
    // If city is specified, check it
    if (cityId && cityId !== "all") {
      const selectedCity = locationData.cities.find(c => c.id.toString() === cityId);
      if (selectedCity && worker.city && worker.city.toLowerCase() !== selectedCity.name.toLowerCase()) {
        return false;
      }
    }
  }
  
  return true;
};

export const filterWorkers = (
  workers: WorkerProfile[], 
  filters: FilterOptions,
  locationData: { countries: any[], states: any[], cities: any[] } = { countries: [], states: [], cities: [] }
) => {
  if (!workers) return [];
  
  console.log('🔍 [filterWorkers] Starting filter with:', {
    workerCount: workers.length,
    filters: {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating
    }
  });
  
  return workers.filter((worker) => {
    // 1. Search term filter
    const matchesSearch = filters.searchTerm === "" ||
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (worker.description && worker.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      worker.category === filters.selectedCategory;
    
    // 3. Price filter
    const matchesPrice = worker.hourly_rate >= filters.minPrice && 
      (filters.maxPrice === 0 || worker.hourly_rate <= filters.maxPrice);
    
    // 4. Experience filter
    const matchesExperience = worker.years_of_experience >= filters.minExperience && 
      worker.years_of_experience <= filters.maxExperience;
    
    // 5. Rating filter
    const matchesRating = worker.average_rating >= filters.minRating;
    
    // 6. Certification filter
    const matchesCertification = !filters.requireCertification || 
      (worker.certifications && worker.certifications.length > 0);
    
    // 7. Warranty filter
    const matchesWarranty = !filters.requireWarranty || worker.offers_warranty;
    
    // 8. Location filter (NEW)
    const matchesLocationFilter = matchesLocation(
      worker, 
      filters.selectedCountry, 
      filters.selectedState, 
      filters.selectedCity,
      locationData
    );
    
    // Debug logging
    if (!matchesLocationFilter) {
      console.log(`📍 Location filter excluded ${worker.name}:`, {
        workerCountry: worker.country,
        workerState: worker.state,
        workerCity: worker.city,
        selectedCountry: filters.selectedCountry,
        selectedState: filters.selectedState,
        selectedCity: filters.selectedCity
      });
    }
    
    return matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesLocationFilter;
  });
};
*/

//src/utils/workerFiltering.ts
/*import { WorkerProfile } from "@/types/worker";

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
}

const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  // Get the selected country from locationData
  const selectedCountry = locationData.countries.find(c => c.id.toString() === countryId);
  if (!selectedCountry) {
    console.log('📍 No country found for ID:', countryId);
    return true; // If country not found, don't filter
  }
  
  // NOW: Compare country NAMES (both are "United States")
  const workerCountry = worker.country ? worker.country.toLowerCase() : '';
  const selectedCountryName = selectedCountry.name ? selectedCountry.name.toLowerCase() : '';
  
  console.log(`📍 Country check: worker="${workerCountry}", selected="${selectedCountryName}"`);
  
  if (workerCountry && workerCountry !== selectedCountryName) {
    console.log(`📍 Country mismatch: "${workerCountry}" vs "${selectedCountryName}"`);
    return false;
  }
  
  // If state is specified, check it
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states.find(s => s.id.toString() === stateId);
    if (selectedState) {
      // States: compare names (both should be full names)
      const workerState = worker.state ? worker.state.toLowerCase() : '';
      const selectedStateName = selectedState.name ? selectedState.name.toLowerCase() : '';
      
      console.log(`📍 State check: worker="${workerState}", selected="${selectedStateName}"`);
      
      if (workerState && workerState !== selectedStateName) {
        console.log(`📍 State mismatch: "${workerState}" vs "${selectedStateName}"`);
        return false;
      }
    }
    
    // If city is specified, check it
    if (cityId && cityId !== "all") {
      const selectedCity = locationData.cities.find(c => c.id.toString() === cityId);
      if (selectedCity) {
        // Cities: compare names (both should be full names)
        const workerCity = worker.city ? worker.city.toLowerCase() : '';
        const selectedCityName = selectedCity.name ? selectedCity.name.toLowerCase() : '';
		        
        console.log(`📍 City check: worker="${workerCity}", selected="${selectedCityName}"`);
        
        if (workerCity && workerCity !== selectedCityName) {
          console.log(`📍 City mismatch: "${workerCity}" vs "${selectedCityName}"`);
          return false;
        }
      }
    }
  }
  
  return true;
};

export const filterWorkers = (
  workers: WorkerProfile[], 
  filters: FilterOptions,
  locationData: { countries: any[], states: any[], cities: any[] } = { countries: [], states: [], cities: [] }
) => {
  console.log('🔍 [filterWorkers] Starting filter with:', {
    workerCount: workers?.length || 0,
    filters: {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating
    },
    locationData: {
      countriesCount: locationData.countries?.length || 0,
      statesCount: locationData.states?.length || 0,
      citiesCount: locationData.cities?.length || 0
    }
  });
  
  if (!workers || !Array.isArray(workers)) {
    console.error('❌ [filterWorkers] workers is not an array:', workers);
    return [];
  }
  
  const filtered = workers.filter((worker) => {
    // 1. Search term filter
    const matchesSearch = filters.searchTerm === "" ||
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (worker.description && worker.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      worker.category === filters.selectedCategory;
    
    // 3. Price filter
    const matchesPrice = worker.hourly_rate >= filters.minPrice && 
      (filters.maxPrice === 0 || worker.hourly_rate <= filters.maxPrice);
    
    // 4. Experience filter
    const matchesExperience = worker.years_of_experience >= filters.minExperience && 
      worker.years_of_experience <= filters.maxExperience;
    
    // 5. Rating filter
    const matchesRating = worker.average_rating >= filters.minRating;
    
    // 6. Certification filter
    const matchesCertification = !filters.requireCertification || 
      (worker.certifications && worker.certifications.length > 0);
    
    // 7. Warranty filter
    const matchesWarranty = !filters.requireWarranty || worker.offers_warranty;
    
    // 8. Location filter
    const matchesLocationFilter = matchesLocation(
      worker, 
      filters.selectedCountry, 
      filters.selectedState, 
      filters.selectedCity,
      locationData
    );
    
    const shouldInclude = matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesLocationFilter;
    
    // Safe debug logging
    if (!shouldInclude && worker && worker.name) {
      console.log(`❌ [filterWorkers] Excluded "${worker.name}"`, {
        matchesSearch, 
        matchesCategory, 
        matchesPrice, 
        matchesExperience,
        matchesRating, 
        matchesCertification, 
        matchesWarranty, 
        matchesLocationFilter
      });
    }
    
    return shouldInclude;
  });
  
  console.log(`✅ [filterWorkers] Filtered ${workers.length} → ${filtered.length} workers`);
  return filtered;
};*/

//src/utils/workerFiltering.ts
/*import { WorkerProfile } from "@/types/worker";
interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
}

// Helper function to normalize strings for comparison
const normalizeLocationString = (str: string | undefined | null): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')      // Normalize multiple spaces to single space
    .replace(/[.,]/g, '')      // Remove periods and commas
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
};

const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  // Get the selected country from locationData
  const selectedCountry = locationData.countries.find(c => c.id.toString() === countryId);
  if (!selectedCountry) {
    console.log('📍 [matchesLocation] No country found for ID:', countryId);
    return true; // If country not found, don't filter
  }
  
  // Compare country names
  const workerCountry = normalizeLocationString(worker.country);
  const selectedCountryName = normalizeLocationString(selectedCountry.name);
  
  console.log(`📍 [matchesLocation] Country check: worker="${workerCountry}", selected="${selectedCountryName}"`);
  
  if (workerCountry && workerCountry !== selectedCountryName) {
    console.log(`📍 [matchesLocation] Country mismatch: "${workerCountry}" vs "${selectedCountryName}"`);
    return false;
  }
  
  // If state is specified, check it
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states.find(s => s.id.toString() === stateId);
    if (selectedState) {
      const workerState = normalizeLocationString(worker.state);
      const selectedStateName = normalizeLocationString(selectedState.name);
      
      console.log(`📍 [matchesLocation] State check: worker="${workerState}", selected="${selectedStateName}"`);
      
      if (workerState && workerState !== selectedStateName) {
        console.log(`📍 [matchesLocation] State mismatch: "${workerState}" vs "${selectedStateName}"`);
        return false;
      }
    }
  }
  
  // If city is specified, check it (INDEPENDENT of state check - FIXED!)
  if (cityId && cityId !== "all") {
    const selectedCity = locationData.cities.find(c => c.id.toString() === cityId);
    if (selectedCity) {
      const workerCity = normalizeLocationString(worker.city);
      const selectedCityName = normalizeLocationString(selectedCity.name);
      
      console.log(`📍 [matchesLocation] City check: worker="${workerCity}", selected="${selectedCityName}"`);
      
      // More flexible city matching
      if (workerCity) {
        // Check for exact match or partial match
        const cityMatch = workerCity === selectedCityName ||
                         workerCity.includes(selectedCityName) ||
                         selectedCityName.includes(workerCity);
        
        if (!cityMatch) {
          console.log(`📍 [matchesLocation] City mismatch: "${workerCity}" vs "${selectedCityName}"`);
          return false;
        }
      } else {
        // Worker has no city specified, but we're filtering by city
        console.log(`📍 [matchesLocation] Worker has no city but filtering by city "${selectedCityName}"`);
        return false;
      }
    }
  }
  
  return true;
};

export const filterWorkers = (
  workers: WorkerProfile[], 
  filters: FilterOptions,
  locationData: { countries: any[], states: any[], cities: any[] } = { countries: [], states: [], cities: [] }
) => {
  console.log('🔍 [filterWorkers] Starting filter with:', {
    workerCount: workers?.length || 0,
    filters: {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating
    },
    locationData: {
      countriesCount: locationData.countries?.length || 0,
      statesCount: locationData.states?.length || 0,
      citiesCount: locationData.cities?.length || 0
    }
  });
  
  if (!workers || !Array.isArray(workers)) {
    console.error('❌ [filterWorkers] workers is not an array:', workers);
    return [];
  }
  
  const filtered = workers.filter((worker) => {
    // 1. Search term filter
    const matchesSearch = filters.searchTerm === "" ||
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (worker.description && worker.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      worker.category === filters.selectedCategory;
    
    // 3. Price filter
    const matchesPrice = worker.hourly_rate >= filters.minPrice && 
      (filters.maxPrice === 0 || worker.hourly_rate <= filters.maxPrice);
    
    // 4. Experience filter
    const matchesExperience = worker.years_of_experience >= filters.minExperience && 
      worker.years_of_experience <= filters.maxExperience;
    
    // 5. Rating filter
    const matchesRating = worker.average_rating >= filters.minRating;
    
    // 6. Certification filter
    const matchesCertification = !filters.requireCertification || 
      (worker.certifications && worker.certifications.length > 0);
    
    // 7. Warranty filter
    const matchesWarranty = !filters.requireWarranty || worker.offers_warranty;
    
    // 8. Location filter
    const matchesLocationFilter = matchesLocation(
      worker, 
      filters.selectedCountry, 
      filters.selectedState, 
      filters.selectedCity,
      locationData
    );
    
    const shouldInclude = matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesLocationFilter;
    
    // Debug logging for location mismatches
    if (!matchesLocationFilter && worker && worker.name) {
      console.log(`📍 [filterWorkers] Location filter excluded "${worker.name}"`, {
        workerLocation: {
          country: worker.country,
          state: worker.state,
          city: worker.city
        },
        filterLocation: {
          country: filters.selectedCountry,
          state: filters.selectedState,
          city: filters.selectedCity
        }
      });
    }
    
    return shouldInclude;
  });
  
  console.log(`✅ [filterWorkers] Filtered ${workers.length} → ${filtered.length} workers`);
  return filtered;
};*/

//src/utils/workerFiltering.ts - RESTORED VERSION WITH FIX
/*import { WorkerProfile } from "@/types/worker";

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
}

const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  // Get the selected country from locationData
  const selectedCountry = locationData.countries.find(c => c.id.toString() === countryId);
  if (!selectedCountry) {
    console.log('📍 No country found for ID:', countryId);
    return true; // If country not found, don't filter
  }
  
  // Compare country NAMES
  const workerCountry = worker.country ? worker.country.toLowerCase() : '';
  const selectedCountryName = selectedCountry.name ? selectedCountry.name.toLowerCase() : '';
  
  console.log(`📍 Country check: worker="${workerCountry}", selected="${selectedCountryName}"`);
  
  if (workerCountry && workerCountry !== selectedCountryName) {
    console.log(`📍 Country mismatch: "${workerCountry}" vs "${selectedCountryName}"`);
    return false;
  }
  
  // If state is specified, check it
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states.find(s => s.id.toString() === stateId);
    if (selectedState) {
      const workerState = worker.state ? worker.state.toLowerCase() : '';
      const selectedStateName = selectedState.name ? selectedState.name.toLowerCase() : '';
      
      console.log(`📍 State check: worker="${workerState}", selected="${selectedStateName}"`);
      
      if (workerState && workerState !== selectedStateName) {
        console.log(`📍 State mismatch: "${workerState}" vs "${selectedStateName}"`);
        return false;
      }
    }
  }
  
  // FIXED: City check should be INDEPENDENT, not nested inside state check
  // If city is specified, check it (REGARDLESS of state)
  if (cityId && cityId !== "all") {
    const selectedCity = locationData.cities.find(c => c.id.toString() === cityId);
    if (selectedCity) {
      const workerCity = worker.city ? worker.city.toLowerCase() : '';
      const selectedCityName = selectedCity.name ? selectedCity.name.toLowerCase() : '';
      
      console.log(`📍 City check: worker="${workerCity}", selected="${selectedCityName}"`);
      
      // IMPORTANT: Allow partial matching for cities
      // "Cole Bay" should match "Cole Bay", "Colebay", "cole bay", etc.
      const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
      
      const workerCityNormalized = normalize(workerCity);
      const selectedCityNameNormalized = normalize(selectedCityName);
      
      if (workerCityNormalized && workerCityNormalized !== selectedCityNameNormalized) {
        console.log(`📍 City mismatch: "${workerCityNormalized}" vs "${selectedCityNameNormalized}"`);
        return false;
      }
    }
  }
  
  return true;
};

export const filterWorkers = (
  workers: WorkerProfile[], 
  filters: FilterOptions,
  locationData: { countries: any[], states: any[], cities: any[] } = { countries: [], states: [], cities: [] }
) => {
  console.log('🔍 [filterWorkers] Starting filter with:', {
    workerCount: workers?.length || 0,
    filters: {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating
    },
    locationData: {
      countriesCount: locationData.countries?.length || 0,
      statesCount: locationData.states?.length || 0,
      citiesCount: locationData.cities?.length || 0
    }
  });
  
  if (!workers || !Array.isArray(workers)) {
    console.error('❌ [filterWorkers] workers is not an array:', workers);
    return [];
  }
  
  const filtered = workers.filter((worker) => {
    // 1. Search term filter
    const matchesSearch = filters.searchTerm === "" ||
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (worker.description && worker.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      worker.category === filters.selectedCategory;
    
    // 3. Price filter
    const matchesPrice = worker.hourly_rate >= filters.minPrice && 
      (filters.maxPrice === 0 || worker.hourly_rate <= filters.maxPrice);
    
    // 4. Experience filter
    const matchesExperience = worker.years_of_experience >= filters.minExperience && 
      worker.years_of_experience <= filters.maxExperience;
    
    // 5. Rating filter
    const matchesRating = worker.average_rating >= filters.minRating;
    
    // 6. Certification filter
    const matchesCertification = !filters.requireCertification || 
      (worker.certifications && worker.certifications.length > 0);
    
    // 7. Warranty filter
    const matchesWarranty = !filters.requireWarranty || worker.offers_warranty;
    
    // 8. Location filter
    const matchesLocationFilter = matchesLocation(
      worker, 
      filters.selectedCountry, 
      filters.selectedState, 
      filters.selectedCity,
      locationData
    );
    
    const shouldInclude = matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesLocationFilter;
    
    return shouldInclude;
  });
  
  console.log(`✅ [filterWorkers] Filtered ${workers.length} → ${filtered.length} workers`);
  return filtered;
};
*/

//src/utils/workerFiltering.ts
import { WorkerProfile } from "@/types/worker";

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
}

/*const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  console.log('📍 [matchesLocation] Looking for country ID:', countryId);
  
  // Get the selected country from locationData - FIXED: Compare as strings
  const selectedCountry = locationData.countries?.find(c => {
    const countryIdStr = c.id?.toString();
    const targetIdStr = countryId?.toString();
    return countryIdStr === targetIdStr;
  });
  
  if (!selectedCountry) {
    console.log('📍 [matchesLocation] No country found for ID:', countryId, 
      'Available countries:', locationData.countries?.map(c => ({ id: c.id, name: c.name })));
    return true; // If country not found, don't filter
  }
  
  // Compare country NAMES
  const workerCountry = worker.country ? worker.country.toLowerCase().trim() : '';
  const selectedCountryName = selectedCountry.name ? selectedCountry.name.toLowerCase().trim() : '';
  
  console.log(`📍 [matchesLocation] Country check: worker="${workerCountry}" vs selected="${selectedCountryName}"`);
  
  if (workerCountry && workerCountry !== selectedCountryName) {
    console.log(`📍 [matchesLocation] Country mismatch: "${workerCountry}" vs "${selectedCountryName}"`);
    return false;
  }
  
  // If state is specified, check it
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states?.find(s => {
      const stateIdStr = s.id?.toString();
      const targetStateIdStr = stateId?.toString();
      return stateIdStr === targetStateIdStr;
    });
    
    if (selectedState) {
      const workerState = worker.state ? worker.state.toLowerCase().trim() : '';
      const selectedStateName = selectedState.name ? selectedState.name.toLowerCase().trim() : '';
      
      console.log(`📍 [matchesLocation] State check: worker="${workerState}" vs selected="${selectedStateName}"`);
      
      if (workerState && workerState !== selectedStateName) {
        console.log(`📍 [matchesLocation] State mismatch: "${workerState}" vs "${selectedStateName}"`);
        return false;
      }
    }
  }
  
  // If city is specified, check it (INDEPENDENT of state)
  if (cityId && cityId !== "all") {
    const selectedCity = locationData.cities?.find(c => {
      const cityIdStr = c.id?.toString();
      const targetCityIdStr = cityId?.toString();
      return cityIdStr === targetCityIdStr;
    });
    
    if (selectedCity) {
      const workerCity = worker.city ? worker.city.toLowerCase().trim() : '';
      const selectedCityName = selectedCity.name ? selectedCity.name.toLowerCase().trim() : '';
      
      console.log(`📍 [matchesLocation] City check: worker="${workerCity}" vs selected="${selectedCityName}"`);
      
      // Normalize for comparison (remove extra spaces, handle variations)
      const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
      
      const workerCityNormalized = normalize(workerCity);
      const selectedCityNameNormalized = normalize(selectedCityName);
      
      if (workerCityNormalized && workerCityNormalized !== selectedCityNameNormalized) {
        console.log(`📍 [matchesLocation] City mismatch: "${workerCityNormalized}" vs "${selectedCityNameNormalized}"`);
        return false;
      }
    }
  }
  
  return true;
};*/
/*const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  console.log('📍 [matchesLocation] Looking for country ID:', countryId);
  
  // Get the selected country from locationData - FIXED: Compare as strings
  const selectedCountry = locationData.countries?.find(c => {
    const countryIdStr = c.id?.toString();
    const targetIdStr = countryId?.toString();
    return countryIdStr === targetIdStr;
  });
  
  if (!selectedCountry) {
    console.log('📍 [matchesLocation] No country found for ID:', countryId, 
      'Available countries:', locationData.countries?.map(c => ({ id: c.id, name: c.name })));
    return true; // If country not found, don't filter
  }
  
  
  // Compare country IDs - FIXED: Compare IDs instead of names
	const workerCountryId = worker.countryId ? worker.countryId.toString() : '';
	const selectedCountryIdStr = selectedCountry.id ? selectedCountry.id.toString() : '';

	console.log(`📍 [matchesLocation] Country ID check: worker="${workerCountryId}" (${worker.country}) vs selected="${selectedCountryIdStr}" (${selectedCountry.name})`);

	if (workerCountryId && workerCountryId !== selectedCountryIdStr) {
	  console.log(`📍 [matchesLocation] Country ID mismatch: "${workerCountryId}" (${worker.country}) vs "${selectedCountryIdStr}" (${selectedCountry.name})`);
	  return false;
	}
  
  
  // If state is specified, check it
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states?.find(s => {
      const stateIdStr = s.id?.toString();
      const targetStateIdStr = stateId?.toString();
      return stateIdStr === targetStateIdStr;
    });
    
    if (selectedState) {
      //const workerState = worker.state ? worker.state.toLowerCase().trim() : '';
      //const selectedStateName = selectedState.name ? selectedState.name.toLowerCase().trim() : '';
	   //console.log(`📍 [matchesLocation] State check: worker="${workerState}" vs selected="${selectedStateName}"`);
	  const workerStateId = worker.stateId ? worker.stateId.toString() : '';
	  const selectedStateIdStr = selectedState.id ? selectedState.id.toString() : '';
	  console.log(`📍 [matchesLocation] State ID check: worker="${workerStateId}" (${worker.state}) vs selected="${selectedStateIdStr}" (${selectedState.name})`);
      
		  if (workerStateId && workerStateId !== selectedStateIdStr) {
			  console.log(`📍 [matchesLocation] State ID mismatch: "${workerStateId}" (${worker.state}) vs "${selectedStateIdStr}" (${selectedState.name})`);
			  return false;
			}
    }
  }
  
  // If city is specified, check it (INDEPENDENT of state)
  if (cityId && cityId !== "all") {
    const selectedCity = locationData.cities?.find(c => {
      const cityIdStr = c.id?.toString();
      const targetCityIdStr = cityId?.toString();
      return cityIdStr === targetCityIdStr;
    });
    
    if (selectedCity) {
      //const workerCity = worker.city ? worker.city.toLowerCase().trim() : '';
      //const selectedCityName = selectedCity.name ? selectedCity.name.toLowerCase().trim() : '';
      //console.log(`📍 [matchesLocation] City check: worker="${workerCity}" vs selected="${selectedCityName}"`);
      	const workerCityId = worker.cityId ? worker.cityId.toString() : '';
		const selectedCityIdStr = selectedCity.id ? selectedCity.id.toString() : '';
		console.log(`📍 [matchesLocation] City ID check: worker="${workerCityId}" (${worker.city}) vs selected="${selectedCityIdStr}" (${selectedCity.name})`);
	  
      // Normalize for comparison (remove extra spaces, handle variations)
      //const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
      //const workerCityNormalized = normalize(workerCity);
      //const selectedCityNameNormalized = normalize(selectedCityName);
      
      
    }
  }
  
  return true;
};*/
/*const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  console.log('📍 [matchesLocation] Starting location check:', {
    filterCountryId: countryId,
    filterStateId: stateId,
    filterCityId: cityId,
    workerCountryId: worker.countryId,
    workerStateId: worker.stateId,
    workerCityId: worker.cityId,
    workerName: worker.name
  });
  
  // 1. COUNTRY CHECK - Compare IDs directly
  const workerCountryId = worker.countryId ? worker.countryId.toString() : '';
  const filterCountryId = countryId.toString();
  
  if (workerCountryId !== filterCountryId) {
    console.log(`📍 [matchesLocation] Country ID mismatch: worker="${workerCountryId}" vs filter="${filterCountryId}"`);
    return false;
  }
  
  console.log(`📍 [matchesLocation] Country match: ${workerCountryId} = ${filterCountryId}`);
  
  // 2. STATE CHECK - Only if state filter is specified
  if (stateId && stateId !== "all") {
    const workerStateId = worker.stateId ? worker.stateId.toString() : '';
    const filterStateId = stateId.toString();
    
    // If worker has no stateId but filter does, it doesn't match
    if (!workerStateId || workerStateId !== filterStateId) {
      console.log(`📍 [matchesLocation] State ID mismatch or missing: worker="${workerStateId}" vs filter="${filterStateId}"`);
      return false;
    }
    
    console.log(`📍 [matchesLocation] State match: ${workerStateId} = ${filterStateId}`);
  }
  
  // 3. CITY CHECK - Only if city filter is specified
  if (cityId && cityId !== "all") {
    const workerCityId = worker.cityId ? worker.cityId.toString() : '';
    const filterCityId = cityId.toString();
    
    // If worker has no cityId but filter does, it doesn't match
    if (!workerCityId || workerCityId !== filterCityId) {
      console.log(`📍 [matchesLocation] City ID mismatch or missing: worker="${workerCityId}" vs filter="${filterCityId}"`);
      return false;
    }
    
    console.log(`📍 [matchesLocation] City match: ${workerCityId} = ${filterCityId}`);
  }
  
  console.log('📍 [matchesLocation] All location checks passed for worker:', worker.name);
  return true;
};*/

const matchesLocation = (
  worker: WorkerProfile, 
  countryId: string | undefined, 
  stateId: string | undefined, 
  cityId: string | undefined,
  locationData: { countries: any[], states: any[], cities: any[] }
): boolean => {
  // If no location filters are set, match all
  if (!countryId || countryId === "all") return true;
  
  console.log('📍 [matchesLocation] Starting location check:', {
    filterCountryId: countryId,
    filterStateId: stateId,
    filterCityId: cityId,
    workerCountry: worker.country,
    workerState: worker.state,
    workerCity: worker.city,
    workerName: worker.name
  });
  
  // 1. Get the filter country name from the ID
  const selectedCountry = locationData.countries?.find(c => 
    c.id?.toString() === countryId?.toString()
  );
  
  if (!selectedCountry) {
    console.log('📍 [matchesLocation] No country found for ID:', countryId);
    return true; // Don't filter if we can't find the country
  }
  
  // Compare country NAMES (since workers don't have IDs)
  const workerCountryName = worker.country ? worker.country.toLowerCase().trim() : '';
  const filterCountryName = selectedCountry.name ? selectedCountry.name.toLowerCase().trim() : '';
  
  console.log(`📍 [matchesLocation] Country check: worker="${workerCountryName}" vs filter="${filterCountryName}"`);
  
  if (workerCountryName !== filterCountryName) {
    console.log(`📍 [matchesLocation] Country mismatch: "${workerCountryName}" vs "${filterCountryName}"`);
    return false;
  }
  
  console.log(`📍 [matchesLocation] Country match: "${workerCountryName}" = "${filterCountryName}"`);
  
  // 2. STATE CHECK - Only if state filter is specified
  if (stateId && stateId !== "all") {
    const selectedState = locationData.states?.find(s => 
      s.id?.toString() === stateId?.toString()
    );
    
    if (selectedState) {
      const workerStateName = worker.state ? worker.state.toLowerCase().trim() : '';
      const filterStateName = selectedState.name ? selectedState.name.toLowerCase().trim() : '';
      
      console.log(`📍 [matchesLocation] State check: worker="${workerStateName}" vs filter="${filterStateName}"`);
      
      if (workerStateName !== filterStateName) {
        console.log(`📍 [matchesLocation] State mismatch: "${workerStateName}" vs "${filterStateName}"`);
        return false;
      }
      
      console.log(`📍 [matchesLocation] State match: "${workerStateName}" = "${filterStateName}"`);
    }
  }
  
  // 3. CITY CHECK - Only if city filter is specified
  if (cityId && cityId !== "all") {
    const selectedCity = locationData.cities?.find(c => 
      c.id?.toString() === cityId?.toString()
    );
    
    if (selectedCity) {
      const workerCityName = worker.city ? worker.city.toLowerCase().trim() : '';
      const filterCityName = selectedCity.name ? selectedCity.name.toLowerCase().trim() : '';
      
      console.log(`📍 [matchesLocation] City check: worker="${workerCityName}" vs filter="${filterCityName}"`);
      
      if (workerCityName !== filterCityName) {
        console.log(`📍 [matchesLocation] City mismatch: "${workerCityName}" vs "${filterCityName}"`);
        return false;
      }
      
      console.log(`📍 [matchesLocation] City match: "${workerCityName}" = "${filterCityName}"`);
    }
  }
  
  console.log('📍 [matchesLocation] All location checks passed for worker:', worker.name);
  return true;
};



export const filterWorkers = (
  workers: WorkerProfile[], 
  filters: FilterOptions,
  locationData: { countries: any[], states: any[], cities: any[] } = { countries: [], states: [], cities: [] }
) => {
  console.log('🔍 [filterWorkers] Starting filter with:', {
    workerCount: workers?.length || 0,
    filters: {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating
    },
    locationData: {
      countriesCount: locationData.countries?.length || 0,
      statesCount: locationData.states?.length || 0,
      citiesCount: locationData.cities?.length || 0
    }
  });
  
  if (!workers || !Array.isArray(workers)) {
    console.error('❌ [filterWorkers] workers is not an array:', workers);
    return [];
  }
  
  const filtered = workers.filter((worker) => {
    // 1. Search term filter
    const matchesSearch = filters.searchTerm === "" ||
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (worker.description && worker.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      worker.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      worker.category === filters.selectedCategory;
    
    // 3. Price filter
    const matchesPrice = worker.hourly_rate >= filters.minPrice && 
      (filters.maxPrice === 0 || worker.hourly_rate <= filters.maxPrice);
    
    // 4. Experience filter
    const matchesExperience = worker.years_of_experience >= filters.minExperience && 
      worker.years_of_experience <= filters.maxExperience;
    
    // 5. Rating filter
    const matchesRating = worker.average_rating >= filters.minRating;
    
    // 6. Certification filter
    const matchesCertification = !filters.requireCertification || 
      (worker.certifications && worker.certifications.length > 0);
    
    // 7. Warranty filter
    const matchesWarranty = !filters.requireWarranty || worker.offers_warranty;
    
    // 8. Location filter
    const matchesLocationFilter = matchesLocation(
      worker, 
      filters.selectedCountry, 
      filters.selectedState, 
      filters.selectedCity,
      locationData
    );
    
    const shouldInclude = matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesExperience && 
           matchesRating && 
           matchesCertification && 
           matchesWarranty &&
           matchesLocationFilter;
    
    // Debug logging for location mismatches
    if (!matchesLocationFilter && worker && worker.name) {
      console.log(`📍 [filterWorkers] Location filter excluded "${worker.name}"`, {
        workerLocation: {
          country: worker.country,
          state: worker.state,
          city: worker.city
        },
        filterLocation: {
          country: filters.selectedCountry,
          state: filters.selectedState,
          city: filters.selectedCity
        }
      });
    }
    
    return shouldInclude;
  });
  
  console.log(`✅ [filterWorkers] Filtered ${workers.length} → ${filtered.length} workers`);
  return filtered;
};