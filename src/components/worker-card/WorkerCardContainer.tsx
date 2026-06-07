//src/components/worker-card/WorkerCardContainer.tsx
/*import { Card } from "@/components/ui/card";
import { WorkerProfile } from "@/types/worker";
import { WorkerPremiumBadge } from "./WorkerPremiumBadge";
import { WorkerFavoriteButton } from "./WorkerFavoriteButton";

interface WorkerCardContainerProps {
  worker: WorkerProfile;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  children: React.ReactNode;
}

export const WorkerCardContainer = ({ 
  worker, 
  isFavorite, 
  onFavoriteToggle, 
  children 
}: WorkerCardContainerProps) => {
  return (
    <Card 
      className={`w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
        worker.isPremium ? 'border-2 border-primary' : ''
      }`}
      role="article"
      aria-labelledby={`worker-name-${worker.id}`}
    >
      {worker.isPremium && <WorkerPremiumBadge />}
      
      <div className="absolute top-2 right-2">
        <WorkerFavoriteButton 
          isFavorite={isFavorite} 
          onToggle={onFavoriteToggle}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        />
      </div>

      {children}
    </Card>
  );
};*/

//src/components/worker-card/WorkerCardContainer.tsx
import { Card } from "@/components/ui/card";
import { WorkerProfile } from "@/types/worker";
import { WorkerPremiumBadge } from "./WorkerPremiumBadge";
import { WorkerFavoriteButton } from "./WorkerFavoriteButton";

interface WorkerCardContainerProps {
  worker: WorkerProfile;
  isFavorite: boolean;
  onFavoriteToggle: () => void;  // ← This should be () => void
  children: React.ReactNode;
}

export const WorkerCardContainer = ({ 
  worker, 
  isFavorite, 
  onFavoriteToggle, 
  children 
}: WorkerCardContainerProps) => {
  console.log('🟡 WorkerCardContainer rendered:', {
    workerId: worker.id,
    isFavorite,
    hasOnFavoriteToggle: !!onFavoriteToggle
  });

  return (
    <Card 
      className={`w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
        worker.isPremium ? 'border-2 border-primary' : ''
      }`}
      role="article"
      aria-labelledby={`worker-name-${worker.id}`}
    >
      {worker.isPremium && <WorkerPremiumBadge />}
      
      <div className="absolute top-2 right-2">
        <WorkerFavoriteButton 
          isFavorite={isFavorite} 
          onToggle={() => {
            console.log('🟢 WorkerFavoriteButton clicked for worker:', worker.id);
            if (onFavoriteToggle) {
              console.log('🟢 Calling onFavoriteToggle');
              onFavoriteToggle();
            } else {
              console.log('❌ onFavoriteToggle is undefined!');
            }
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        />
      </div>

      {children}
    </Card>
  );
};
