// src/components/booking/BookingModalTabs.tsx
/*
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicePackages } from "../ServicePackages";
import { BookingForm } from "./BookingForm";
import { ServicePackage, WorkerProfile } from "@/types/worker";
import { BookingFormData } from "@/types/booking";
import { Badge } from "@/components/ui/badge";

interface BookingModalTabsProps {
  worker: WorkerProfile;
  isSubmitting: boolean;
  selectedPackage: ServicePackage | undefined;
  onPackageSelect: (pkg: ServicePackage) => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onCustomOffer?: (pkg: ServicePackage) => void;
  onTabChange?: (tab: "packages" | "custom") => void;
}

export const BookingModalTabs = ({
  worker,
  isSubmitting,
  selectedPackage,
  onPackageSelect,
  onSubmit,
  onCustomOffer,
  onTabChange, // ← ADD THIS LINE!
}: BookingModalTabsProps) => {
  return (
    <Tabs defaultValue="packages" className="space-y-4" onValueChange={(value) => onTabChange?.(value as "packages" | "custom")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="packages">Service Packages</TabsTrigger>
        <TabsTrigger value="custom">
          {selectedPackage ? "Your Selection" : "Custom Booking"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="packages" className="space-y-4">
        {worker.servicePackages && worker.servicePackages.length > 0 ? (
          <div className="space-y-4">
            {worker.servicePackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="border rounded-lg p-4 relative"
              >
                {pkg.acceptsCustomOffers && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2"
                  >
                    Accepts Offers
                  </Badge>
                )}
                
                <ServicePackages 
                  packages={[pkg]} 
                  onSelect={onPackageSelect} 
                />
                
                {pkg.acceptsCustomOffers && onCustomOffer && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onCustomOffer(pkg)}
                      className="text-sm text-primary hover:underline"
                    >
                      Make Custom Offer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No service packages available. Please use custom booking.
          </div>
        )}
      </TabsContent>

      <TabsContent value="custom">
        <BookingForm 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
        />
      </TabsContent>
    </Tabs>
  );
};
*/
// src/components/booking/BookingModalTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicePackages } from "../ServicePackages";
import { BookingForm } from "./BookingForm";
import { ServicePackage, WorkerProfile } from "@/types/worker";
import { BookingFormData } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { useServicePackages } from "@/hooks/useServicePackages";

interface BookingModalTabsProps {
  worker: WorkerProfile;
  isSubmitting: boolean;
  selectedPackage: ServicePackage | undefined;
  onPackageSelect: (pkg: ServicePackage) => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onCustomOffer?: (pkg: ServicePackage) => void;
  onTabChange?: (tab: "packages" | "custom") => void;
}

export const BookingModalTabs = ({
  worker,
  isSubmitting,
  selectedPackage,
  onPackageSelect,
  onSubmit,
  onCustomOffer,
  onTabChange,
}: BookingModalTabsProps) => {
  const { data: packages, isLoading, error } = useServicePackages(worker.id);
  const displayPackages = packages && packages.length > 0 ? packages : worker.servicePackages || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load service packages. Please try again.
      </div>
    );
  }

  return (
    <Tabs defaultValue="packages" className="space-y-4" onValueChange={(value) => onTabChange?.(value as "packages" | "custom")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="packages">Service Packages</TabsTrigger>
        <TabsTrigger value="custom">
          {selectedPackage ? "Your Selection" : "Custom Booking"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="packages" className="space-y-4">
        {displayPackages.length > 0 ? (
          <div className="space-y-4">
            {displayPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="border rounded-lg p-4 relative"
              >
                {pkg.accepts_custom_offers && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2"
                  >
                    Accepts Offers
                  </Badge>
                )}
                
                <ServicePackages 
                  packages={[pkg]} 
                  onSelect={onPackageSelect} 
                />
                
                {pkg.accepts_custom_offers && onCustomOffer && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onCustomOffer(pkg)}
                      className="text-sm text-primary hover:underline"
                    >
                      Make Custom Offer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No service packages available. Please use custom booking.
          </div>
        )}
      </TabsContent>

      <TabsContent value="custom">
        <BookingForm 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
        />
      </TabsContent>
    </Tabs>
  );
};