//src/components/SearchFilters.tsx - COMPLETE FIXED VERSION
import { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { MainFiltersSection } from "./filters/sections/MainFiltersSection";
import { AdvancedFiltersSection } from "./filters/sections/AdvancedFiltersSection";
import { SortOption } from "@/types/worker";
import { AdvancedFiltersToggle } from "./filters/AdvancedFiltersToggle";

// Define locations type
interface LocationsData {
  [country: string]: {
    [state: string]: string[];
  };
}
// Define the filters and setters types from useWorkersFilters
interface WorkersFilters {
  searchTerm: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  maxDistance: number;
  sortBy: SortOption;
  page: number;
  minExperience: number;
  maxExperience: number;
  minRating: number;
  requireCertification: boolean;
  requireWarranty: boolean;
  viewMode: "grid" | "list";
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}
interface WorkersFiltersSetters {
  setSearchTerm: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setMaxDistance: (value: number) => void;
  setSortBy: (value: SortOption) => void;
  setPage: (value: number) => void;
  setMinExperience: (value: number) => void;
  setMaxExperience: (value: number) => void;
  setMinRating: (value: number) => void;
  setRequireCertification: (value: boolean) => void;
  setRequireWarranty: (value: boolean) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSelectedCountry: (value: string) => void;
  setSelectedState: (value: string) => void;
  setSelectedCity: (value: string) => void;
}
interface SearchFiltersProps {
  filters: WorkersFilters;
  setters: WorkersFiltersSetters;
  locations?: Record<string, Record<string, string[]>>;
  onResetLocation?: () => void;
}
export const SearchFilters = ({ 
  filters, 
  setters,
  locations = {},
  onResetLocation = () => {}
}: SearchFiltersProps) => {
  const { userLocation } = useLocation();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handlePriceChange = (min: number, max: number) => {
    setters.setMinPrice(min);
    setters.setMaxPrice(max);
  };

  const handleExperienceChange = (min: number, max: number) => {
    setters.setMinExperience(min);
    setters.setMaxExperience(max);
  };

  // ADD THESE THREE FUNCTIONS - THEY WERE MISSING!
  const handleCountryChange = (value: string) => {
    console.log('🌍 [SearchFilters] Country changed to:', value);
    setters.setSelectedCountry(value); // This will cascade in useWorkersFilters
    if (value && value !== "all") {
      localStorage.setItem('userManualCountry', value);
    }
  };

  const handleStateChange = (value: string) => {
    console.log('🌍 [SearchFilters] State changed to:', value);
    setters.setSelectedState(value); // This will cascade in useWorkersFilters
  };

  const handleCityChange = (value: string) => {
    console.log('🌍 [SearchFilters] City changed to:', value);
    setters.setSelectedCity(value); // This will cascade in useWorkersFilters
  };

  // Debug: Log current filters and what we're passing
  console.log('🔍 [SearchFilters] Received filters:', {
    country: filters.selectedCountry,
    state: filters.selectedState,
    city: filters.selectedCity,
    fullFilters: filters
  });

  return (
    <div className="space-y-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm p-3">
		<MainFiltersSection
        searchTerm={filters.searchTerm}
        onSearchChange={setters.setSearchTerm}
        selectedCategory={filters.selectedCategory}
        onCategoryChange={setters.setSelectedCategory}
        selectedCountry={filters.selectedCountry}
        selectedState={filters.selectedState}
        selectedCity={filters.selectedCity}
        onCountryChange={handleCountryChange}  // Use the new function
        onStateChange={handleStateChange}      // Use the new function
        onCityChange={handleCityChange}        // Use the new function
        viewMode={filters.viewMode}
        onViewModeChange={setters.setViewMode}
        locations={locations}
        /*onResetLocation={onResetLocation}*/
      />

      <div className="border-t border-gray-200">
        <AdvancedFiltersToggle 
          isOpen={showAdvancedFilters} 
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)} 
        />
        {showAdvancedFilters && (
          <div className="mt-4">
            <AdvancedFiltersSection
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onPriceChange={handlePriceChange}
              minExperience={filters.minExperience}
              maxExperience={filters.maxExperience}
              onExperienceChange={handleExperienceChange}
              maxDistance={filters.maxDistance}
              onMaxDistanceChange={setters.setMaxDistance}
              userLocation={userLocation}
              minRating={filters.minRating}
              onRatingChange={setters.setMinRating}
              requireCertification={filters.requireCertification}
              onRequireCertificationChange={setters.setRequireCertification}
              requireWarranty={filters.requireWarranty}
              onRequireWarrantyChange={setters.setRequireWarranty}
              viewMode={filters.viewMode}
              onViewModeChange={setters.setViewMode}
              selectedCountry={filters.selectedCountry}
              selectedState={filters.selectedState}
              selectedCity={filters.selectedCity}
              onCountryChange={handleCountryChange}  // Use the new function
              onStateChange={handleStateChange}      // Use the new function
              onCityChange={handleCityChange}        // Use the new function
              isOpen={showAdvancedFilters}
              onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
