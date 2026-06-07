import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ExperienceFilterProps {
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
}

export const ExperienceFilter = ({ 
  minExperience, 
  maxExperience, 
  onExperienceChange 
}: ExperienceFilterProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Years of Experience: {minExperience} - {maxExperience}
      </Label>
      <div className="pt-4 px-2">
        <Slider
          defaultValue={[minExperience, maxExperience]}
          max={30}
          step={1}
          onValueChange={(values) => onExperienceChange(values[0], values[1])}
          className="w-full"
        />
      </div>
    </div>
  );
};