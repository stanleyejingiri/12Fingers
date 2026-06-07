//src/components/WorkerList.tsx
/*import { SearchFilters } from "./SearchFilters";
import { useWorkersFilters } from "@/hooks/useWorkersFilters";
import { useLocation } from "@/hooks/useLocation";
import { useWorkers } from "@/hooks/useWorkers";
import { SortOption } from "@/types/worker";
import { WorkersListContent } from "./workers/WorkersListContent";
import { WorkersLoadingState } from "./WorkersLoadingState";
import { Alert, AlertDescription } from "./ui/alert";
import { MapPin, X } from "lucide-react";
import { Button } from "./ui/button";
import { useFavorites } from "@/hooks/useFavorites"; // Add this import


export const WorkersList = () => {
  const { userLocation, error: locationError } = useLocation();
  const { 
    data: workers, 
    isLoading: isLoadingWorkers, 
    error: workersError,
    refetch 
  } = useWorkers();
  const { filters, setters } = useWorkersFilters();
  const [showLocationError, setShowLocationError] = useState(true);
  const { toggleFavorite, checkFavorite } = useFavorites(); // Add favorites hook
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  // Add console logs for debugging
  console.log('Workers data:', workers);
  console.log('Loading state:', isLoadingWorkers);
  console.log('Workers error:', workersError);
  console.log('Location error:', locationError);
  console.log('User location:', userLocation);

  // Check favorites for all workers when workers data changes
  useEffect(() => {
    const checkAllFavorites = async () => {
      if (!workers || workers.length === 0) return;
      
      const newFavoritesMap: Record<string, boolean> = {};
      
      // Check favorites for each worker
      for (const worker of workers) {
        const isFavorite = await checkFavorite(worker.id);
        newFavoritesMap[worker.id] = isFavorite;
      }
      
      setFavoritesMap(newFavoritesMap);
    };

    if (workers && workers.length > 0) {
      checkAllFavorites();
    }
  }, [workers, checkFavorite]);

  // Handle favorite toggle
  const handleToggleFavorite = async (workerId: string) => {
    console.log('🟧 handleToggleFavorite called with:', workerId);
    
    const result = await toggleFavorite(workerId);
    if (result.success) {
      // Update local state immediately for better UX
      setFavoritesMap(prev => ({
        ...prev,
        [workerId]: result.is_favorite
      }));
    }
  };

  // If workers are loading, show loading state
  if (isLoadingWorkers) {
    return <WorkersLoadingState isLoading={true} error={null} onRetry={refetch} />;
  }

  // If there's an error loading workers, show error state with retry option
  if (workersError) {
    return <WorkersLoadingState 
      isLoading={false} 
      error={workersError as Error} 
      onRetry={refetch}
    />;
  }

	// Add this debug logging right before return statement:
	console.log('🔍 DEBUG - Current filters in WorkerList:', {
	  selectedCountry: filters.selectedCountry,
	  selectedState: filters.selectedState,
	  selectedCity: filters.selectedCity,
	  allFilters: filters
	});

  return (
    <div className="space-y-6">
      {locationError && showLocationError && (
        <Alert variant="default" className="mb-4 relative">
          <MapPin className="h-4 w-4" />
          <AlertDescription className="pr-8">
            {locationError}. Some features may be limited.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 p-0"
            onClick={() => setShowLocationError(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </Alert>
      )}

      <SearchFilters />
      
	  // Add this RIGHT BEFORE the WorkersListContent component
		console.log('🎯 [WorkerList] DEBUG - Filters being passed:', {
		  selectedCountry: filters.selectedCountry, // Should be '1'
		  selectedState: filters.selectedState,     // Should be '6'
		  selectedCity: filters.selectedCity,       // Should be ''
		  allFilters: filters
		});
	  
      <WorkersListContent
        workers={workers || []}
        filters={{
          ...filters,
          // Ensure location filters exist with fallbacks
          selectedCountry: filters.selectedCountry || "",
          selectedState: filters.selectedState || "",
          selectedCity: filters.selectedCity || ""
        }}
        userLocation={userLocation}
        isLoadingWorkers={isLoadingWorkers}
        setPage={setters.setPage}
        favoritesMap={favoritesMap}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};*/

//src/components/WorkersList.tsx
import React, { useState, useEffect } from "react";
import { SearchFilters } from "./SearchFilters";
import { useWorkersFilters } from "@/hooks/useWorkersFilters";
import { useLocation } from "@/hooks/useLocation";
import { useWorkers } from "@/hooks/useWorkers";
import { WorkersListContent } from "./workers/WorkersListContent";
import { WorkersLoadingState } from "./WorkersLoadingState";
import { Alert, AlertDescription } from "./ui/alert";
import { MapPin, X } from "lucide-react";
import { Button } from "./ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useUserLocation } from "@/hooks/useUserLocation";
import { MobileFiltersSheet } from "./filters/MobileFiltersSheet";

interface WorkersListProps {
  isMobileFiltersOpen?: boolean;
  onMobileFiltersToggle?: () => void;
}

export const WorkersList = ({ 
  isMobileFiltersOpen = false,
  onMobileFiltersToggle = () => {}
}: WorkersListProps) => {
  const { userLocation, error: locationError } = useLocation();
  const { 
    data: workers, 
    isLoading: isLoadingWorkers, 
    error: workersError,
    refetch 
  } = useWorkers();
  const { filters, setters } = useWorkersFilters();
  const [showLocationNotification, setShowLocationNotification] = useState(true); // CHANGED NAME
  const { toggleFavorite, checkFavorite } = useFavorites();
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // ✅ State for location hierarchy data (database-driven)
  const [locationsData, setLocationsData] = useState<Record<string, Record<string, string[]>>>({});
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  
  // ✅ SIMPLE: Use our new location hook
  const { location: userDetectedLocation, loading: locationLoading } = useUserLocation();

  // ✅ Fetch location hierarchy from database
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setIsLoadingLocations(true);
        const response = await fetch('/api/locations/hierarchy');
        
        if (!response.ok) {
          console.warn('Failed to fetch location hierarchy');
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.hierarchy) {
          console.log('✅ Location hierarchy loaded:', data.hierarchy.length, 'countries');
          
          // Convert hierarchy to the format expected by LocationSelector
          const locationsMap: Record<string, Record<string, string[]>> = {};
          
          data.hierarchy.forEach((country: any) => {
            const countryKey = country.id.toString();
            locationsMap[countryKey] = {};
            
            country.states?.forEach((state: any) => {
              const stateKey = state.id.toString();
              locationsMap[countryKey][stateKey] = state.cities?.map((city: any) => city.name) || [];
            });
          });
          
          setLocationsData(locationsMap);
        }
      } catch (error) {
        console.error('Error fetching location hierarchy:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    
    fetchLocationHierarchy();
  }, []);

  // Debug logging
  console.log('🔴 WORKERS LIST RENDERED');
  console.log('📍 User detected location:', userDetectedLocation);
  console.log('📍 Location loading:', locationLoading);
  console.log('📍 Locations data loaded:', Object.keys(locationsData).length, 'countries');
  console.log('📍 Show notification:', showLocationNotification); // ADDED LOG

  // Check favorites for all workers when workers data changes
  useEffect(() => {
    const checkAllFavorites = async () => {
      if (!workers || workers.length === 0) return;
      
      const newFavoritesMap: Record<string, boolean> = {};
      
      // Check favorites for each worker
      for (const worker of workers) {
        const isFavorite = await checkFavorite(worker.id);
        newFavoritesMap[worker.id] = isFavorite;
      }
      
      setFavoritesMap(newFavoritesMap);
    };

    if (workers && workers.length > 0) {
      checkAllFavorites();
    }
  }, [workers, checkFavorite]);

  // Handle favorite toggle
  const handleToggleFavorite = async (workerId: string) => {
    console.log('🟧 handleToggleFavorite called with:', workerId);
    
    const result = await toggleFavorite(workerId);
    if (result.success) {
      // Update local state immediately for better UX
      setFavoritesMap(prev => ({
        ...prev,
        [workerId]: result.is_favorite
      }));
    }
  };

  // Handle location reset
  const handleResetLocation = () => {
    setters.setSelectedCountry("all");
    setters.setSelectedState("all");
    setters.setSelectedCity("all");
  };

  // If workers are loading, show loading state
  if (isLoadingWorkers) {
    return <WorkersLoadingState isLoading={true} error={null} onRetry={refetch} />;
  }

  // If there's an error loading workers, show error state with retry option
  if (workersError) {
    return <WorkersLoadingState 
      isLoading={false} 
      error={workersError as Error} 
      onRetry={refetch}
    />;
  }

  return (
    <div className="space-y-6">
       {/* ✅ AREA 1: LOCATION NOTIFICATION--was removed */}
     {/* ✅ AREA 2: SEARCH FILTERS (DESKTOP ONLY) */}
      <div className="hidden md:block">
        <SearchFilters 
          filters={filters}
          setters={setters}
          locations={locationsData} // Pass database-driven locations
          onResetLocation={handleResetLocation}
        />
      </div>
      
      {/* ✅ AREA 3: MOBILE FILTERS SHEET */}
      <MobileFiltersSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => onMobileFiltersToggle()}
        selectedCountry={filters.selectedCountry}
        selectedState={filters.selectedState}
        selectedCity={filters.selectedCity}
        onCountryChange={setters.setSelectedCountry}
        onStateChange={setters.setSelectedState}
        onCityChange={setters.setSelectedCity}
        locations={locationsData} // Pass database-driven locations
        onResetLocation={handleResetLocation}
        searchTerm={filters.searchTerm}
        onSearchChange={setters.setSearchTerm}
        showAdvancedFilters={showAdvancedFilters}
        onAdvancedFiltersClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        filters={filters}
        setters={setters}
        userLocation={userLocation}
      />
      
      {/* ✅ AREA 4: WORKER LISTING */}
      <WorkersListContent
		  workers={workers || []}
		  filters={filters}
		  userLocation={userLocation}
		  isLoadingWorkers={isLoadingWorkers}
		  setPage={setters.setPage}
		  favoritesMap={favoritesMap}
		  onToggleFavorite={handleToggleFavorite}
		/>

	</div>
  );
};

