//src/components/worker-card/WorkerCardContent.tsx
/*import { CardContent } from "@/components/ui/card";
import { WorkerProfile } from "@/types/worker";
import { WorkerStats } from "./WorkerStats";
import { WorkerDescription } from "./WorkerDescription";
import { WorkerCertifications } from "./WorkerCertifications";
import { WorkerPackages } from "./WorkerPackages";
import { WorkerInteractions } from "./WorkerInteractions";

interface WorkerCardContentProps {
  worker: WorkerProfile;
  distance?: number | null;
  onMessageClick: () => void;
}

export const WorkerCardContent = ({ 
  worker, 
  distance, 
  onMessageClick 
}: WorkerCardContentProps) => {
  const isMobile = window.innerWidth < 640;

  return (
    <CardContent className={`space-y-4 ${isMobile ? 'p-3' : 'p-6'}`}>
		  <WorkerStats worker={worker} distance={distance} />
		  <WorkerDescription description={worker.description} />
		  <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
			<WorkerCertifications certifications={worker.certifications || []} />
			<WorkerPackages packages={worker.servicePackages || []} />
		  </div>
		  <div className={`${isMobile ? 'pt-2' : 'pt-4'}`}>
			<WorkerInteractions
			  worker={worker}
			  onMessageClick={onMessageClick}
			/>
		  </div>
			// In WorkerCardContent.tsx or wherever worker details are shown, add:
			<div className="flex items-center gap-1 text-sm text-gray-600">
			  <MapPin className="h-4 w-4" />
			  <span>
				{worker.city}, {worker.state}, {worker.country}
			  </span>
			</div>
    </CardContent>
  );
};
*/

//src/components/worker-card/WorkerCardContent.tsx
import { CardContent } from "@/components/ui/card";
import { WorkerProfile } from "@/types/worker";
import { WorkerStats } from "./WorkerStats";
import { WorkerDescription } from "./WorkerDescription";
import { WorkerCertifications } from "./WorkerCertifications";
import { WorkerPackages } from "./WorkerPackages";
import { WorkerInteractions } from "./WorkerInteractions";
import { MapPin } from "lucide-react"; // ADD THIS IMPORT

interface WorkerCardContentProps {
  worker: WorkerProfile;
  distance?: number | null;
  onMessageClick: () => void;
}

export const WorkerCardContent = ({ 
  worker, 
  distance, 
  onMessageClick 
}: WorkerCardContentProps) => {
  const isMobile = window.innerWidth < 640;

  return (
    <CardContent className={`space-y-4 ${isMobile ? 'p-3' : 'p-6'}`}>
      <WorkerStats worker={worker} distance={distance} />
      <WorkerDescription description={worker.description} />
      <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
        <WorkerCertifications certifications={worker.certifications || []} />
        <WorkerPackages packages={worker.servicePackages || []} />
      </div>
      
      {/* ADD LOCATION DISPLAY HERE */}
      {worker.city && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>
            {worker.city}{worker.state && `, ${worker.state}`}{worker.country && `, ${worker.country}`}
          </span>
        </div>
      )}
      
      <div className={`${isMobile ? 'pt-2' : 'pt-4'}`}>
        <WorkerInteractions
          worker={worker}
          onMessageClick={onMessageClick}
        />
      </div>
    </CardContent>
  );
};