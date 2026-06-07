import { SearchInput } from "../SearchInput";
import { CategoryFilter } from "../CategoryFilter";
import { FilterRow } from "../FilterRow";
import { WorkersSortControls } from "../../workers/WorkersSortControls";
import { WorkersViewControls } from "../../workers/WorkersViewControls";
import { SortOption } from "@/types/worker";
import { useIsMobile } from "@/hooks/use-mobile";

interface BasicSearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const BasicSearchSection = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: BasicSearchSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className={`flex flex-col ${isMobile ? 'space-y-4' : 'sm:flex-row sm:items-center sm:gap-4'}`}>
        <div className="flex-1">
          <SearchInput 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
          />
        </div>
        <div className={`${isMobile ? 'w-full' : 'w-48'}`}>
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={onCategoryChange} 
          />
        </div>
        <div className={`${isMobile ? 'w-full' : 'w-48'}`}>
          <WorkersSortControls 
            sortBy={sortBy} 
            onSortChange={onSortChange} 
          />
        </div>
        <div className="flex justify-end">
          <WorkersViewControls 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>
    </div>
  );
};