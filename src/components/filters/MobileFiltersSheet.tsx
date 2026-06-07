// src/components/filters/MobileFiltersSheet.tsx
/*import React from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LocationSelector } from "../LocationSelector";
import { SearchInput } from "./SearchInput";

interface MobileFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // Location props
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  locations: any;
  onResetLocation: () => void;
  // Search props
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // Advanced filters
  showAdvancedFilters: boolean;
  onAdvancedFiltersClick: () => void;
}

export const MobileFiltersSheet = ({
  isOpen,
  onClose,
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  locations,
  onResetLocation,
  searchTerm,
  onSearchChange,
  showAdvancedFilters,
  onAdvancedFiltersClick,
}: MobileFiltersSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Find Workers"
      showAdvancedFilters={showAdvancedFilters}
      onAdvancedFiltersClick={onAdvancedFiltersClick}
    >
      <div className="space-y-6">
        // Location Section 
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Location</h3>
            {(selectedCountry !== "all" || selectedState !== "all" || selectedCity !== "all") && (
              <button
                type="button"
                onClick={onResetLocation}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="border rounded-lg p-3 bg-gray-50">
            <LocationSelector
              locations={locations}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              selectedCity={selectedCity}
              onCountryChange={onCountryChange}
              onStateChange={onStateChange}
              onCityChange={onCityChange}
              showLabels={false}
            />
          </div>
        </div>

        // Search Section 
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Search</h3>
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Name, skill, or trade"
          />
        </div>

        // Location Summary 
        {(selectedCountry !== "all" || selectedState !== "all" || selectedCity !== "all") && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <span className="font-medium">Current filter: </span>
            {selectedCountry && selectedCountry !== "all" && (
              <span>
                {selectedCountry}
                {selectedState && selectedState !== "all" && " › "}
              </span>
            )}
            {selectedState && selectedState !== "all" && (
              <span>
                {selectedState}
                {selectedCity && selectedCity !== "all" && " › "}
              </span>
            )}
            {selectedCity && selectedCity !== "all" && (
              <span>{selectedCity}</span>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};*/

// src/components/filters/MobileFiltersSheet.tsx - UPDATED
import React from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LocationSelector } from "../LocationSelector";
import { SearchInput } from "./SearchInput";
import { AdvancedFiltersToggle } from "./AdvancedFiltersToggle"; // ADD THIS
import { AdvancedFiltersSection } from "./sections/AdvancedFiltersSection"; // ADD THIS

interface MobileFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // Location props
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  locations: any;
  onResetLocation: () => void;
  // Search props
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // Advanced filters props
  showAdvancedFilters: boolean;
  onAdvancedFiltersClick: () => void;
  // ADD THESE for advanced filters
  filters?: any;
  setters?: any;
  userLocation?: any;
}

export const MobileFiltersSheet = ({
  isOpen,
  onClose,
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  locations,
  onResetLocation,
  searchTerm,
  onSearchChange,
  showAdvancedFilters,
  onAdvancedFiltersClick,
  filters,
  setters,
  userLocation,
}: MobileFiltersSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Find Workers"
      showAdvancedFilters={true} // Always show in mobile
      onAdvancedFiltersClick={onAdvancedFiltersClick}
    >
      <div className="space-y-6">
        {/* Location Section - NO LABEL */}
        <div className="space-y-2">
          <LocationSelector
            locations={locations}
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedCity={selectedCity}
            onCountryChange={onCountryChange}
            onStateChange={onStateChange}
            onCityChange={onCityChange}
            showLabels={false} // No labels
          />
          
          {/* Reset Location Button */}
          {(selectedCountry !== "all" || selectedState !== "all" || selectedCity !== "all") && (
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                onClick={onResetLocation}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Reset location
              </button>
            </div>
          )}
        </div>

        {/* Search Section - NO LABEL */}
        <div className="space-y-2">
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Name, skill, or trade"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <AdvancedFiltersToggle 
            isOpen={showAdvancedFilters} 
            onToggle={onAdvancedFiltersClick} 
          />
          
          {/* Advanced Filters Content */}
          {showAdvancedFilters && filters && setters && (
            <div className="mt-4">
              <AdvancedFiltersSection
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onPriceChange={(min, max) => {
                  setters.setMinPrice(min);
                  setters.setMaxPrice(max);
                }}
                minExperience={filters.minExperience}
                maxExperience={filters.maxExperience}
                onExperienceChange={(min, max) => {
                  setters.setMinExperience(min);
                  setters.setMaxExperience(max);
                }}
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
                selectedCountry={selectedCountry}
                selectedState={selectedState}
                selectedCity={selectedCity}
                onCountryChange={onCountryChange}
                onStateChange={onStateChange}
                onCityChange={onCityChange}
                isOpen={showAdvancedFilters}
                onToggle={onAdvancedFiltersClick}
              />
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};