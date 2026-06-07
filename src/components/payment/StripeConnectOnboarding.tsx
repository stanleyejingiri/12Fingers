//src/components/payment/StripeConnectOnboarding.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertCircle, Banknote } from "lucide-react";

interface StripeConnectOnboardingProps {
  workerId: string;
  onConnected?: () => void;
}

export const StripeConnectOnboarding = ({ workerId, onConnected }: StripeConnectOnboardingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Check connection status on mount
  useEffect(() => {
    checkStripeConnection();
  }, [workerId]);

  const checkStripeConnection = async () => {
    try {
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/workers/${workerId}/stripe-status`);
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.stripe_connected || false);
      }
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setIsLoading(true);
      
      console.log("🔗 Starting Stripe Connect for worker:", workerId);
      
      // Create Stripe Connect account link
      const response = await fetch('https://one2fingers-backend.onrender.com/api/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId,
          returnUrl: `${window.location.origin}/worker-dashboard`,
          refreshUrl: `${window.location.origin}/worker-dashboard`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Stripe Connect account');
      }

      const { url, accountId, success } = await response.json();
      
      if (success && url) {
        console.log("✅ Stripe Connect URL generated, redirecting...");
        
        // 🔴 NEW: Save account ID to database BEFORE redirect
        if (accountId) {
          try {
            await fetch(`https://one2fingers-backend.onrender.com/api/workers/${workerId}/stripe-connect`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                stripeAccountId: accountId,
                connected: true 
              })
            });
            console.log("✅ Stripe account ID saved to database");
          } catch (saveError) {
            console.error('⚠️ Could not save Stripe account ID:', saveError);
            // Don't block redirect if save fails
          }
        }
        
        // Redirect to Stripe Connect onboarding
        window.location.href = url;
      } else {
        throw new Error('No Stripe Connect URL received');
      }
      
    } catch (error) {
      console.error('❌ Stripe Connect error:', error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect Stripe account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Payment Setup
        </CardTitle>
        <CardDescription>
          Connect your Stripe account to receive payments for your services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Stripe account connected successfully!</span>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h4 className="font-medium">Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Receive payments directly to your bank account
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secure payment processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automatic platform fee deduction (1%)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Fast payout processing
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Platform Fee: 1%</p>
                  <p>For every $100 you earn, you receive $99 after our platform fee.</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleConnectStripe}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isLoading ? "Connecting..." : "Connect Stripe Account"}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              You'll be redirected to Stripe to securely connect your bank account
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
