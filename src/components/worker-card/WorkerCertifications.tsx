import React from "react";
import { Certification } from "@/types/worker";

interface WorkerCertificationsProps {
  certifications: Certification[];
}

export const WorkerCertifications = ({ certifications }: WorkerCertificationsProps) => {
  if (!certifications?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Certifications</h4>
      <div className="flex flex-wrap gap-2">
        {certifications.slice(0, 2).map((cert) => (
          <span 
            key={cert.id}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {cert.name}
          </span>
        ))}
        {certifications.length > 2 && (
          <span className="text-xs text-gray-500">
            +{certifications.length - 2} more
          </span>
        )}
      </div>
    </div>
  );
};
