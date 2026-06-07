import React from "react";
import { MapPin } from "lucide-react";

interface WorkerDistanceProps {
  distance: number | null;
}

export const WorkerDistance = ({ distance }: WorkerDistanceProps) => {
  if (distance === null) return null;
  
  return (
    <div className="flex items-center gap-1">
      <MapPin className="h-4 w-4" />
      <span>{distance.toFixed(1)} miles away</span>
    </div>
  );
};
