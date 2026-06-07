//src/App.tsx
import { HelmetProvider } from "react-helmet-async";
import { AppRoutes } from "./components/routing/AppRoutes";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initAnalytics } from "./lib/analytics";
import { CookieConsent } from "./components/CookieConsent";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { requestNotificationPermission, subscribeToPush } from '@/lib/pushNotifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Initialize analytics with consent check
initAnalytics();

/*function App() {
  // Removed the Supabase test - we're using our own backend now
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <AuthProvider>
            <ErrorBoundary>
              <AppRoutes />
              <Toaster />
              <CookieConsent />
            </ErrorBoundary>
          </AuthProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}*/
function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && 'Notification' in window) {
      // Request permission and subscribe when user is logged in
      const setupPush = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
          await subscribeToPush(user.id);
        }
      };
      setupPush();
    }
  }, [user]);

  // Removed the Supabase test - we're using our own backend now
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <AuthProvider>
            <ErrorBoundary>
              <AppRoutes />
              <Toaster />
              <CookieConsent />
            </ErrorBoundary>
          </AuthProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
export default App;
