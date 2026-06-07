import React from "react";
import { SortByFilter } from "../filters/SortByFilter";
import { WorkersViewControls } from "./WorkersViewControls";
import { SortOption } from "@/types/worker";

interface WorkersListControlsProps {
  sortBy: SortOption;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const WorkersListControls = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: WorkersListControlsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <SortByFilter sortBy={sortBy} onSortChange={onSortChange} />
      <WorkersViewControls viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
};