//src/pages/index.tsx
import React, { useState, useEffect } from "react";
import { WorkersList } from "@/components/WorkersList";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false); // ADD THIS
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        setShowAuthModal(false);
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const toggleMobileFilters = () => { // ADD THIS
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <>
      <SEO />
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col" role="main">
          <Header 
            onShowAuthModal={() => setShowAuthModal(true)}
            onShowProfileModal={() => setShowProfileModal(true)}
            onToggleMobileFilters={toggleMobileFilters} // ADD THIS
            isMobileFiltersOpen={isMobileFiltersOpen} // ADD THIS
          />

          <main 
            className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow w-full"
            aria-label="Worker listings"
          >
            <ErrorBoundary>
              {/* Pass mobile state to WorkersList */}
              <WorkersList 
                isMobileFiltersOpen={isMobileFiltersOpen}
                onMobileFiltersToggle={toggleMobileFilters}
              />
            </ErrorBoundary>
          </main>

          <Footer />

          {showAuthModal && !user && (
            <AuthModal onClose={handleAuthModalClose} />
          )}
        </div>
      </ErrorBoundary>
    </>
  );
};

export default Index;
