//src/components/worker/worker-card/WorkerFavoriteButton.tsx
/*import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface WorkerFavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export const WorkerFavoriteButton = ({ 
  isFavorite, 
  onToggle 
}: WorkerFavoriteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-primary/10"
      onClick={onToggle}
    >
      <Heart 
        className={`h-5 w-5 transition-colors duration-300 ${
          isFavorite ? 'fill-primary text-primary' : 'text-gray-400'
        }`} 
      />
    </Button>
  );
};*/

//src/components/worker-card/WorkerFavoriteButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

/*interface WorkerFavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}*/
interface WorkerFavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  loading?: boolean;
}

/*export const WorkerFavoriteButton = ({ 
  isFavorite, 
  onToggle 
}: WorkerFavoriteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    console.log('❤️ WorkerFavoriteButton handleClick fired');
    e.stopPropagation();
    
    if (onToggle) {
      console.log('❤️ Calling onToggle function');
      onToggle();
    } else {
      console.log('❌ ERROR: onToggle is undefined!');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-primary/10"
      onClick={handleClick}
    >
      <Heart 
        className={`h-5 w-5 transition-colors duration-300 ${
          isFavorite ? 'fill-primary text-primary' : 'text-gray-400'
        }`} 
      />
    </Button>
  );
};*/

export const WorkerFavoriteButton = ({ 
  isFavorite, 
  onToggle,
  loading = false
}: WorkerFavoriteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-primary/10"
      onClick={onToggle}
      disabled={loading}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <Heart 
          className={`h-5 w-5 transition-colors duration-300 ${
            isFavorite ? 'fill-primary text-primary' : 'text-gray-400'
          }`} 
        />
      )}
    </Button>
  );
};
