import React, { useState } from "react";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan } from "@/types/worker";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { WorkerRegistrationModal } from "./WorkerRegistrationModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: 'Basic Listing',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      { name: 'Basic Profile', included: true },
      { name: 'Limited Bookings', included: true },
      { name: 'Standard Support', included: true },
      { name: 'Featured Listing', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Branding', included: false },
    ],
  },
  {
    tier: 'basic',
    name: 'Professional',
    price: 29,
    billingPeriod: 'monthly',
    features: [
      { name: 'Enhanced Profile', included: true },
      { name: 'Unlimited Bookings', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Featured Listing', included: false },
      { name: 'Custom Branding', included: false },
      { name: 'Analytics Dashboard', included: false },
    ],
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: 79,
    billingPeriod: 'monthly',
    features: [
      { name: 'Premium Profile', included: true },
      { name: 'Unlimited Bookings', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Featured Listing', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Analytics Dashboard', included: true },
    ],
  },
];

export const SubscriptionPlans = () => {
  const { toast } = useToast();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setShowRegistrationModal(true);
        return;
      }

      const response = await fetch('https://45bdf55e-85bc-4a43-a71d-e38916341d73.functions.supabase.co/v1/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planTier: plan.tier,
          price: plan.price,
          billingPeriod: plan.billingPeriod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground mt-2">
            Select the perfect plan for your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.tier} className={`flex flex-col ${
              plan.tier === 'premium' ? 'border-primary shadow-lg' : ''
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.tier === 'free' ? 'Get started for free' : 'Most popular choice'}
                    </CardDescription>
                  </div>
                  {plan.tier === 'premium' && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.billingPeriod}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.tier === 'premium' ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                >
                  {plan.tier === 'free' ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register as a Worker</DialogTitle>
            <DialogDescription>
              Create your account to start offering your services
            </DialogDescription>
          </DialogHeader>
          <WorkerRegistrationModal />
        </DialogContent>
      </Dialog>
    </>
  );
};
