//src/components/booking/paymentMethodSelector.tsx
/*import React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PaymentOption } from "./payment/PaymentOption";
import { paymentMethods } from "./payment/paymentMethodsConfig";

type PaymentMethod = "card" | "paypal" | "wallet";

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selected: PaymentMethod;
}

export const PaymentMethodSelector = ({ onSelect, selected }: PaymentMethodSelectorProps) => {
  const { user } = useAuth();
  const walletBalance = user?.walletBalance || 0;

  return (
    <div className="mt-6">
      <Label className="text-base block">Select Payment Method</Label>
      <TooltipProvider delayDuration={300}>
        <div className="mt-2">
          <RadioGroup
            value={selected}
            onValueChange={onSelect}
            className="grid grid-cols-3 gap-4"
          >
            {paymentMethods.map((method) => (
              <PaymentOption
                key={method.id}
                {...method}
                label={method.id === "wallet" ? `${method.label} ($${walletBalance})` : method.label}
              />
            ))}
          </RadioGroup>
        </div>
      </TooltipProvider>
    </div>
  );
};*/
// src/components/booking/PaymentMethodSelector.tsx - UPDATED
import React, { useState, useEffect } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PaymentOption } from "./payment/PaymentOption";
import { paymentMethods } from "./payment/paymentMethodsConfig";
import { Skeleton } from "@/components/ui/skeleton"; // Add this import

type PaymentMethod = "card" | "paypal" | "wallet";

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selected: PaymentMethod;
  showBalance?: boolean; // Add this prop
}

export const PaymentMethodSelector = ({ 
  onSelect, 
  selected,
  showBalance = true 
}: PaymentMethodSelectorProps) => {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id && showBalance) {
      fetchWalletBalance();
    }
  }, [user, showBalance]);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
      }
      
      const data = await response.json();
      setWalletBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const getWalletLabel = () => {
    if (loading) {
      return "Wallet (Loading...)";
    }
    if (walletBalance !== null) {
      return `Wallet ($${walletBalance.toFixed(2)})`;
    }
    return "Wallet";
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    // If selecting wallet with insufficient funds, show warning but allow selection
    if (method === 'wallet' && walletBalance !== null && walletBalance <= 0) {
      // We'll let the booking handler show the actual error
      console.log('Wallet selected but balance is low:', walletBalance);
    }
    onSelect(method);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-base block">Select Payment Method</Label>
        {showBalance && walletBalance !== null && (
          <div className="text-sm text-muted-foreground">
            Available: <span className="font-semibold">${walletBalance.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <TooltipProvider delayDuration={300}>
        <div className="mt-2">
          <RadioGroup
            value={selected}
            onValueChange={handleMethodSelect}
            className="grid grid-cols-3 gap-4"
          >
            {paymentMethods.map((method) => (
              <PaymentOption
                key={method.id}
                {...method}
                label={method.id === "wallet" ? getWalletLabel() : method.label}
              />
            ))}
          </RadioGroup>
        </div>
      </TooltipProvider>

      {selected === 'wallet' && walletBalance !== null && walletBalance <= 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">⚠️ Low Wallet Balance:</span> 
            You have ${walletBalance.toFixed(2)} in your wallet. 
            You may need to add funds before booking.
          </p>
        </div>
      )}
    </div>
  );
};
