import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (value: number) => void;
}

export const RatingFilter = ({ minRating, onRatingChange }: RatingFilterProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        Minimum Rating: {minRating}
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      </Label>
      <div className="pt-4 px-2">
        <Slider
          defaultValue={[minRating]}
          min={0}
          max={5}
          step={0.5}
          onValueChange={(values) => onRatingChange(values[0])}
          className="w-full"
        />
      </div>
    </div>
  );
};
