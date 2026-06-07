/*import { WorkerProfile, SortOption } from "@/types/worker";
import { PaginatedWorkers } from "../PaginatedWorkers";
import { filterWorkers } from "@/utils/workerFiltering";
import { sortWorkers } from "@/utils/workerSorting";
import { useLocationData } from '@/hooks/useLocationData';

interface WorkersListContentProps {
  workers: WorkerProfile[] | undefined;
  filters: {
    searchTerm: string;
    selectedCategory: string;
    minPrice: number;
    maxPrice: number;
    minExperience: number;
    maxExperience: number;
    minRating: number;
    requireCertification: boolean;
    requireWarranty: boolean;
    sortBy: SortOption;
    page: number;
    selectedCountry: string;  // CHANGED: Required, not optional
    selectedState: string;    // CHANGED: Required, not optional
    selectedCity: string;     // CHANGED: Required, not optional
  };
  userLocation: [number, number] | null;
  isLoadingWorkers: boolean;
  setPage: (page: number) => void;
  favoritesMap: Record<string, boolean>;
  onToggleFavorite: (workerId: string) => void;
}

export const WorkersListContent = ({
  workers,
  filters,
  userLocation,
  isLoadingWorkers,
  setPage,
  favoritesMap,
  onToggleFavorite,
}: WorkersListContentProps) => {
  const { countries, states, cities } = useLocationData();
  
  // DEBUG: Check what props we're actually getting
  console.log('🔵 [DEBUG] WorkersListContent - ALL PROPS:', {
    workersCount: workers?.length || 0,
    filters: filters,
    userLocation: userLocation,
    isLoadingWorkers: isLoadingWorkers
  });

  // Specifically check for location filters:
  console.log('🔵 [DEBUG] Location filters check:', {
    hasSelectedCountry: !!filters.selectedCountry,
    selectedCountryValue: filters.selectedCountry,
    hasSelectedState: !!filters.selectedState,
    selectedStateValue: filters.selectedState,
    hasSelectedCity: !!filters.selectedCity,
    selectedCityValue: filters.selectedCity
  });

  // Track when filters change
  React.useEffect(() => {
    console.log('🎯 [EFFECT] Filters changed:', {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity
    });
  }, [filters.selectedCountry, filters.selectedState, filters.selectedCity]);

  const filteredWorkers = React.useMemo(() => {
    if (!workers || isLoadingWorkers) {
      console.log('⏸️ [DEBUG] No workers or loading');
      return [];
    }
    
    console.log('🔴 [DEBUG] Filtering triggered with:', {
      selectedCountry: filters.selectedCountry,
      selectedState: filters.selectedState,
      selectedCity: filters.selectedCity,
      locationData: {
        countries: countries.map(c => ({id: c.id, name: c.name})),
        states: states.map(s => ({id: s.id, name: s.name})),
        cities: cities.map(c => ({id: c.id, name: c.name}))
      }
    });
    
    const filtered = filterWorkers(workers, {
      searchTerm: filters.searchTerm,
      selectedCategory: filters.selectedCategory,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minExperience: filters.minExperience,
      maxExperience: filters.maxExperience,
      minRating: filters.minRating,
      requireCertification: filters.requireCertification,
      requireWarranty: filters.requireWarranty,
      selectedCountry: filters.selectedCountry,
      selectedState: filters.selectedState,
      selectedCity: filters.selectedCity,
    }, { countries, states, cities });
    
    console.log(`✅ [DEBUG] Filtered ${workers.length} → ${filtered.length} workers`);
    console.log('✅ [DEBUG] Remaining workers:', filtered.map(w => w.name));
    
    const sorted = sortWorkers(filtered, filters.sortBy, userLocation);
    return sorted;
  }, [workers, filters, userLocation, isLoadingWorkers, countries, states, cities]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / itemsPerPage));

  // Reset to page 1 when filters change
  React.useEffect(() => {
    if (filters.page > totalPages) {
      setPage(1);
    }
  }, [totalPages, filters.page, setPage, filteredWorkers.length]);

  return (
    <>
  
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
        <button 
          onClick={() => {
            console.log('🧪 [TEST] Manual debug check');
            console.log('🧪 Current filters:', filters);
            console.log('🧪 Location data:', { 
              countries: countries.map(c => ({id: c.id, name: c.name, code: c.code})),
              states: states.map(s => ({id: s.id, name: s.name})),
              cities: cities.map(c => ({id: c.id, name: c.name}))
            });
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Debug Filters
        </button>
      </div>
      
      <PaginatedWorkers 
        workers={filteredWorkers}
        currentPage={filters.page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        userLocation={userLocation}
        isLoading={isLoadingWorkers}
        onPageChange={setPage}
        favoritesMap={favoritesMap}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
};*/


//src/components/workers/WorkerListContent.tsx
/*import React from "react";
import { WorkerProfile, SortOption } from "@/types/worker";
import { PaginatedWorkers } from "../PaginatedWorkers";
import { filterWorkers } from "@/utils/workerFiltering";
import { sortWorkers } from "@/utils/workerSorting";
import { useLocationData } from '@/hooks/useLocationData';

interface WorkersListContentProps {
  workers: WorkerProfile[] | undefined;
  filters: {
    searchTerm: string;
    selectedCategory: string;
    minPrice: number;
    maxPrice: number;
    minExperience: number;
    maxExperience: number;
    minRating: number;
    requireCertification: boolean;
    requireWarranty: boolean;
    sortBy: SortOption;
    page: number;
    selectedCountry: string;
    selectedState: string;
    selectedCity: string;
  };
  userLocation: [number, number] | null;
  isLoadingWorkers: boolean;
  setPage: (page: number) => void;
  favoritesMap: Record<string, boolean>;
  onToggleFavorite: (workerId: string) => void;
}

export const WorkersListContent = ({
  workers,
  filters,
  userLocation,
  isLoadingWorkers,
  setPage,
  favoritesMap,
  onToggleFavorite,
}: WorkersListContentProps) => {
	// ADD THIS AT THE TOP:
  console.log('🚨🚨🚨 WORKERS LIST CONTENT RENDERED 🚨🚨🚨');
  console.log('Selected Country:', filters.selectedCountry);
  console.log('Selected State:', filters.selectedState);
  console.log('Selected City:', filters.selectedCity);
  console.log('All filters:', filters);
  
  
  const { countries, states, cities } = useLocationData(
  filters.selectedCountry,  // Pass country ID
  filters.selectedState     // Pass state ID
  );
  // Add debug to check
console.log('📍 [WorkersListContent] Location data loaded:', {
  countries: countries.length,
  states: states.length,
  cities: cities.length,
  selectedCountry: filters.selectedCountry,
  selectedState: filters.selectedState
});


  // DEBUG: Check what props we're actually getting
  console.log('🔵 [DEBUG] WorkersListContent - ALL PROPS:', {
    workersCount: workers?.length || 0,
    filters: filters,
    userLocation: userLocation,
    isLoadingWorkers: isLoadingWorkers
  });

  // Specifically check for location filters:
  console.log('🔵 [DEBUG] Location filters check:', {
    hasSelectedCountry: !!filters.selectedCountry,
    selectedCountryValue: filters.selectedCountry,
    hasSelectedState: !!filters.selectedState,
    selectedStateValue: filters.selectedState,
    hasSelectedCity: !!filters.selectedCity,
    selectedCityValue: filters.selectedCity
  });

  // Track when filters change
  React.useEffect(() => {
    console.log('🎯 [EFFECT] Filters changed:', {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity
    });
  }, [filters.selectedCountry, filters.selectedState, filters.selectedCity]);

  const filteredWorkers = React.useMemo(() => {
    if (!workers || isLoadingWorkers) {
      console.log('⏸️ [DEBUG] No workers or loading');
      return [];
    }
    
    console.log('🔴 [DEBUG] Filtering triggered with:', {
      selectedCountry: filters.selectedCountry,
      selectedState: filters.selectedState,
      selectedCity: filters.selectedCity,
      locationData: {
        countries: countries.map(c => ({id: c.id, name: c.name})),
        states: states.map(s => ({id: s.id, name: s.name})),
        cities: cities.map(c => ({id: c.id, name: c.name}))
      }
    });
    
    const filtered = filterWorkers(workers, {
      searchTerm: filters.searchTerm,
      selectedCategory: filters.selectedCategory,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minExperience: filters.minExperience,
      maxExperience: filters.maxExperience,
      minRating: filters.minRating,
      requireCertification: filters.requireCertification,
      requireWarranty: filters.requireWarranty,
      selectedCountry: filters.selectedCountry,
      selectedState: filters.selectedState,
      selectedCity: filters.selectedCity,
    }, { countries, states, cities });
    
    console.log(`✅ [DEBUG] Filtered ${workers.length} → ${filtered.length} workers`);
    console.log('✅ [DEBUG] Remaining workers:', filtered.map(w => w.name));
    
    //const sorted = sortWorkers(filtered, filters.sortBy, userLocation);
	const sorted = sortWorkers(filtered, "rating", userLocation);
    return sorted;
  }, [workers, filters, userLocation, isLoadingWorkers, countries, states, cities]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / itemsPerPage));

  // Reset to page 1 when filters change
  React.useEffect(() => {
    if (filters.page > totalPages) {
      setPage(1);
    }
  }, [totalPages, filters.page, setPage, filteredWorkers.length]);

  return (
    <>
      // TEMPORARY TEST BUTTON 
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
       	<button 
		  onClick={() => {
			console.log('🧪 MANUAL FILTER TEST');
			
			console.log('Available data:', {
			  filters: filters, // SHOW ALL FILTERS
			  countries: countries.map(c => ({id: c.id, name: c.name})),
			  states: states.map(s => ({id: s.id, name: s.name})),
			  cities: cities.map(c => ({id: c.id, name: c.name}))
			});
			
			// Get country/state names from IDs
			const countryName = countries.find(c => c.id === Number(filters.selectedCountry))?.name;
			const stateName = states.find(s => s.id === Number(filters.selectedState))?.name;
			
			console.log('Looking for:', {
			  countryName,
			  stateName,
			  countryId: filters.selectedCountry,
			  stateId: filters.selectedState,
			  filtersObject: filters // LOG THE ENTIRE FILTERS OBJECT
			});
			
			// Manual filter
			const filtered = workers?.filter(w => {
			  console.log(`Checking ${w.name}:`, {
				workerCountry: w.country,
				workerState: w.state,
				matchesCountry: w.country === countryName,
				matchesState: w.state === stateName
			  });
			  
			  if (countryName && w.country !== countryName) return false;
			  if (stateName && w.state !== stateName) return false;
			  return true;
			});
			
			console.log('Result:', filtered?.map(w => w.name));
		  }}
		  className="px-4 py-2 bg-green-500 text-white rounded"
		>
		  Test Filter Manually
		</button>
      </div>
      
      <PaginatedWorkers 
        workers={filteredWorkers}
        currentPage={filters.page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        userLocation={userLocation}
        isLoading={isLoadingWorkers}
        onPageChange={setPage}
        favoritesMap={favoritesMap}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
};*/

//src/components/workers/WorkersListContent.tsx
import React from "react";
import { WorkerProfile, SortOption } from "@/types/worker";
import { PaginatedWorkers } from "../PaginatedWorkers";
import { filterWorkers } from "@/utils/workerFiltering";
import { sortWorkers } from "@/utils/workerSorting";
import { useLocationData } from '@/hooks/useLocationData';

interface WorkersListContentProps {
  workers: WorkerProfile[] | undefined;
  filters: {
    searchTerm: string;
    selectedCategory: string;
    minPrice: number;
    maxPrice: number;
    minExperience: number;
    maxExperience: number;
    minRating: number;
    requireCertification: boolean;
    requireWarranty: boolean;
    sortBy: SortOption;
    page: number;
    selectedCountry: string;
    selectedState: string;
    selectedCity: string;
  };
  userLocation: [number, number] | null;
  isLoadingWorkers: boolean;
  setPage: (page: number) => void;
  favoritesMap: Record<string, boolean>;
  onToggleFavorite: (workerId: string) => void;
}

export const WorkersListContent = ({
  workers,
  filters,
  userLocation,
  isLoadingWorkers,
  setPage,
  favoritesMap,
  onToggleFavorite,
}: WorkersListContentProps) => {
  console.log('🚨🚨🚨 WORKERS LIST CONTENT RENDERED 🚨🚨🚨');
  console.log('Selected Country:', filters.selectedCountry);
  console.log('Selected State:', filters.selectedState);
  console.log('Selected City:', filters.selectedCity);
  console.log('All filters:', filters);
   console.log('Selected Country in filters:', filters.selectedCountry); // Add this
  
  const { countries, states, cities } = useLocationData(
    filters.selectedCountry,
    filters.selectedState
  );
  
  console.log('📍 [WorkersListContent] Location data loaded:', {
    countries: countries.length,
    states: states.length,
    cities: cities.length,
    selectedCountry: filters.selectedCountry,
    selectedState: filters.selectedState
  });

  console.log('🔵 [DEBUG] WorkersListContent - ALL PROPS:', {
    workersCount: workers?.length || 0,
    filters: filters,
    userLocation: userLocation,
    isLoadingWorkers: isLoadingWorkers
  });

  console.log('🔵 [DEBUG] Location filters check:', {
    hasSelectedCountry: !!filters.selectedCountry,
    selectedCountryValue: filters.selectedCountry,
    hasSelectedState: !!filters.selectedState,
    selectedStateValue: filters.selectedState,
    hasSelectedCity: !!filters.selectedCity,
    selectedCityValue: filters.selectedCity
  });

  React.useEffect(() => {
    console.log('🎯 [EFFECT] Filters changed:', {
      country: filters.selectedCountry,
      state: filters.selectedState,
      city: filters.selectedCity
    });
  }, [filters.selectedCountry, filters.selectedState, filters.selectedCity]);

  const filteredWorkers = React.useMemo(() => {
    if (!workers || isLoadingWorkers) {
      console.log('⏸️ [DEBUG] No workers or loading');
      return [];
    }
    
    console.log('🔴 [DEBUG] Filtering triggered with:', {
      selectedCountry: filters.selectedCountry,
      selectedState: filters.selectedState,
      selectedCity: filters.selectedCity,
      locationData: {
        countries: countries.map(c => ({id: c.id, name: c.name})),
        states: states.map(s => ({id: s.id, name: s.name})),
        cities: cities.map(c => ({id: c.id, name: c.name}))
      }
    });
    
    const filtered = filterWorkers(workers, {
      searchTerm: filters.searchTerm,
      selectedCategory: filters.selectedCategory,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minExperience: filters.minExperience,
      maxExperience: filters.maxExperience,
      minRating: filters.minRating,
      requireCertification: filters.requireCertification,
      requireWarranty: filters.requireWarranty,
      selectedCountry: filters.selectedCountry,
      selectedState: filters.selectedState,
      selectedCity: filters.selectedCity,
    }, { 
      countries: countries,
      states: states,
      cities: cities
    });
    
    // ADDED: Debug after filtering to see what happened
    console.log('🔍 [WorkersListContent] Filtering debug:', {
      selectedCountryId: filters.selectedCountry,
      selectedStateId: filters.selectedState,
      selectedCityId: filters.selectedCity,
      countriesData: countries.map(c => ({ id: c.id, name: c.name })),
      statesData: states.map(s => ({ id: s.id, name: s.name })),
      citiesData: cities.map(c => ({ id: c.id, name: c.name })),
      filteredCount: filtered.length,
      allWorkers: workers.map(w => ({
        name: w.name,
        country: w.country,
        state: w.state,
        city: w.city
      }))
    });
    
    console.log(`✅ [DEBUG] Filtered ${workers.length} → ${filtered.length} workers`);
    console.log('✅ [DEBUG] Remaining workers:', filtered.map(w => w.name));
    
    const sorted = sortWorkers(filtered, "rating", userLocation);
    return sorted;
  }, [workers, filters, userLocation, isLoadingWorkers, countries, states, cities]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / itemsPerPage));

  React.useEffect(() => {
    if (filters.page > totalPages) {
      setPage(1);
    }
  }, [totalPages, filters.page, setPage, filteredWorkers.length]);

  return (
    <>
      {/* TEMPORARY TEST BUTTON - REMOVE AFTER FIX IS CONFIRMED---Removed */}
      
      {/* TPAGINATED WORKERS */}
      <PaginatedWorkers 
        workers={filteredWorkers}
        currentPage={filters.page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        userLocation={userLocation}
        isLoading={isLoadingWorkers}
        onPageChange={setPage}
        favoritesMap={favoritesMap}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
};

