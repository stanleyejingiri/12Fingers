import React from "react";
import { CountrySelector } from "@/components/location/CountrySelector";

interface LocationSectionProps {
  locationError: string | null;
  onDismissError: () => void;
}

export const LocationSection = ({ locationError, onDismissError }: LocationSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label 
          htmlFor="location-selector" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Location
        </label>
        <CountrySelector className="w-full" />
      </div>
    </div>
  );
};