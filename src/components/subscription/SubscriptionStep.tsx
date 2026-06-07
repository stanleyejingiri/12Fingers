import { SubscriptionPlans } from "./SubscriptionPlans";

export function SubscriptionStep() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Subscription Plan</h2>
      <SubscriptionPlans />
    </div>
  );
}
