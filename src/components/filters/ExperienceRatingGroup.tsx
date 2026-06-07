import { ExperienceFilter } from "./ExperienceFilter";
import { RatingFilter } from "./RatingFilter";

interface ExperienceRatingGroupProps {
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
}

export const ExperienceRatingGroup = ({
  minExperience,
  maxExperience,
  onExperienceChange,
  minRating,
  onRatingChange,
}: ExperienceRatingGroupProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ExperienceFilter
        minExperience={minExperience}
        maxExperience={maxExperience}
        onExperienceChange={onExperienceChange}
      />
      <RatingFilter
        minRating={minRating}
        onRatingChange={onRatingChange}
      />
    </div>
  );
};
