//src/components/LocationSelector.tsx
/*
import { useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocationData } from '@/hooks/useLocationData';

interface LocationSelectorProps {
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  showLabels?: boolean;
}

export const LocationSelector = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  showLabels = false, // Default to false now
}: LocationSelectorProps) => {
  const { 
    countries, 
    states, 
    cities, 
    loading 
  } = useLocationData(selectedCountry, selectedState);
  
  // Reset city when state changes
  useEffect(() => {
    if (selectedState && selectedState !== "all") {
      onCityChange(""); // Reset city
    }
  }, [selectedState]);
  
  if (loading && countries.length === 0) {
    return <div className="text-sm text-gray-500">Loading locations...</div>;
  }

  return (
    <div className="w-full">
		<div className="flex flex-col sm:flex-row gap-2">
			<div className="flex-1 min-w-0">
			  <Select value={selectedCountry} onValueChange={onCountryChange}>
				<SelectTrigger className="w-full h-8 text-sm bg-white">
				  <SelectValue placeholder="All Countries" />
				</SelectTrigger>
				<SelectContent>
				  <SelectItem value="all" className="text-sm">All locations</SelectItem>
				  {countries.map((country) => (
					<SelectItem key={country.id} value={country.id.toString()} className="text-sm">
					  {country.name}
					</SelectItem>
				  ))}
				</SelectContent>
			  </Select>
			</div>
		
        {selectedCountry && selectedCountry !== "all" && (
          <div className="flex-1 min-w-0">
            <Select 
              value={selectedState} 
              onValueChange={onStateChange}
              disabled={!selectedCountry || selectedCountry === "all"}
            >
              <SelectTrigger className="w-full h-8 text-sm bg-white">
                <SelectValue placeholder="Any state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">All states</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()} className="text-sm">
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        
        {selectedState && selectedState !== "all" && (
          <div className="flex-1 min-w-0">
            <Select 
              value={selectedCity} 
              onValueChange={onCityChange}
              disabled={!selectedState || selectedState === "all"}
            >
              <SelectTrigger className="w-full h-8 text-sm bg-white">
                <SelectValue placeholder="Any city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">All cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()} className="text-sm">
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
	</div>
  );
  console.log('🔍 LocationSelector - selectedCountry:', selectedCountry);
};
*/
// src/components/LocationSelector.tsx
import { useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocationData } from '@/hooks/useLocationData';

interface LocationSelectorProps {
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  showLabels?: boolean;
}

export const LocationSelector = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  showLabels = false,
}: LocationSelectorProps) => {
  const { 
    countries, 
    states, 
    cities, 
    loading 
  } = useLocationData(selectedCountry, selectedState);
  
  // Helper: Get country name by ID
  const getCountryName = (countryId: string) => {
    const country = countries.find(c => c.id.toString() === countryId);
    return country ? country.name : "selected country";
  };

  // Dynamic placeholder text
  const getCountryPlaceholder = () => {
    if (selectedCountry && selectedCountry !== "all") {
      return `Showing workers from ${getCountryName(selectedCountry)}`;
    }
    return "Displaying workers from all countries";
  };
	
//const { countries } = useLocationData();
	
  // Reset city when state changes
  useEffect(() => {
    if (selectedState && selectedState !== "all") {
      onCityChange("");
    }
  }, [selectedState]);
  
  if (loading && countries.length === 0) {
    return <div className="text-sm text-gray-500">Loading locations...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Country - Always first */}
        <div className="flex-1 min-w-0">
          <Select value={selectedCountry || undefined} onValueChange={onCountryChange}>
            <SelectTrigger className="w-full h-8 text-sm bg-white">
              <SelectValue placeholder={getCountryPlaceholder()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All locations</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id.toString()} className="text-sm">
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State - Only show when country selected */}
        {selectedCountry && selectedCountry !== "all" && (
          <div className="flex-1 min-w-0">
            <Select 
              value={selectedState} 
              onValueChange={onStateChange}
              disabled={!selectedCountry || selectedCountry === "all"}
            >
              <SelectTrigger className="w-full h-8 text-sm bg-white">
                <SelectValue placeholder="Any state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">All states</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()} className="text-sm">
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* City - Only show when state selected */}
        {selectedState && selectedState !== "all" && (
          <div className="flex-1 min-w-0">
            <Select 
              value={selectedCity} 
              onValueChange={onCityChange}
              disabled={!selectedState || selectedState === "all"}
            >
              <SelectTrigger className="w-full h-8 text-sm bg-white">
                <SelectValue placeholder="Any city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">All cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()} className="text-sm">
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
