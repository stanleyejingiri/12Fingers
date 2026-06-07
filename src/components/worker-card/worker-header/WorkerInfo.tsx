//src/components/worker-card/worker-header/WorkerInfo.tsx
/*
import React from "react";
import { Verified } from "lucide-react";

interface WorkerInfoProps {
  name: string;
  category: string;
  isVerified: boolean;
}

export const WorkerInfo = ({ name, category, isVerified }: WorkerInfoProps) => {
  return (
    <div className="flex-1 space-y-1">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        {isVerified && (
          <Verified className="h-4 w-4 text-blue-500 ml-2" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">{category}</p>
    </div>
  );
};
*/
import React from "react";
import { Verified } from "lucide-react";
import { Badge } from "@/components/ui/badge";   // 🔴 add this import

interface WorkerInfoProps {
  name: string;
  category: string;
  isVerified: boolean;
}

export const WorkerInfo = ({ name, category, isVerified }: WorkerInfoProps) => {
  return (
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        {!isVerified && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
            Pending Verification
          </Badge>
        )}
        {isVerified && (
          <Verified className="h-4 w-4 text-blue-500" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">{category}</p>
    </div>
  );
};
