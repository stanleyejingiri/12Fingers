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
import { supabase } from "@/lib/supabase";

interface DeletePackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  onDelete: () => void;
}

export function DeletePackageDialog({
  isOpen,
  onClose,
  packageId,
  packageName,
  onDelete,
}: DeletePackageDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('service_packages')
        .delete()
        .eq('id', packageId);

      if (error) throw error;

      toast({
        title: "Package Deleted",
        description: "The service package has been successfully deleted.",
      });
      onDelete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete package. Please try again.",
      });
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service Package</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the "{packageName}" package? 
            This action cannot be undone. Any active bookings using this package will not be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete Package
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}