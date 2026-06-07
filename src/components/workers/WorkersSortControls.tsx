import React from "react";
import { SortByFilter } from "../filters/SortByFilter";
import { SortOption } from "@/types/worker";

interface WorkersSortControlsProps {
  sortBy: SortOption;
  onSortChange: (value: string) => void;
}

export const WorkersSortControls = ({ 
  sortBy, 
  onSortChange 
}: WorkersSortControlsProps) => {
  return (
    <div className="flex justify-end mb-4">
      <SortByFilter 
        sortBy={sortBy} 
        onSortChange={onSortChange} 
      />
    </div>
  );
};
