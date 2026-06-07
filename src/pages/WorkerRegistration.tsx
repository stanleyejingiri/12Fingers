//src/pages/WorkerRegistration.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function WorkerRegistration() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    toast({
      title: "Registration Successful!",
      description: "Welcome to our worker community! Please complete your profile to start receiving bookings.",
    });
    navigate("/worker-dashboard");
  };

  const handleError = (message: string) => {
    setError(message);
    toast({
      variant: "destructive",
      title: "Registration Error",
      description: message,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Become a Service Provider</h1>
        <RegisterForm 
          onSuccess={handleSuccess}
          onError={handleError}
          defaultUserType="worker"
        />
      </Card>
    </div>
  );
}