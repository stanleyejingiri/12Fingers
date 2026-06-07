/**src/components/PaginatedWorkers.tsx
 * @component PaginatedWorkers
 * @description Handles pagination for the workers list.
 * Displays workers in a grid layout with pagination controls.
 */
/*import React from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { WorkersGrid } from "./WorkersGrid";
import { WorkerProfile } from "@/types/worker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PaginatedWorkersProps {
  workers: WorkerProfile[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  userLocation: [number, number] | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const PaginatedWorkers = ({
  workers,
  currentPage,
  totalPages,
  itemsPerPage,
  userLocation,
  isLoading,
  onPageChange,
}: PaginatedWorkersProps) => {
	console.log('🟪 PaginatedWorkers props:', {
    hasOnToggleFavorite: !!onToggleFavorite
  });
  
  const isMobile = useIsMobile();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, workers.length);
  const paginatedWorkers = workers.slice(startIndex, endIndex);

  if (!isLoading && workers.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-[400px] flex items-center justify-center">
        <Alert variant="default" className="max-w-md mx-auto bg-white">
          <div className="flex flex-col items-center text-center space-y-4">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            <div>
              <AlertDescription className="text-sm sm:text-base">
                No workers found matching your criteria. Try adjusting your filters or search terms.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkersGrid 
        workers={paginatedWorkers} 
        userLocation={userLocation}
        isLoading={isLoading} 
      />
      
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            {!isMobile && currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (isMobile) {
                  // On mobile, show only current page and immediate neighbors
                  return Math.abs(page - currentPage) <= 1;
                }
                // On desktop, show all pages
                return true;
              })
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            
            {!isMobile && currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};*/

/**src/components/PaginatedWorkers.tsx
 * @component PaginatedWorkers
 * @description Handles pagination for the workers list.
 * Displays workers in a grid layout with pagination controls.
 */
import React from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { WorkersGrid } from "./WorkersGrid";
import { WorkerProfile } from "@/types/worker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PaginatedWorkersProps {
  workers: WorkerProfile[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  userLocation: [number, number] | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  favoritesMap: Record<string, boolean>; // ADD THIS
  onToggleFavorite: (workerId: string) => void; // ADD THIS
}

export const PaginatedWorkers = ({
  workers,
  currentPage,
  totalPages,
  itemsPerPage,
  userLocation,
  isLoading,
  onPageChange,
  favoritesMap, // ADD THIS
  onToggleFavorite, // ADD THIS
}: PaginatedWorkersProps) => {
  console.log('🟪 PaginatedWorkers props:', {
    hasOnToggleFavorite: !!onToggleFavorite,
    hasFavoritesMap: !!favoritesMap
  });
  
  const isMobile = useIsMobile();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, workers.length);
  const paginatedWorkers = workers.slice(startIndex, endIndex);

  if (!isLoading && workers.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-[400px] flex items-center justify-center">
        <Alert variant="default" className="max-w-md mx-auto bg-white">
          <div className="flex flex-col items-center text-center space-y-4">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            <div>
              <AlertDescription className="text-sm sm:text-base">
                No workers found matching your criteria. Try adjusting your filters or search terms.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkersGrid 
        workers={paginatedWorkers} 
        userLocation={userLocation}
        isLoading={isLoading}
        favoritesMap={favoritesMap} // PASS THIS
        onToggleFavorite={onToggleFavorite} // PASS THIS
      />
      
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            {!isMobile && currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (isMobile) {
                  // On mobile, show only current page and immediate neighbors
                  return Math.abs(page - currentPage) <= 1;
                }
                // On desktop, show all pages
                return true;
              })
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            
            {!isMobile && currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
