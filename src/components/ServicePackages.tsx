import React from "react";
import { ServicePackage } from "@/types/worker";
import { Button } from "@/components/ui/button";
import { CustomOfferDialog } from "./packages/CustomOfferDialog";
import { DeletePackageDialog } from "./dialogs/DeletePackageDialog";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";
import { PackagesList } from "./packages/PackagesList";

interface ServicePackagesProps {
  packages: ServicePackage[];
  onSelect: (pkg: ServicePackage) => void;
  isOwner?: boolean;
  onPackageDeleted?: () => void;
}

export const ServicePackages = ({ 
  packages, 
  onSelect, 
  isOwner = false,
  onPackageDeleted 
}: ServicePackagesProps) => {
  const [selectedPackageId, setSelectedPackageId] = React.useState<string>("");
  const [showCustomOffer, setShowCustomOffer] = React.useState(false);
  const [packageToDelete, setPackageToDelete] = React.useState<ServicePackage | null>(null);
  const { toast } = useToast();

  // 🔴 Transform packages to ensure features is an array
  const normalizedPackages = packages.map(pkg => ({
    ...pkg,
    features: typeof pkg.features === 'string' 
      ? pkg.features.split(',').map(f => f.trim()) 
      : (pkg.features || [])
  }));

  React.useEffect(() => {
    if (normalizedPackages && normalizedPackages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(normalizedPackages[0].id);
      onSelect(normalizedPackages[0]);
    }
  }, [normalizedPackages, selectedPackageId, onSelect]);

  const handleSelect = (pkg: ServicePackage) => {
    setSelectedPackageId(pkg.id);
    onSelect(pkg);
    toast({
      title: "Package Selected",
      description: `Selected ${pkg.name} package`,
    });
  };

  if (!normalizedPackages || normalizedPackages.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          No packages available. Please use custom booking.
        </p>
        <Button variant="outline" onClick={() => setShowCustomOffer(true)}>
          Make a Custom Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PackagesList
        packages={normalizedPackages}
        selectedPackageId={selectedPackageId}
        isOwner={isOwner}
        onSelect={handleSelect}
        onDeleteClick={setPackageToDelete}
      />

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Need a custom package?
        </p>
        <Button 
          variant="outline" 
          onClick={() => setShowCustomOffer(true)}
        >
          Make a Custom Offer
        </Button>
      </div>

      <CustomOfferDialog
        isOpen={showCustomOffer}
        onClose={() => setShowCustomOffer(false)}
        packages={normalizedPackages}
      />

      {packageToDelete && (
        <DeletePackageDialog
          isOpen={!!packageToDelete}
          onClose={() => setPackageToDelete(null)}
          packageId={packageToDelete.id}
          packageName={packageToDelete.name}
          onDelete={() => {
            if (onPackageDeleted) {
              onPackageDeleted();
            }
            setPackageToDelete(null);
          }}
        />
      )}
    </div>
  );
};

/*import React from "react";
import { ServicePackage } from "@/types/worker";
import { Button } from "@/components/ui/button";
import { CustomOfferDialog } from "./packages/CustomOfferDialog";
import { DeletePackageDialog } from "./dialogs/DeletePackageDialog";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";
import { PackagesList } from "./packages/PackagesList";

interface ServicePackagesProps {
  packages: ServicePackage[];
  onSelect: (pkg: ServicePackage) => void;
  isOwner?: boolean;
  onPackageDeleted?: () => void;
}

export const ServicePackages = ({ 
  packages, 
  onSelect, 
  isOwner = false,
  onPackageDeleted 
}: ServicePackagesProps) => {
  const [selectedPackageId, setSelectedPackageId] = React.useState<string>("");
  const [showCustomOffer, setShowCustomOffer] = React.useState(false);
  const [packageToDelete, setPackageToDelete] = React.useState<ServicePackage | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (packages && packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
      onSelect(packages[0]);
    }
  }, [packages, selectedPackageId, onSelect]);

  const handleSelect = (pkg: ServicePackage) => {
    setSelectedPackageId(pkg.id);
    onSelect(pkg);
    toast({
      title: "Package Selected",
      description: `Selected ${pkg.name} package`,
    });
  };

  if (!packages || packages.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          No packages available. Please use custom booking.
        </p>
        <Button variant="outline" onClick={() => setShowCustomOffer(true)}>
          Make a Custom Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PackagesList
        packages={packages}
        selectedPackageId={selectedPackageId}
        isOwner={isOwner}
        onSelect={handleSelect}
        onDeleteClick={setPackageToDelete}
      />

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Need a custom package?
        </p>
        <Button 
          variant="outline" 
          onClick={() => setShowCustomOffer(true)}
        >
          Make a Custom Offer
        </Button>
      </div>

      <CustomOfferDialog
        isOpen={showCustomOffer}
        onClose={() => setShowCustomOffer(false)}
        packages={packages}
      />

      {packageToDelete && (
        <DeletePackageDialog
          isOpen={!!packageToDelete}
          onClose={() => setPackageToDelete(null)}
          packageId={packageToDelete.id}
          packageName={packageToDelete.name}
          onDelete={() => {
            if (onPackageDeleted) {
              onPackageDeleted();
            }
            setPackageToDelete(null);
          }}
        />
      )}
    </div>
  );
};
*/
