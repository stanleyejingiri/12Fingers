// src/components/dashboard/WithdrawFundsDialog.tsx
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
import { AlertCircle, CheckCircle } from "lucide-react";

interface WithdrawFundsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  availableBalance: number;
  onSuccess: () => void;
}

export function WithdrawFundsDialog({ 
  isOpen, 
  onClose, 
  workerId, 
  availableBalance,
  onSuccess 
}: WithdrawFundsDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm'>('input');

  const presetAmounts = [50, 100, 200, 500];

  const handleAmountSelect = (preset: number) => {
    setAmount(preset.toString());
  };

  const handleMaxAmount = () => {
    setAmount(availableBalance.toString());
  };

  const handleContinue = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal is $10",
        variant: "destructive",
      });
      return;
    }
    if (numAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You can only withdraw up to $${availableBalance.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    setStep('confirm');
  };

  const handleBack = () => {
    setStep('input');
  };

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    
    try {
      setLoading(true);
      
      const response = await fetch('https://one2fingers-backend.onrender.com/api/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker_id: workerId,
          amount: numAmount
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Withdrawal failed');
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: `Withdrawal request for $${numAmount.toFixed(2)} submitted. Admin will process shortly.`,
        variant: "default",
      });
      
      onSuccess();
      onClose();
      setAmount("");
      setStep('input');
      
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'input' ? 'Withdraw Funds' : 'Confirm Withdrawal'}
          </DialogTitle>
          <DialogDescription>
            {step === 'input' 
              ? 'Enter the amount you want to withdraw to your bank account'
              : 'Please confirm your withdrawal request'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'input' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Available Balance: ${availableBalance.toFixed(2)}</p>
                <p className="text-xs">Minimum withdrawal: $10.00</p>
              </div>
            </div>

            <div>
              <Label>Quick Select</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAmountSelect(preset)}
                  >
                    ${preset}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMaxAmount}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Custom Amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="10"
                  step="0.01"
                  max={availableBalance}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              onClick={handleContinue} 
              className="w-full"
              disabled={!amount || loading}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">You are requesting to withdraw:</p>
              <p className="text-3xl font-bold text-yellow-700">${parseFloat(amount).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">
                This amount will be deducted from your wallet immediately.
                Funds will be sent to your connected bank account within 1-3 business days.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} className="flex-1" disabled={loading}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
