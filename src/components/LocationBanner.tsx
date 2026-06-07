// src/components/LocationBanner.tsx
import { useUserLocation } from '@/hooks/useUserLocation';
import { Button } from '@/components/ui/button';
import { MapPin, X, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface LocationBannerProps {
  onLocationChange: (location: any) => void;
}

export const LocationBanner = ({ onLocationChange }: LocationBannerProps) => {
  const { location, loading, error, saveUserLocation, clearUserLocation } = useUserLocation();
  const [isChanging, setIsChanging] = useState(false);

  if (loading) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border animate-pulse">
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700">Location error: {error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-red-600"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isChanging) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Choose your location</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChanging(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Location selection will be integrated here...
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // Mock selecting Lagos
              saveUserLocation(
                '3', // Country ID for Nigeria
                '14', // State ID for Lagos
                '26', // City ID for Lagos City
                'Lagos City',
                'Nigeria',
                'Lagos'
              );
              setIsChanging(false);
            }}
            className="flex-1"
          >
            Select Lagos City (Example)
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsChanging(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-gray-700">Select your location to see local workers</span>
          </div>
          <Button
            onClick={() => setIsChanging(true)}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Choose Location
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-blue-600 mr-2" />
          <div>
            <span className="font-medium">
              Showing workers from {location.cityName || location.stateName || location.countryName || 'your location'}
            </span>
            {location.isDetected && (
              <span className="text-sm text-gray-600 ml-2">(detected automatically)</span>
            )}
            {location.source === 'saved' && (
              <span className="text-sm text-gray-600 ml-2">(your default)</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!location.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveUserLocation(
                location.countryId,
                location.stateId,
                location.cityId,
                location.cityName,
                location.countryName,
                location.stateName
              )}
              className="text-blue-600 hover:text-blue-800"
            >
              Set as default
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChanging(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            Change
          </Button>
          {location.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearUserLocation}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};