//src/components/auth/AuthModalHeader.tsx
import { X } from "lucide-react";

interface AuthModalHeaderProps {
  mode: "login" | "register" | "reset";
  onClose: () => void;
}

export const AuthModalHeader = ({ mode, onClose }: AuthModalHeaderProps) => {
  const title = mode === "login" ? "Sign In" : mode === "register" ? "Sign Up" : "Reset Password";
  
  return (
    <div className="relative mb-6">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};
