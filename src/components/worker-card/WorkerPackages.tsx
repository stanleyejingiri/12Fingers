import React from "react";
import { ServicePackage } from "@/types/worker";

interface WorkerPackagesProps {
  packages: ServicePackage[];
}

export const WorkerPackages = ({ packages }: WorkerPackagesProps) => {
  if (!packages?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Available Packages</h4>
      <div className="space-y-1">
        {packages.slice(0, 2).map((pkg) => (
          <div key={pkg.id} className="text-sm">
            <span className="font-medium">{pkg.name}</span>
            <span className="text-gray-500"> - ${pkg.price}</span>
          </div>
        ))}
        {packages.length > 2 && (
          <span className="text-xs text-gray-500">
            +{packages.length - 2} more packages
          </span>
        )}
      </div>
    </div>
  );
};