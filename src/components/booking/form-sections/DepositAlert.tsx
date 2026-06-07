import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ServicePackage } from "@/types/worker";

interface DepositAlertProps {
  selectedPackage: ServicePackage;
}

export const DepositAlert = ({ selectedPackage }: DepositAlertProps) => {
  const depositAmount = (selectedPackage.price * selectedPackage.depositRequired / 100).toFixed(2);
  
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        A {selectedPackage.depositRequired}% deposit (${depositAmount}) is required to secure this booking.
      </AlertDescription>
    </Alert>
  );
};