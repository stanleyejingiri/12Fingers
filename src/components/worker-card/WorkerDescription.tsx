import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface WorkerDescriptionProps {
  description: string;
}

export const WorkerDescription = ({ description }: WorkerDescriptionProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="space-y-2">
      <p className={`text-sm text-gray-600 ${!expanded && 'line-clamp-2'}`}>
        {description}
      </p>
      {description.length > 100 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Show more <ChevronDown className="h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
};
