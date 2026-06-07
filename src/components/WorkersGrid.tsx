//src/components/WorkersGrid.tsx
/*import React from "react";
import { WorkerCard } from "./WorkerCard";
import { WorkerProfile } from "@/types/worker";
import { useLocation } from "@/hooks/useLocation";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkersGridProps {
  workers: WorkerProfile[];
  userLocation: [number, number] | null;
  favorites?: string[];
  onToggleFavorite?: (workerId: string) => void;
  isLoading?: boolean;
}

export const WorkersGrid = ({ 
  workers, 
  userLocation,
  favorites = [],
  onToggleFavorite,
  isLoading = false
}: WorkersGridProps) => {
  const { calculateDistance } = useLocation();
  const isMobile = useIsMobile();

  if (isLoading) {
    return null; // Let the WorkersLoadingState component handle the loading UI
  }

  if (!isLoading && workers.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-[400px] flex items-center justify-center">
        <Alert variant="default" className="max-w-md mx-auto bg-white">
          <div className="flex flex-col items-center text-center space-y-4">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            <div>
              <AlertTitle className="text-lg sm:text-xl">No workers found</AlertTitle>
              <AlertDescription className="text-sm sm:text-base">
                Try adjusting your search filters or try a different category.
                You can also try expanding your search radius to find more workers.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${
      isMobile ? '' : 'sm:grid-cols-2 lg:grid-cols-3'
    } gap-4 sm:gap-6 p-2 sm:p-6 [&>*]:h-full`}>
      {workers.map((worker) => {
        const distance = userLocation && worker.location ? 
          calculateDistance(worker.location) : null;

        return (
          <div key={worker.id} className="flex">
            <WorkerCard 
              worker={worker} 
              distance={distance}
              isFavorite={favorites.includes(worker.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        );
      })}
    </div>
  );
};*/

//src/components/WorkersGrid.tsx
/*import React from "react";
import { WorkerCard } from "./WorkerCard";
import { WorkerProfile } from "@/types/worker";
import { useLocation } from "@/hooks/useLocation";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkersGridProps {
  workers: WorkerProfile[];
  userLocation: [number, number] | null;
  favoritesMap: Record<string, boolean>; // Changed from favorites array to map
  onToggleFavorite: (workerId: string) => void;
  isLoading?: boolean;
}

export const WorkersGrid = ({ 
  workers, 
  userLocation,
  favoritesMap = {}, // Default to empty object
  onToggleFavorite,
  isLoading = false
}: WorkersGridProps) => {
	console.log('🟦 WorkersGrid props:', {
    workersCount: workers.length,
    hasOnToggleFavorite: !!onToggleFavorite,
    favoritesMapSize: Object.keys(favoritesMap).length
  });
  
  // TEMPORARY TEST FUNCTION
  const testDirectHandler = (workerId: string) => {
    console.log('🧪 TEST DIRECT HANDLER called for:', workerId);
    console.log('🧪 Real onToggleFavorite exists?', !!onToggleFavorite);
    
    if (onToggleFavorite) {
      console.log('🧪 Calling real onToggleFavorite');
      onToggleFavorite(workerId);
    } else {
      console.log('⚠️ onToggleFavorite is undefined, using fallback');
      alert(`TEST: Would toggle favorite for worker ${workerId}`);
    }
  };
  
  const { calculateDistance } = useLocation();
  const isMobile = useIsMobile();

  if (isLoading) {
    return null; // Let the WorkersLoadingState component handle the loading UI
  }

  if (!isLoading && workers.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-[400px] flex items-center justify-center">
        <Alert variant="default" className="max-w-md mx-auto bg-white">
          <div className="flex flex-col items-center text-center space-y-4">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            <div>
              <AlertTitle className="text-lg sm:text-xl">No workers found</AlertTitle>
              <AlertDescription className="text-sm sm:text-base">
                Try adjusting your search filters or try a different category.
                You can also try expanding your search radius to find more workers.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${
      isMobile ? '' : 'sm:grid-cols-2 lg:grid-cols-3'
    } gap-4 sm:gap-6 p-2 sm:p-6 [&>*]:h-full`}>
      {workers.map((worker) => {
        const distance = userLocation && worker.location ? 
          calculateDistance(worker.location) : null;

        return (
          <div key={worker.id} className="flex">
            <WorkerCard 
              worker={worker} 
              distance={distance}
              isFavorite={favoritesMap[worker.id] || false} // Use the map
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        );
      })}
    </div>
  );
};*/

//src/components/WorkersGrid.tsx
import React from "react";
import { WorkerCard } from "./WorkerCard";
import { WorkerProfile } from "@/types/worker";
import { useLocation } from "@/hooks/useLocation";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkersGridProps {
  workers: WorkerProfile[];
  userLocation: [number, number] | null;
  favoritesMap: Record<string, boolean>;
  onToggleFavorite: (workerId: string) => void;
  isLoading?: boolean;
}

export const WorkersGrid = ({ 
  workers, 
  userLocation,
  favoritesMap = {},
  onToggleFavorite,
  isLoading = false
}: WorkersGridProps) => {
  console.log('🟦 WorkersGrid props:', {
    workersCount: workers.length,
    hasOnToggleFavorite: !!onToggleFavorite,
    favoritesMapSize: Object.keys(favoritesMap).length
  });
  
  // TEMPORARY TEST FUNCTION
  /*const testDirectHandler = (workerId: string) => {
    console.log('🧪 TEST DIRECT HANDLER called for:', workerId);
    console.log('🧪 Real onToggleFavorite exists?', !!onToggleFavorite);
    
    if (onToggleFavorite) {
      console.log('🧪 Calling real onToggleFavorite');
      onToggleFavorite(workerId);
    } else {
      console.log('⚠️ onToggleFavorite is undefined, using fallback');
      alert(`TEST: Would toggle favorite for worker ${workerId}`);
    }
  };*/
  
  const { calculateDistance } = useLocation();
  const isMobile = useIsMobile();

  if (isLoading) {
    return null;
  }

  if (!isLoading && workers.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-[400px] flex items-center justify-center">
        <Alert variant="default" className="max-w-md mx-auto bg-white">
          <div className="flex flex-col items-center text-center space-y-4">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            <div>
              <AlertTitle className="text-lg sm:text-xl">No workers found</AlertTitle>
              <AlertDescription className="text-sm sm:text-base">
                Try adjusting your search filters or try a different category.
                You can also try expanding your search radius to find more workers.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${
      isMobile ? '' : 'sm:grid-cols-2 lg:grid-cols-3'
    } gap-4 sm:gap-6 p-2 sm:p-6 [&>*]:h-full`}>
      {workers.map((worker) => {
        const distance = userLocation && worker.location ? 
          calculateDistance(worker.location) : null;

        return (
          <div key={worker.id} className="flex">
            <WorkerCard 
              worker={worker} 
              distance={distance}
              isFavorite={favoritesMap[worker.id] || false}
              /*onToggleFavorite={testDirectHandler}*/ // ← CHANGE THIS LINE: Use test function
			  onToggleFavorite={onToggleFavorite}
            />
          </div>
        );
      })}
    </div>
  );
};
