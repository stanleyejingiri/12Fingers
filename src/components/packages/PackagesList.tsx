//src/components/packages/PackagesList.tsx
/*
import { ServicePackage } from "@/types/worker";
import { PackageCard } from "./PackageCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PackagesListProps {
  packages: ServicePackage[];
  selectedPackageId: string;
  isOwner?: boolean;
  onSelect: (pkg: ServicePackage) => void;
  onDeleteClick?: (pkg: ServicePackage) => void;
}

export const PackagesList = ({
  packages,
  selectedPackageId,
  isOwner = false,
  onSelect,
  onDeleteClick,
}: PackagesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {packages.map((pkg) => (
        <div key={pkg.id} className="relative">
          <PackageCard
            pkg={pkg}
            isSelected={selectedPackageId === pkg.id}
            onSelect={() => onSelect(pkg)}
          />
          {isOwner && onDeleteClick && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
              onClick={() => onDeleteClick(pkg)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
*/
// src/components/packages/PackagesList.tsx
import { ServicePackage } from "@/types/worker";
import { PackageCard } from "./PackageCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PackagesListProps {
  packages: ServicePackage[];
  selectedPackageId: string;
  isOwner?: boolean;
  onSelect: (pkg: ServicePackage) => void;
  onDeleteClick?: (pkg: ServicePackage) => void;
}

export const PackagesList = ({
  packages,
  selectedPackageId,
  isOwner = false,
  onSelect,
  onDeleteClick,
}: PackagesListProps) => {
  // 🔴 Normalize packages to ensure features is an array
  const normalizedPackages = packages.map(pkg => ({
    ...pkg,
    features: typeof pkg.features === 'string' 
      ? pkg.features.split(',').map(f => f.trim()) 
      : (Array.isArray(pkg.features) ? pkg.features : [])
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {normalizedPackages.map((pkg) => (
        <div key={pkg.id} className="relative">
          <PackageCard
            pkg={pkg}
            isSelected={selectedPackageId === pkg.id}
            onSelect={() => onSelect(pkg)}
          />
          {isOwner && onDeleteClick && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
              onClick={() => onDeleteClick(pkg)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
