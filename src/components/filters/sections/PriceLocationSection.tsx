import { PriceRangeFilter } from "../PriceRangeFilter";
import { DistanceFilter } from "../DistanceFilter";
import { FilterRow } from "../FilterRow";

interface PriceLocationSectionProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
  userLocation: [number, number] | null;
}

export const PriceLocationSection = ({
  minPrice,
  maxPrice,
  onPriceChange,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
}: PriceLocationSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Price & Location</h2>
      <FilterRow>
        <PriceRangeFilter 
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={onPriceChange}
        />
        {userLocation && (
          <DistanceFilter
            maxDistance={maxDistance}
            onMaxDistanceChange={onMaxDistanceChange}
            userLocation={userLocation}
          />
        )}
      </FilterRow>
    </div>
  );
};