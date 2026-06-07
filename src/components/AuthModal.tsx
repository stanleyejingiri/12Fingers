//src/components/AuthModal.tsx
import { useState } from "react";
import { Card } from "./ui/card";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";
import { ResetPasswordForm } from "./auth/ResetPasswordForm";
import { Alert, AlertDescription } from "./ui/alert";
import { AuthModalHeader } from "./auth/AuthModalHeader";
import { AuthModalFooter } from "./auth/AuthModalFooter";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    const errorMap: Record<string, string> = {
      "Invalid login credentials": "The email or password you entered is incorrect. Please try again.",
      "Email not confirmed": "Please check your email and verify your account before signing in.",
      "User already registered": "This email is already registered. Please try signing in instead.",
      "Password should be at least 6 characters": "Please use a stronger password with at least 6 characters.",
      "Rate limit exceeded": "Too many attempts. Please try again in a few minutes.",
    };

    setError(errorMap[message] || message);
  };

  const handleModeChange = (newMode: "login" | "register" | "reset") => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="p-6 w-full max-w-md mx-auto relative bg-white">
        <AuthModalHeader mode={mode} onClose={onClose} />
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {mode === "login" ? (
          <LoginForm onSuccess={onClose} onError={handleError} />
        ) : mode === "register" ? (
          <RegisterForm onSuccess={onClose} onError={handleError} />
        ) : (
          <ResetPasswordForm />
        )}

        <AuthModalFooter mode={mode} onModeChange={handleModeChange} />
      </Card>
    </div>
  );
}