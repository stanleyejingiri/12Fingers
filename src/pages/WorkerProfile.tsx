import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { mockWorkers } from "@/data/workers";
import { BookingModal } from "@/components/BookingModal";
import { WorkerComments } from "@/components/WorkerComments";
import { WorkerHeader } from "@/components/worker-profile/WorkerHeader";
import { WorkerCertifications } from "@/components/worker-profile/WorkerCertifications";
import { WorkerPortfolio } from "@/components/worker-profile/WorkerPortfolio";
import { WorkerAvailability } from "@/components/worker-profile/WorkerAvailability";

const WorkerProfile = () => {
  const { id } = useParams();
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const { data: worker, isLoading } = useQuery<WorkerProfile>({
  queryKey: ["worker", id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("worker_profiles")
      .select(`
        *,
        certifications(*),
        portfolio_items(*),
        service_packages(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data as WorkerProfile; // Explicit type
  },
});
  
  if (isLoading) return <div>Loading...</div>;
  if (!worker) return <div>Worker not found</div>;

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <WorkerHeader worker={worker} />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">{worker.description}</p>
              </div>

              <WorkerCertifications certifications={worker.certifications || []} />
              <WorkerPortfolio portfolio={worker.portfolio || []} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Experience</h3>
                  <p>{worker.yearsOfExperience} years</p>
                </div>
                <div>
                  <h3 className="font-medium">Hourly Rate</h3>
                  <p>${worker.hourlyRate}/hour</p>
                </div>
                <div>
                  <h3 className="font-medium">Warranty</h3>
                  <p>{worker.offersWarranty ? worker.warrantyDetails : "No warranty offered"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Contact</h3>
                  <p>{worker.contactEmail}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowComments(true)}
                >
                  View Reviews
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Availability
                </h2>
              </CardHeader>
              <CardContent>
                <WorkerAvailability availability={worker.availability} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingModal
        worker={worker}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      <WorkerComments
        workerId={worker.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
};

export default WorkerProfile;