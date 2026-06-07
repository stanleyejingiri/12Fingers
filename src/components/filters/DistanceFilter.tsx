import { Slider } from "@/components/ui/slider";
import { DistanceFilterProps } from "./types";

export const DistanceFilter = ({ maxDistance, onMaxDistanceChange, userLocation }: DistanceFilterProps) => {
  if (!userLocation) return null;

  return (
    <div className="mt-4">
      <label className="text-sm font-medium mb-2 block text-gray-700">
        Maximum Distance: {maxDistance} miles
      </label>
      <Slider
        value={[maxDistance]}
        onValueChange={(value) => onMaxDistanceChange(value[0])}
        max={50}
        step={1}
        className="w-full"
      />
    </div>
  );
};