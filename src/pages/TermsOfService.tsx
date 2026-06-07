import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <SEO 
        title="Terms of Service"
        description="Read our terms of service and conditions of use."
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
            <FileText className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using WorkerMatch, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
                <p className="text-gray-600">
                  WorkerMatch is a platform connecting skilled workers with clients needing their services. 
                  We facilitate the connection but are not responsible for the actual services provided.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                <p className="text-gray-600">
                  Users must provide accurate information and maintain the confidentiality of their account.
                  Any misuse of the platform may result in account termination.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Service Provider Guidelines</h2>
                <p className="text-gray-600">
                  Service providers must maintain professional standards, provide accurate information about their services,
                  and fulfill their commitments to clients.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Payment Terms</h2>
                <p className="text-gray-600">
                  All payments are processed securely through our platform. Service providers will receive payment
                  after service completion and client confirmation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Dispute Resolution</h2>
                <p className="text-gray-600">
                  In case of disputes, users agree to first attempt resolution through our platform's
                  dispute resolution process before seeking external remedies.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}