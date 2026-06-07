//src/components/filters/sections/AdvancedFiltersSection.tsx
/*import { AdvancedFiltersContent } from "../AdvancedFiltersContent";
import { AdvancedFiltersToggle } from "../AdvancedFiltersToggle";
import { WorkersSortControls } from "../../workers/WorkersSortControls";
import { LocationSelector } from "../../LocationSelector";
import { useState } from "react";
import { SortOption } from "@/types/worker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface AdvancedFiltersSectionProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
  userLocation: [number, number] | null;
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
  sortBy: SortOption;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export const AdvancedFiltersSection = ({
  minPrice,
  maxPrice,
  onPriceChange,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  minExperience,
  maxExperience,
  onExperienceChange,
  minRating,
  onRatingChange,
  requireCertification,
  onRequireCertificationChange,
  requireWarranty,
  onRequireWarrantyChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  isOpen, // Add this prop
  onToggle, // Add this prop
}: AdvancedFiltersSectionProps) => {
	console.log('🔍 [AdvancedFiltersSection] RENDERED with props:', {
    selectedCountry,
    selectedState,
    selectedCity,
    timestamp: new Date().toISOString()
  });
  
  //const [isOpen, setIsOpen] = useState(false);

  console.log('🔍 [AdvancedFiltersSection] Location props:', {
    selectedCountry,
    selectedState,
    selectedCity
  });

  return (
    <div>
      <AdvancedFiltersToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="mt-4 space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <LocationSelector
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              selectedCity={selectedCity}
              onCountryChange={onCountryChange}
              onStateChange={onStateChange}
              onCityChange={onCityChange}
              showLabels={true}
            />
          </div>
          
          <WorkersSortControls 
            sortBy={sortBy} 
            onSortChange={onSortChange} 
          />
          <AdvancedFiltersContent
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
            maxDistance={maxDistance}
            onMaxDistanceChange={onMaxDistanceChange}
            userLocation={userLocation}
            minExperience={minExperience}
            maxExperience={maxExperience}
            onExperienceChange={onExperienceChange}
            minRating={minRating}
            onRatingChange={onRatingChange}
            requireCertification={requireCertification}
            onRequireCertificationChange={onRequireCertificationChange}
            requireWarranty={requireWarranty}
            onRequireWarrantyChange={onRequireWarrantyChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      )}
      <div className="pt-4 border-t border-gray-200">
        <Button 
          onClick={() => {
            console.log('🔍 Applying filters...');
            setIsOpen(false);
          }}
          className="w-full"
        >
          <Search className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};*/
//src/components/filters/sections/AdvancedFiltersSection.tsx
import { AdvancedFiltersContent } from "../AdvancedFiltersContent";
import { AdvancedFiltersToggle } from "../AdvancedFiltersToggle";
import { WorkersSortControls } from "../../workers/WorkersSortControls";
import { LocationSelector } from "../../LocationSelector";
import { SortOption } from "@/types/worker";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface AdvancedFiltersSectionProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
  userLocation: [number, number] | null;
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  isOpen: boolean; // ADDED: Control from parent
  onToggle: () => void; // ADDED: Toggle from parent
}

export const AdvancedFiltersSection = ({
  minPrice,
  maxPrice,
  onPriceChange,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  minExperience,
  maxExperience,
  onExperienceChange,
  minRating,
  onRatingChange,
  requireCertification,
  onRequireCertificationChange,
  requireWarranty,
  onRequireWarrantyChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  isOpen,
  onToggle,
}: AdvancedFiltersSectionProps) => {
  console.log('🔍 [AdvancedFiltersSection] RENDERED with props:', {
    selectedCountry,
    selectedState,
    selectedCity,
    timestamp: new Date().toISOString()
  });

  console.log('🔍 [AdvancedFiltersSection] Location props:', {
    selectedCountry,
    selectedState,
    selectedCity
  });

  return (
    <div>
      {/* REMOVED: The internal toggle is now handled by parent */}
      {isOpen && (
        <div className="mt-4 space-y-6">
          {/* Location Section */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <LocationSelector
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              selectedCity={selectedCity}
              onCountryChange={onCountryChange}
              onStateChange={onStateChange}
              onCityChange={onCityChange}
              showLabels={true}
            />
          </div>
          
          {/* Advanced Filters Content */}
          <AdvancedFiltersContent
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
            maxDistance={maxDistance}
            onMaxDistanceChange={onMaxDistanceChange}
            userLocation={userLocation}
            minExperience={minExperience}
            maxExperience={maxExperience}
            onExperienceChange={onExperienceChange}
            minRating={minRating}
            onRatingChange={onRatingChange}
            requireCertification={requireCertification}
            onRequireCertificationChange={onRequireCertificationChange}
            requireWarranty={requireWarranty}
            onRequireWarrantyChange={onRequireWarrantyChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      )}
      
      {/* Apply Filters Button */}
      {isOpen && (
        <div className="pt-4 border-t border-gray-200">
          <Button 
            onClick={() => {
              console.log('🔍 Applying filters...');
              onToggle(); // Close the panel after applying
            }}
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};
