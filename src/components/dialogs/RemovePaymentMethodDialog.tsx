import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface RemovePaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethodId: string;
  paymentMethodName: string;
  onRemove: () => void;
}

export function RemovePaymentMethodDialog({
  isOpen,
  onClose,
  paymentMethodId,
  paymentMethodName,
  onRemove,
}: RemovePaymentMethodDialogProps) {
  const { toast } = useToast();

  const handleRemove = async () => {
    try {
      // Here you would integrate with your payment provider's API
      // to remove the payment method
      
      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been successfully removed.",
      });
      onRemove();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
      });
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {paymentMethodName}? 
            This payment method will be removed from all recurring payments if any.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Remove Payment Method
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
