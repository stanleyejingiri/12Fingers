// src/components/dashboard/AddFundsDialog.tsx
/*import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// In AddFundsDialog.tsx - update the interface
interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFunds: (amount: number) => void;
  userId?: string;
  userEmail?: string; // Add this
  userName?: string;  // Add this if needed
}
// At the top of your component, add:
console.log("🔍 AddFundsDialog props:", { 
  open, 
  userId, 
  userEmail, 
  hasUser: !!user  // If you have access to user object
});

export function AddFundsDialog({ open, onOpenChange, onAddFunds, userId }: AddFundsDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 200];
  

 /* const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to add funds",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('https://one2fingers-backend.onrender.com/api/wallets/add-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: numAmount
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add funds');
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: `$${numAmount} added to your wallet`,
      });
      
      onAddFunds(numAmount);
      setAmount("");
      onOpenChange(false);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };*/
  /*const handleSubmit = async () => {
  console.log("💰 Submit deposit:", { userId, amount });
  
  if (!userId || !amount) {
    toast({
      title: "Missing Information",
      description: "Please enter an amount",
      variant: "destructive",
    });
    return;
  }
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 1) {
    toast({
      title: "Invalid Amount",
      description: "Minimum deposit is $1",
      variant: "destructive",
    });
    return;
  }
  
  try {
    setLoading(true);
    
    // Call new Stripe endpoint
    const response = await fetch('https://one2fingers-backend.onrender.com/api/stripe/create-deposit-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        amount: numAmount,
        email: user?.email // Get from auth context
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment failed');
    }
    
    const result = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = result.url;
    
  } catch (error: any) {
    console.error('Deposit error:', error);
    toast({
      title: "Payment Failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>
            Add money to your wallet for quick bookings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={amount === preset.toString() ? "border-primary" : ""}
              >
                ${preset}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg">$</span>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={loading || !amount}
          >
            {loading ? "Processing..." : `Add $${amount || "0"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}*/

// src/components/dashboard/AddFundsDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth"; // 🔴 IMPORT THIS!

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFunds: (amount: number) => void;
  userId?: string;
  userEmail?: string;
}

export function AddFundsDialog({ 
  open, 
  onOpenChange, 
  onAddFunds, 
  userId: propUserId,
  userEmail: propUserEmail 
}: AddFundsDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth(); // 🔴 GET USER FROM AUTH CONTEXT
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 200];

  // Debug log to see what's coming in
  console.log("🔍 AddFundsDialog - Props:", { propUserId, propUserEmail });
  console.log("🔍 AddFundsDialog - Auth user:", user);

  // Use prop if provided, otherwise use from auth context
  const effectiveUserId = propUserId || user?.id;
  const effectiveUserEmail = propUserEmail || user?.email;

  const handleSubmit = async () => {
    console.log("💰 Submit deposit:", { 
      userId: effectiveUserId, 
      amount,
      email: effectiveUserEmail 
    });
    
    if (!effectiveUserId) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to add funds",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount) {
      toast({
        title: "Missing Amount",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit is $1",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Call Stripe endpoint
      const response = await fetch('https://one2fingers-backend.onrender.com/api/stripe/create-deposit-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          amount: numAmount,
          email: effectiveUserEmail || 'customer@12fingers.com'
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Payment failed');
      }
      
      const result = await response.json();
      console.log("✅ Stripe session created:", result);
      
      // Redirect to Stripe Checkout
      window.location.href = result.url;
      
    } catch (error: any) {
      console.error('❌ Deposit error:', error);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>
            Add money to your wallet for quick bookings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={amount === preset.toString() ? "border-primary bg-primary/5" : ""}
              >
                ${preset}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">$</span>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="text-lg"
              />
            </div>
            <p className="text-xs text-gray-500">
              You'll be redirected to Stripe to complete your payment
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={loading || !amount}
            size="lg"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay $${amount || "0"} with Stripe`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
