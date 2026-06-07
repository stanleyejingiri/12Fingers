//src/hooks/useRegistration.ts
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RegisterFormValues } from "@/components/auth/types";
import { useWorkerProfileCreation } from "./useWorkerProfileCreation";

export function useRegistration(
  onSuccess: () => void, 
  onError: (message: string) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { toast } = useToast();
  const { createWorkerProfile, isCreating } = useWorkerProfileCreation();

  // Update the handleRegister function in useRegistration.ts
const handleRegister = async (values: RegisterFormValues): Promise<void> => {
	// In handleRegister function, add this at the beginning:
	console.log('📤 SENDING REGISTRATION DATA:', JSON.stringify(values, null, 2));
  if (isLoading || isCreating) return;
  setIsLoading(true);
  
  try {
    console.log('Starting registration process with values:', values);

    // Use your MySQL API instead of Supabase
    const response = await fetch('https://one2fingers-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Registration failed');
    }

    console.log('✅ User registered successfully:', data.user.name);
    
    // Auto-login after registration
    const loginResponse = await fetch('https://one2fingers-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      // Store user data
      localStorage.setItem('user_data', JSON.stringify(loginData.user));
      localStorage.setItem('auth_token', 'logged-in');
      
      toast({
        title: "Registration Successful!",
        description: `Welcome ${loginData.user.name}!`,
      });
      
      onSuccess();
    } else {
      throw new Error('Registration successful but auto-login failed');
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    onError(
      error.message || 
      "An unexpected error occurred during registration."
    );
  } finally {
    setIsLoading(false);
  }
};

  return {
    isLoading: isLoading || isCreating,
    verificationSent,
    handleRegister,
  };
}
