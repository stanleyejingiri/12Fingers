import React from "react";
import { LoadingSkeleton } from "./loading/LoadingSkeleton";
import { LoadingError } from "./loading/LoadingError";
import { useToast } from "@/hooks/use-toast";

interface WorkersLoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export const WorkersLoadingState = ({ 
  isLoading, 
  error,
  onRetry 
}: WorkersLoadingStateProps) => {
  const { toast } = useToast();

  const handleRetry = () => {
    if (onRetry) {
      toast({
        title: "Retrying",
        description: "Attempting to fetch workers again...",
      });
      onRetry();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <LoadingError error={error} onRetry={handleRetry} />;
  }

  return null;
};