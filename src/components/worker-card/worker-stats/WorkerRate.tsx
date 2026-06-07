import React from "react";

interface WorkerRateProps {
  hourlyRate: number;
}

export const WorkerRate = ({ hourlyRate }: WorkerRateProps) => {
  return (
    <p className="font-medium">${hourlyRate}/hour</p>
  );
};
