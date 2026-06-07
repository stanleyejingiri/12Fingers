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
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface DeactivateAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeactivateAccountDialog({
  isOpen,
  onClose,
}: DeactivateAccountDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    if (!user) return;

    try {
      const { error: requestError } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: user.id,
          reason: 'User requested account deactivation',
          status: 'pending'
        });

      if (requestError) throw requestError;

      toast({
        title: "Account Deactivation Requested",
        description: "Your account deactivation request has been submitted. You will be signed out now.",
      });

      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request account deactivation. Please try again.",
      });
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to deactivate your account? This action will:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Hide your profile from search results</li>
              <li>Cancel all pending bookings</li>
              <li>Archive all your messages</li>
              <li>Preserve your review history</li>
            </ul>
            <p className="font-medium">This action can be reversed by contacting support.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Deactivate Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
