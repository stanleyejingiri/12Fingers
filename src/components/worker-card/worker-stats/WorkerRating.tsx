import { Star } from "lucide-react";

interface WorkerRatingProps {
  rating?: number;
  totalRatings?: number;
}

const WorkerRating = ({ rating, totalRatings }: WorkerRatingProps) => {
  const safeRating = rating || 0;
  const safeTotalRatings = totalRatings || 0;
  
  const displayRating = safeRating.toFixed(1);

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{displayRating}</span>
      {safeTotalRatings > 0 && (
        <span className="text-xs text-muted-foreground">
          ({safeTotalRatings})
        </span>
      )}
    </div>
  );
};

export default WorkerRating; // DEFAULT EXPORT



