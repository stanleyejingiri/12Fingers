import { useState } from "react";
import { RegistrationForm } from "./RegistrationForm";
import { SubscriptionStep } from "./SubscriptionStep";

export function WorkerRegistrationModal() {
  const [step, setStep] = useState<"details" | "subscription">("details");

  if (step === "subscription") {
    return <SubscriptionStep />;
  }

  return <RegistrationForm onSuccess={() => setStep("subscription")} />;
}
