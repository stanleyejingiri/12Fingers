//src/components/filters/AdvancedFiltersContent.tsx
/*import React from "react";
import { ExperienceRatingGroup } from "./ExperienceRatingGroup";
import { CertificationWarrantyGroup } from "./CertificationWarrantyGroup";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { DistanceFilter } from "./DistanceFilter";
import { SortOption } from "@/types/worker";

export interface AdvancedFiltersContentProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
  userLocation: [number, number] | null;
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
  sortBy: SortOption;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
}

export const AdvancedFiltersContent = ({
  minPrice,
  maxPrice,
  onPriceChange,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  minExperience,
  maxExperience,
  onExperienceChange,
  minRating,
  onRatingChange,
  requireCertification,
  onRequireCertificationChange,
  requireWarranty,
  onRequireWarrantyChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: AdvancedFiltersContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={onPriceChange}
        />
        <DistanceFilter
          maxDistance={maxDistance}
          onMaxDistanceChange={onMaxDistanceChange}
          userLocation={userLocation}
        />
      </div>
      <ExperienceRatingGroup
        minExperience={minExperience}
        maxExperience={maxExperience}
        onExperienceChange={onExperienceChange}
        minRating={minRating}
        onRatingChange={onRatingChange}
      />
      <CertificationWarrantyGroup
        requireCertification={requireCertification}
        onRequireCertificationChange={onRequireCertificationChange}
        requireWarranty={requireWarranty}
        onRequireWarrantyChange={onRequireWarrantyChange}
      />
    </div>
  );
};*/
//src/components/filters/AdvancedFiltersContent.tsx
import React from "react";
import { ExperienceRatingGroup } from "./ExperienceRatingGroup";
import { CertificationWarrantyGroup } from "./CertificationWarrantyGroup";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { DistanceFilter } from "./DistanceFilter";
import { SortOption } from "@/types/worker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AdvancedFiltersContentProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
  userLocation: [number, number] | null;
  minExperience: number;
  maxExperience: number;
  onExperienceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (value: number) => void;
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
}

export const AdvancedFiltersContent = ({
  minPrice,
  maxPrice,
  onPriceChange,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  minExperience,
  maxExperience,
  onExperienceChange,
  minRating,
  onRatingChange,
  requireCertification,
  onRequireCertificationChange,
  requireWarranty,
  onRequireWarrantyChange,
  viewMode,
  onViewModeChange,
}: AdvancedFiltersContentProps) => {
  return (
    <div className="space-y-6">
      {/* Section 1: Price & Distance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Price & Distance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={onPriceChange}
            />
            <DistanceFilter
              maxDistance={maxDistance}
              onMaxDistanceChange={onMaxDistanceChange}
              userLocation={userLocation}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Experience & Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Experience & Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceRatingGroup
            minExperience={minExperience}
            maxExperience={maxExperience}
            onExperienceChange={onExperienceChange}
            minRating={minRating}
            onRatingChange={onRatingChange}
          />
        </CardContent>
      </Card>

      {/* Section 3: Quality Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Quality Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertificationWarrantyGroup
            requireCertification={requireCertification}
            onRequireCertificationChange={onRequireCertificationChange}
            requireWarranty={requireWarranty}
            onRequireWarrantyChange={onRequireWarrantyChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
