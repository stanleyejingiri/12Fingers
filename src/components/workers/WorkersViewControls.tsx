import React from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";

interface WorkersViewControlsProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const WorkersViewControls = ({
  viewMode,
  onViewModeChange
}: WorkersViewControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewModeChange("grid")}
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewModeChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};