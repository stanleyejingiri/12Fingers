import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ServicePackage } from "@/types/worker";

interface CustomOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packages: ServicePackage[];
}

export const CustomOfferDialog = ({ isOpen, onClose, packages }: CustomOfferDialogProps) => {
  const [message, setMessage] = React.useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to make custom offers.",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your custom offer message.",
      });
      return;
    }

    try {
      const workerId = packages[0].worker_id;
      
      const { data: workerProfile, error: workerError } = await supabase
        .from('worker_profiles')
        .select('user_id')
        .eq('id', workerId)
        .single();

      if (workerError || !workerProfile?.user_id) {
        throw new Error('Could not find worker');
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: `Custom Offer Request: ${message}`,
          sender_id: user.id,
          receiver_id: workerProfile.user_id,
          worker_id: workerId,
        });

      if (messageError) throw messageError;

      setMessage("");
      onClose();

      setTimeout(() => {
        toast({
          title: "Success",
          description: "Your custom offer has been sent.",
          duration: 3000,
        });
      }, 100);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send custom offer. Please try again.",
      });
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setMessage("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Make a Custom Offer</DialogTitle>
          <DialogDescription>
            Describe your requirements and proposed budget for a customized service package.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Describe your requirements and proposed budget..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
            aria-label="Custom offer message"
          />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Send Offer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};