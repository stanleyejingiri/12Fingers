import React from "react";
import { Briefcase } from "lucide-react";

interface WorkerExperienceProps {
  yearsOfExperience: number;
}

export const WorkerExperience = ({ yearsOfExperience }: WorkerExperienceProps) => {
  return (
    <div className="flex items-center gap-1">
      <Briefcase className="h-4 w-4" />
      <span>{yearsOfExperience} years of experience</span>
    </div>
  );
};