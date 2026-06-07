import { Button } from "@/components/ui/button";

interface VerificationMessageProps {
  onClose: () => void;
}

export function VerificationMessage({ onClose }: VerificationMessageProps) {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Verification Email Sent!</h3>
      <p className="text-gray-600">
        Please check your email to verify your account. The verification link will expire in 24 hours.
      </p>
      <Button onClick={onClose} variant="outline">
        Return to Sign In
      </Button>
    </div>
  );
}
