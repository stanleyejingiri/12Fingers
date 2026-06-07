import React from "react";
import { Crown } from "lucide-react";

export const WorkerPremiumBadge = () => {
  return (
    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 animate-fade-in">
      <Crown className="h-4 w-4" />
    </div>
  );
};