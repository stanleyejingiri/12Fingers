import React from "react";
import { PortfolioItem } from "@/types/worker";

interface WorkerPortfolioProps {
  portfolio: PortfolioItem[];
}

export const WorkerPortfolio = ({ portfolio }: WorkerPortfolioProps) => {
  if (!portfolio?.length) return null;

  return (
    <div className="border-t pt-4">
      <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Completed: {new Date(item.completedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
