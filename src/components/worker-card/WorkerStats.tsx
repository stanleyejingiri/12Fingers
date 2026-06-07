import React from "react";
import { WorkerProfile } from "@/types/worker";

//import { WorkerRating } from "./worker-stats/WorkerRating";
import WorkerRating from './worker-stats/WorkerRating'; // Remove curly braces

import { WorkerExperience } from "./worker-stats/WorkerExperience";

import { WorkerCertificationCount } from "./worker-stats/WorkerCertificationCount";
import { WorkerDistance } from "./worker-stats/WorkerDistance";
import { WorkerRate } from "./worker-stats/WorkerRate";

interface WorkerStatsProps {
  worker: WorkerProfile;
  distance?: number | null;
}

export const WorkerStats = ({ worker, distance }: WorkerStatsProps) => {
  return (
    <div className="space-y-2">
      <WorkerRating 
        rating={worker.averageRating} 
        totalRatings={worker.totalRatings} 
      />
      <div className="text-sm space-y-1">
        <WorkerExperience yearsOfExperience={worker.yearsOfExperience} />
        <WorkerCertificationCount certifications={worker.certifications || []} />
        <WorkerDistance distance={distance} />
        <WorkerRate hourlyRate={worker.hourlyRate} />
      </div>
    </div>
  );
};
