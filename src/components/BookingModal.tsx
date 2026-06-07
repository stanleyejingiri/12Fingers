//components/BookingModal.tsx
/*import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      toast({
        title: "Booking submitted",
        description: "Your booking request has been sent successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
        />
        <PaymentMethodSelector 
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </DialogContent>
    </Dialog>
  );
};
*/

//components/BookingModal.tsx
/*import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";
import { Button } from "@/components/ui/button"; // Add this import
import { CreditCard } from "lucide-react"; // Add this import

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const [activeTab, setActiveTab] = React.useState<"packages" | "custom">("packages"); // Add state for active tab
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      toast({
        title: "Booking submitted",
        description: "Your booking request has been sent successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle Continue button click
  const handleContinueToPayment = () => {
    if (!selectedPackage) {
      toast({
        variant: "destructive",
        title: "No package selected",
        description: "Please select a service package to continue.",
      });
      return;
    }

    // For now, just show a success message
    // Tomorrow we'll integrate the actual payment processing
    toast({
      title: "Ready for Payment!",
      description: `Proceeding to payment for ${selectedPackage.name} via ${paymentMethod}`,
    });
    
    console.log("Proceeding to payment with:", {
      package: selectedPackage,
      paymentMethod: paymentMethod,
      worker: worker.name
    });
  };

  // Check if we should show the Continue button
  const shouldShowContinueButton = selectedPackage && activeTab === "packages";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
          onTabChange={setActiveTab} // Add this prop
        />
        
        //{ Show payment method selector only when a package is selected }
        {selectedPackage && (
          <PaymentMethodSelector 
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        )}

        {// Continue Button - Only show when package is selected and on packages tab }
        {shouldShowContinueButton && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleContinueToPayment}
              className="flex items-center gap-2"
              size="lg"
            >
              <CreditCard className="h-4 w-4" />
              Continue to Payment
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};*/

//components/BookingModal.tsx
/*import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";
import { Button } from "@/components/ui/button"; // Add this import
import { CreditCard } from "lucide-react"; // Add this import

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const [activeTab, setActiveTab] = React.useState<"packages" | "custom">("packages"); // Add state for active tab
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      toast({
        title: "Booking submitted",
        description: "Your booking request has been sent successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle Continue button click
  const handleContinueToPayment = () => {
    if (!selectedPackage) {
      toast({
        variant: "destructive",
        title: "No package selected",
        description: "Please select a service package to continue.",
      });
      return;
    }

    // For now, just show a success message
    // Tomorrow we'll integrate the actual payment processing
    toast({
      title: "Ready for Payment!",
      description: `Proceeding to payment for ${selectedPackage.name} via ${paymentMethod}`,
    });
    
    console.log("Proceeding to payment with:", {
      package: selectedPackage,
      paymentMethod: paymentMethod,
      worker: worker.name
    });
  };

  // Check if we should show the Continue button
  const shouldShowContinueButton = selectedPackage && activeTab === "packages";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
          onTabChange={setActiveTab} // Add this prop
        />
        
        {/* Show payment method selector only when a package is selected }
        {selectedPackage && (
          <PaymentMethodSelector 
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        )}

        {/* Continue Button - Only show when package is selected and on packages tab }
        {shouldShowContinueButton && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleContinueToPayment}
              className="flex items-center gap-2"
              size="lg"
            >
              <CreditCard className="h-4 w-4" />
              Continue to Payment
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};*/


//components/BookingModal.tsx
/*import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { createCheckoutSession } from "./booking/utils/checkoutUtils"; // FIXED IMPORT PATH

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const [activeTab, setActiveTab] = React.useState<"packages" | "custom">("packages");
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      toast({
        title: "Booking submitted",
        description: "Your booking request has been sent successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATED: Function to handle Continue button click - NOW PROCESSES PAYMENT
  const handleContinueToPayment = async () => {
    if (!selectedPackage) {
      toast({
        variant: "destructive",
        title: "No package selected",
        description: "Please select a service package to continue.",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      console.log("💰 Starting payment process...", {
        package: selectedPackage,
        paymentMethod: paymentMethod,
        worker: worker.name
      });

      // Generate a temporary booking ID (in real app, create booking first)
      const temporaryBookingId = `temp_${Date.now()}`;
      
      // Call the Stripe checkout session
      const checkoutUrl = await createCheckoutSession({
        workerId: worker.id,
        bookingId: temporaryBookingId,
        bookingDate: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        totalAmount: selectedPackage.price,
        packageId: selectedPackage.id,
        paymentMethod: paymentMethod
      });

      console.log("✅ Stripe checkout URL:", checkoutUrl);

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }

    } catch (error) {
      console.error("💥 Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Check if we should show the Continue button
  const shouldShowContinueButton = selectedPackage && activeTab === "packages";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
          onTabChange={setActiveTab}
        />
        
        // Show payment method selector only when a package is selected 
        {selectedPackage && (
          <PaymentMethodSelector 
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        )}

        // Continue Button - Only show when package is selected and on packages tab 
        {shouldShowContinueButton && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleContinueToPayment}
              className="flex items-center gap-2"
              size="lg"
              disabled={isProcessingPayment}
            >
              <CreditCard className="h-4 w-4" />
              {isProcessingPayment ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};*/

// components/BookingModal.tsx
/*import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar } from "lucide-react";

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const [activeTab, setActiveTab] = React.useState<"packages" | "custom">("packages");
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      // Success toast is handled in BookingSubmitHandler
    } catch (error) {
      // Error toast is handled in BookingSubmitHandler
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle custom offer creation
  const handleCustomOffer = (pkg: any) => {
    setSelectedPackage(pkg);
    setActiveTab("custom");
    toast({
      title: "Custom Offer",
      description: "You can now customize this package to your needs.",
    });
  };

  // Check if we should show the Submit button
  const shouldShowSubmitButton = selectedPackage && activeTab === "packages";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
          onTabChange={setActiveTab}
          onCustomOffer={handleCustomOffer}
        />
        
        // Show payment method selector only when a package is selected 
        {selectedPackage && (
			 <PaymentMethodSelector 
			  selected={paymentMethod}
			  onSelect={setPaymentMethod}
			  showBalance={true}
			/>
        )}

        // Submit/Book Button - Shows differently based on tab 
        <div className="flex justify-end pt-4 border-t">
          {activeTab === "packages" && selectedPackage ? (
            <Button 
              onClick={() => {
                // For package bookings, we need to trigger the form submit
                // We'll simulate a booking form submission
                const formData: BookingFormData = {
                  date: new Date(),
                  startTime: "09:00",
                  endTime: "10:00",
                  serviceDetails: `Booking for ${selectedPackage.name}`,
                  specialInstructions: ""
                };
                onSubmit(formData);
              }}
              className="flex items-center gap-2"
              size="lg"
              disabled={isSubmitting}
            >
              <CreditCard className="h-4 w-4" />
              {isSubmitting ? "Processing..." : `Book Now - $${selectedPackage.price}`}
            </Button>
          ) : activeTab === "custom" ? (
            <p className="text-sm text-muted-foreground">
              Fill in the custom booking form above to submit your request
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a service package to continue
            </p>
          )}
        </div>

       // Payment Method Info 
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">ℹ️ Payment Information:</span>
            {" "}
            {paymentMethod === 'wallet' 
              ? 'Funds will be held in escrow and released after job completion.'
              : paymentMethod === 'card' 
                ? 'You will be redirected to Stripe for secure payment.'
                : 'You will be redirected to PayPal for payment.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};*/

// components/BookingModal.tsx
/*import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar } from "lucide-react";

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const [activeTab, setActiveTab] = React.useState<"packages" | "custom">("packages");
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    console.log('📤 BookingModal onSubmit called!', {
      paymentMethod,
      selectedPackage,
      activeTab,
      data
    });
    
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      // Success toast is handled in BookingSubmitHandler
    } catch (error) {
      // Error toast is handled in BookingSubmitHandler
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle custom offer creation
  const handleCustomOffer = (pkg: any) => {
    setSelectedPackage(pkg);
    setActiveTab("custom");
    toast({
      title: "Custom Offer",
      description: "You can now customize this package to your needs.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
          onTabChange={setActiveTab}
          onCustomOffer={handleCustomOffer}
        />
        
        // FIXED: Show payment method selector for ALL booking types 
        <PaymentMethodSelector 
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          showBalance={true}
        />

       // FIXED: Submit/Book Button for both package and custom bookings 
        <div className="flex justify-end pt-4 border-t">
          {activeTab === "packages" && selectedPackage ? (
            <Button 
              onClick={() => {
                // For package bookings, simulate form submission
                const formData: BookingFormData = {
                  date: new Date(),
                  startTime: "09:00",
                  endTime: "10:00",
                  serviceDetails: `Booking for ${selectedPackage.name}`,
                  specialInstructions: ""
                };
                onSubmit(formData);
              }}
              className="flex items-center gap-2"
              size="lg"
              disabled={isSubmitting}
            >
              <CreditCard className="h-4 w-4" />
              {isSubmitting ? "Processing..." : `Book Now - $${selectedPackage.price}`}
            </Button>
          ) : activeTab === "custom" ? (
            <Button 
              onClick={() => {
                // Custom bookings are submitted through the form in BookingModalTabs
                // The form's built-in submit button handles submission
                toast({
                  title: "Ready to Submit",
                  description: "Fill in the custom booking form above and click 'Send Custom Request'",
                });
              }}
              className="flex items-center gap-2"
              size="lg"
              disabled={isSubmitting}
            >
              <Calendar className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Fill Custom Booking Form"}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a service package or use custom booking
            </p>
          )}
        </div>

        // Payment Method Info 
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">ℹ️ Payment Information:</span>
            {" "}
            {paymentMethod === 'wallet' 
              ? 'Funds will be held in escrow and released after job completion.'
              : paymentMethod === 'card' 
                ? 'You will be redirected to Stripe for secure payment.'
                : 'You will be redirected to PayPal for payment.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};*/

// components/BookingModal.tsx
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { PaymentMethodSelector } from "./booking/PaymentMethodSelector";
import { useBookingSubmit } from "./booking/BookingSubmitHandler";
import { BookingFormData } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingModalHeader } from "./booking/BookingModalHeader";
import { BookingModalTabs } from "./booking/BookingModalTabs";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ worker, isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(worker.servicePackages?.[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal" | "wallet">("card");
  const [activeTab, setActiveTab] = React.useState<"packages" | "custom">("packages");
  const { toast } = useToast();

  React.useEffect(() => {
    if (worker.servicePackages?.length > 0) {
      setSelectedPackage(worker.servicePackages[0]);
    }
  }, [worker.servicePackages]);

  const { handleSubmit } = useBookingSubmit({
    workerId: worker.id,
    selectedPackage,
    paymentMethod,
    onClose,
    workerName: worker.name,
    hourlyRate: worker.hourlyRate,
  });

  const onSubmit = async (data: BookingFormData) => {
    console.log('📤 BookingModal onSubmit called!', {
      paymentMethod,
      selectedPackage,
      activeTab,
      data
    });
    
    try {
      setIsSubmitting(true);
      await handleSubmit(data);
      // If booking is successful, close modal
      onClose();
    } catch (error) {
      // Error toast is handled in BookingSubmitHandler
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle custom offer creation
  const handleCustomOffer = (pkg: any) => {
    setSelectedPackage(pkg);
    setActiveTab("custom");
    toast({
      title: "Custom Offer",
      description: "You can now customize this package to your needs.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <BookingModalHeader workerName={worker.name} />
        
        <BookingModalTabs
          worker={worker}
          isSubmitting={isSubmitting}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onSubmit={onSubmit}
          onTabChange={setActiveTab}
          onCustomOffer={handleCustomOffer}
        />
        
        {/* Payment Method Selector - MOVED BEFORE FORM FOR BETTER UX */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Payment Method</h3>
          <PaymentMethodSelector 
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            showBalance={true}
          />
        </div>

        {/* Payment Method Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">ℹ️ Payment Information:</span>
            {" "}
            {paymentMethod === 'wallet' 
              ? 'Funds will be held in escrow and released after job completion.'
              : paymentMethod === 'card' 
                ? 'You will be redirected to Stripe for secure payment.'
                : 'You will be redirected to PayPal for payment.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
