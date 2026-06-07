import React from "react";
import { Button } from "@/components/ui/button";

interface WorkerBookingActionsProps {
  onBookClick: () => void;
  onCommentsClick: () => void;
}

export const WorkerBookingActions = ({ 
  onBookClick, 
  onCommentsClick 
}: WorkerBookingActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        className="flex-1 hover:scale-105 transition-transform duration-200"
        onClick={onBookClick}
      >
        Book Now
      </Button>
      <Button 
        variant="outline" 
        onClick={onCommentsClick}
        className="hover:bg-secondary transition-colors duration-200"
      >
        View Comments
      </Button>
    </div>
  );
};
