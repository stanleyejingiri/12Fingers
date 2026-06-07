// src/components/location/CountrySelector.tsx
/*
import { useEffect } from "react";
import { Flag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfig } from "@/contexts/ConfigContext";
import { useLocation } from "@/hooks/useLocation";
import { useLocationData } from "@/hooks/useLocationData";
import { cn } from "@/lib/utils";

interface CountrySelectorProps {
  className?: string;
}

export function CountrySelector({ className }: CountrySelectorProps) {
  const { config, updateConfig } = useConfig();
  const { detectedCountry, loading: locationLoading, error: locationError } = useLocation();
  const { countries, loading: countriesLoading, error: countriesError } = useLocationData();

  useEffect(() => {
    if (detectedCountry && !config.country.code) {
      updateConfig({ country: detectedCountry });
    }
  }, [detectedCountry, config.country.code, updateConfig]);

  const handleCountryChange = (countryId: string) => {
    const country = countries.find(c => c.id.toString() === countryId);
    if (country) {
      updateConfig({ 
        country: { 
          code: country.code || countryId, 
          name: country.name,
          id: country.id 
        } 
      });
    }
  };

  const getPlaceholder = () => {
    if (locationLoading || countriesLoading) return "Detecting location...";
    if (locationError || countriesError) return "Select Your Country";
    return "Select country";
  };

const selectedValue = config.country?.id?.toString() || config.country?.code || "";

console.log('🔍 Countries in dropdown (from DB):', countries);
console.log('🔍 Detected country:', detectedCountry);
console.log('🔍 Config country:', config.country);

  return (
    <Select 
      value={selectedValue} 
      onValueChange={handleCountryChange}
    >
      <SelectTrigger className={cn("w-full bg-white", className)}>
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <SelectValue placeholder={getPlaceholder()} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border rounded-md shadow-lg z-50">
        {countriesLoading ? (
          <SelectItem value="loading" disabled>Loading countries...</SelectItem>
        ) : countriesError ? (
          <SelectItem value="error" disabled>Error loading countries</SelectItem>
        ) : (
          countries.map((country) => (
            <SelectItem 
              key={country.id} 
              value={country.id.toString()}
              className="flex items-center gap-2 bg-white hover:bg-gray-100"
            >
              <Flag className="h-4 w-4" />
              {country.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
*/
import { useEffect } from "react";
import { Flag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfig } from "@/contexts/ConfigContext";
import { useLocation } from "@/hooks/useLocation";
import { useLocationData } from "@/hooks/useLocationData";
import { cn } from "@/lib/utils";

interface CountrySelectorProps {
  className?: string;
}
export function CountrySelector({ className }: CountrySelectorProps) {
  const { config, updateConfig } = useConfig();
  const { detectedCountry, loading: locationLoading, error: locationError } = useLocation();
  const { countries, loading: countriesLoading, error: countriesError } = useLocationData();

  useEffect(() => {
    if (detectedCountry && !config.country?.code) {
      updateConfig({ country: detectedCountry });
    }
  }, [detectedCountry, config.country, updateConfig]);

  const handleCountryChange = (countryId: string) => {
    const country = countries.find(c => c.id.toString() === countryId);
    if (country) {
      updateConfig({ 
        country: { 
          code: country.code || countryId, 
          name: country.name,
          id: country.id 
        } 
      });
    }
  };

  const getPlaceholder = () => {
    if (locationLoading || countriesLoading) return "Detecting location...";
    if (locationError || countriesError) return "Select Your Country";
    return "Select country";
  };

  const selectedValue = config.country?.id?.toString() || config.country?.code || "";

  return (
    <Select value={selectedValue} onValueChange={handleCountryChange}>
      <SelectTrigger className={cn("w-full bg-white", className)}>
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <SelectValue placeholder={getPlaceholder()} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border rounded-md shadow-lg z-50">
        {countriesLoading ? (
          <SelectItem value="loading" disabled>Loading countries...</SelectItem>
        ) : countriesError ? (
          <SelectItem value="error" disabled>Error loading countries</SelectItem>
        ) : (
          countries.map((country) => (
            <SelectItem 
              key={country.id} 
              value={country.id.toString()}
              className="flex items-center gap-2 bg-white hover:bg-gray-100"
            >
              <Flag className="h-4 w-4" />
              {country.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}