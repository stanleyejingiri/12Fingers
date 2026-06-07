import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <SEO 
        title="Privacy Policy"
        description="Learn about how we handle and protect your personal information."
      />
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-gray-600">
                  We collect information you provide directly, including personal details, 
                  professional information, and service-related data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-600">
                  Your information is used to provide and improve our services, facilitate bookings,
                  process payments, and ensure platform security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                <p className="text-gray-600">
                  We share information only as necessary to provide our services and comply with
                  legal obligations. We never sell your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information
                  from unauthorized access, alteration, or disclosure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                <p className="text-gray-600">
                  You have the right to access, correct, or delete your personal information.
                  Contact us to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Cookies Policy</h2>
                <p className="text-gray-600">
                  We use cookies to improve your experience. You can control cookie settings
                  through your browser preferences.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
