import { ExperienceRatingGroup } from "../ExperienceRatingGroup";

interface QualificationsSectionProps {
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
}

export const QualificationsSection = ({
  minExperience,
  maxExperience,
  onExperienceChange,
  minRating,
  onRatingChange,
}: QualificationsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Qualifications</h2>
      <ExperienceRatingGroup
        minExperience={minExperience}
        maxExperience={maxExperience}
        onExperienceChange={onExperienceChange}
        minRating={minRating}
        onRatingChange={onRatingChange}
      />
    </div>
  );
};