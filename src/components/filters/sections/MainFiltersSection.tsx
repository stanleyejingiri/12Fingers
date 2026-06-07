//src/components/filters/sections/MainFiltersSection.tsx
import React from "react";
import { SearchInput } from "../SearchInput";
import { LocationSelector } from "../../LocationSelector";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";

// Define locations type
interface LocationsData {
  [country: string]: {
    [state: string]: string[];
  };
}

interface MainFiltersSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  locations: LocationsData;
  onResetLocation: () => void;
}

export const MainFiltersSection = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  viewMode,
  onViewModeChange,
  locations,
  onResetLocation,
}: MainFiltersSectionProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="py-1 px-2">
        <div className="flex flex-col md:flex-row gap-1">
            <div className="flex-1 min-w-0">
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

			  {/* Search - 40% width */}
			  <div className="flex-1 min-w-0">
				<SearchInput 
				  searchTerm={searchTerm} 
				  onSearchChange={onSearchChange} 
				  placeholder="Name, skill, or trade"
				/>
			  </div>
			</div>
		</CardContent>
    </Card>
  );
};
