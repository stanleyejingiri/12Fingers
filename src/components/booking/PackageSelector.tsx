// src/components/booking/PackageSelector.tsx
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ServicePackage } from "@/hooks/useServicePackages";

interface PackageSelectorProps {
  packages: ServicePackage[];
  selectedPackageId: string | null;
  onSelectPackage: (pkg: ServicePackage | null) => void;
  onChooseCustom: () => void;
  isLoading: boolean;
}

export const PackageSelector = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  onChooseCustom,
  isLoading,
}: PackageSelectorProps) => {
  const selectedPkg = packages.find(p => p.id === selectedPackageId);

  if (isLoading) {
    return <div className="text-center py-8">Loading service packages...</div>;
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No service packages available.</p>
        <Button onClick={onChooseCustom}>Continue with Custom Request</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Choose a Service Package</h3>
        <Button variant="ghost" size="sm" onClick={onChooseCustom}>
          Skip to Custom Request
        </Button>
      </div>

      <RadioGroup
        value={selectedPackageId || ""}
        onValueChange={(value) => {
          const pkg = packages.find(p => p.id === value);
          if (pkg) onSelectPackage(pkg);
        }}
        className="space-y-3"
      >
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex items-start space-x-3">
            <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-1" />
            <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
              <Card className={`border ${selectedPackageId === pkg.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{pkg.name}</h4>
                      {pkg.description && (
                        <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                      )}
                      {pkg.features && (
                        <p className="text-xs text-gray-500 mt-1">Includes: {pkg.features}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${pkg.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};