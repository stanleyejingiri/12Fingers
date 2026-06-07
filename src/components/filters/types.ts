import { WorkerCategory } from "@/types/worker";

export interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export interface SortByFilterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export interface DistanceFilterProps {
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
  userLocation: [number, number] | null;
}
