import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingErrorProps {
  error: Error;
  onRetry?: () => void;
}

export const LoadingError = ({ error, onRetry }: LoadingErrorProps) => {
  const errorMessage = error.message || "An unexpected error occurred";
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('fetch');
  const isAuthError = errorMessage.toLowerCase().includes('unauthorized') || 
                     errorMessage.toLowerCase().includes('forbidden');
  
  let title = "Error";
  let description = errorMessage;

  if (isNetworkError) {
    title = "Connection Error";
    description = "Please check your internet connection and try again";
  } else if (isAuthError) {
    title = "Authentication Error";
    description = "Please sign in to view workers";
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{description}</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};