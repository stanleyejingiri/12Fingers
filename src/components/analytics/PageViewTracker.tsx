import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  trackPageView, 
  startPerformanceTransaction,
  trackPagePerformance 
} from "@/lib/analytics";

export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Start a performance transaction for the page view
    const transaction = startPerformanceTransaction(`PageView: ${location.pathname}`);
    
    // Track page view and performance metrics
    trackPageView(location.pathname + location.search);
    trackPagePerformance(location.pathname + location.search);
    
    // End the transaction when the component unmounts or route changes
    return () => {
      transaction.finish();
    };
  }, [location]);

  return null;
}