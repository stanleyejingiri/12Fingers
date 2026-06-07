//src/components/worker-card/WorkerHeader.tsx
import React from "react";
import { WorkerProfile } from "@/types/worker";
import { WorkerAvatar } from "./worker-header/WorkerAvatar";
import { WorkerInfo } from "./worker-header/WorkerInfo";

interface WorkerHeaderProps {
  worker: WorkerProfile;
  onEditClick?: () => void;
}

export const WorkerHeader = ({ worker, onEditClick }: WorkerHeaderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <WorkerAvatar 
        name={worker.name} 
        profileImageUrl={worker.profileImageUrl} 
      />
      <WorkerInfo 
        name={worker.name}
        category={worker.category}
        isVerified={worker.isVerified}
      />
    </div>
  );
};