import React from "react";
import { Award } from "lucide-react";
import { Certification } from "@/types/worker";

interface WorkerCertificationCountProps {
  certifications: Certification[];
}

export const WorkerCertificationCount = ({ certifications }: WorkerCertificationCountProps) => {
  if (!certifications?.length) return null;
  
  return (
    <div className="flex items-center gap-1">
      <Award className="h-4 w-4" />
      <span>{certifications.length} certifications</span>
    </div>
  );
};
